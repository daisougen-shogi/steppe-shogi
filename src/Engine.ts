"use strict";
import {ipcMain as ipc} from "electron";
import {spawn} from "spawn-rx";
import {Observable, Subject, Subscription} from "rxjs";
import {dirname, basename} from "path";
import {EngineConfig} from "./config";

export default class Engine {
  private sender: Electron.WebContents;
  private subscriptions: Subscription[];
  private input: Subject<string>;

  constructor() {
    this.input = new Subject<string>();
  }

  wakeup(sender: Electron.WebContents, configs: EngineConfig[]) {
    this.sender = sender;

    this.subscriptions = configs.map(config => {
      const cwd = dirname(config.path);
      return spawn(config.path, [], {
        cwd,
        stdin: this.input
      }).subscribe(response => {
        this.sender.send("engine:response", response);
      });
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
    for (const s of this.subscriptions) {
      s.unsubscribe();
    }
  }
}
