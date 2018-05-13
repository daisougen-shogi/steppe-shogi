"use strict";
import {ipcMain as ipc} from "electron";
import {dirname, basename} from "path";
import {Observable, Subscription} from "rxjs";
import USI from "../node-usi/src/index";
import * as constants from "./constants";
import {EngineConfig} from "./config";
import {USIProtocol, parseInfo} from "./USIProtocol";

export default class EngineProcessor {
  private sender: Electron.WebContents;
  private processes: [string, USI][];
  private subscription: Subscription;

  constructor(configs: EngineConfig[]) {
    this.processes = configs.map<[string, USI]>(config => {
      const cwd = dirname(config.path);
      return [config.id, USI.execFile(config.path, [], {cwd})];
    });

    const info = this.processes.map(([id, p]) => p.info.map<string[], [string, string[]]>(vs => [id, vs]));
    this.subscription = Observable.merge(...info).subscribe(([id, values]) => {
      this.sendRenderer("engine:response", id, parseInfo(values));
    });
  }

  wakeup(sender: Electron.WebContents) {
    this.sender = sender;

    ipc.on("engine:usi", async () => {
      await this.init();
    });

    ipc.on("engine:ready", async (_: any, id: string) => {
      await this.ready(id);
    });

    ipc.on("engine:new-game", async (_: any, sfen: string) => {
      await this.newGame(sfen);
    });

    ipc.on("engine:next", async (_: any, sfen: string) => {
      await this.next(sfen);
    });

    ipc.on("engine:game-over", async () => {
      await this.end();
    });

    ipc.on("engine:command", async (_: any, command: string) => {
      await this.send(command);
    });
  }

  async send(command: string) {
    for (const [_, p] of this.processes) {
      await p.write(command);
    }
  }

  async newGame(sfen: string) {
    for (const [_, p] of this.processes) {
      await p.newGame();
      await p.positionSfen(sfen, []);
      await p.go([]);
    }
  }

  close() {
    this.subscription.unsubscribe();
    for (const [_, p] of this.processes) {
      p.kill();
    }
  }

  private async init() {
    for (const [id, p] of this.processes) {
      await p.init();
      this.sendRenderer("engine:response", id, {type: constants.usiok});
    }
  }

  private async ready(id: string) {
    const [_, p] = this.processes.find(([i, _]) => i === id);
    await p.ready();
    this.sendRenderer("engine:response", id, {type: constants.readyok});
  }

  private sendRenderer(channel: string, id: string, protocol: USIProtocol) {
    this.sender.send(channel, id, protocol);
  }

  private async next(sfen: string) {
    for (const [_, p] of this.processes) {
      await p.stop();
      await p.positionSfen(sfen, []);
      await p.go([]);
    }
  }

  private async end() {
    for (const [id, p] of this.processes) {
      // 勝敗はダミーでよい?
      await p.gameOver("draw");
      await this.ready(id);
    }
  }
}
