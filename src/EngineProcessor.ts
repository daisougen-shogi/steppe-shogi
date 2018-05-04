"use strict";
import {ipcMain as ipc} from "electron";
import {spawn} from "spawn-rx";
import {Observable, Subject, Subscription} from "rxjs";
import {dirname, basename} from "path";
import {EngineConfig} from "./config";

export default class EngineProcessor {
  private sender: Electron.WebContents;
  private subscription: Subscription;
  private input: Subject<string>;

  constructor() {
    this.input = new Subject<string>();
  }

  wakeup(sender: Electron.WebContents, configs: EngineConfig[]) {
    this.sender = sender;

    const ps = configs.map(config => {
      const cwd = dirname(config.path);
      return spawn(config.path, [], {
        cwd,
        stdin: this.input
      }).map<string, [string, string[]]>(res => [config.id, res.split("\n").filter(c => c !== "\n" && c !== "")]);
    });
    this.subscription = Observable.merge(...ps).subscribe(([id, response]) => {
      this.sender.send("engine:response", id, response);
    });

    ipc.on("engine:command", (_: any, command: string) => {
      this.send(command);
    });
  }

  send(command: string) {
    this.input.next(`${command}\n`);
  }

  close() {
    this.input.unsubscribe();
    this.subscription.unsubscribe();
  }
}
