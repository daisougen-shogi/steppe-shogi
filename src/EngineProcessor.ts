"use strict";
import {ipcMain as ipc} from "electron";
import {Observable, Subject, Subscription} from "rxjs";
import {dirname, basename} from "path";
import USI from "../node_usi/src/index";
import {EngineConfig} from "./config";

export default class EngineProcessor {
  private sender: Electron.WebContents;
  private processes: [string, USI][];
  private input: Subject<string>;

  constructor() {
    this.input = new Subject<string>();
  }

  wakeup(sender: Electron.WebContents, configs: EngineConfig[]) {
    this.sender = sender;

    this.processes = configs.map<[string, USI]>(config => {
      const cwd = dirname(config.path);
      return [config.id, USI.connect(config.path, [], {cwd})];
    });

    ipc.on("engine:usi", async () => {
      this.init();
    });

    ipc.on("engine:command", async (_: any, command: string) => {
      this.send(command);
    });
  }

  async send(command: string) {
    for (const [id, p] of this.processes) {
      await p.write(command);
    }
  }

  close() {
    for (const [_, p] of this.processes) {
      p.kill();
    }
  }

  private async init() {
    for (const [id, p] of this.processes) {
      await p.init();
      this.sender.send("engine:response", id, {type: "usiok"});
    }
  }
}
