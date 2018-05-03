"use strict";
import {ipcMain as ipc} from "electron";
import {EngineConfig} from "./config";
import USIEngineProcess from "./USIEngineProcess";

export default class Engine {
  private sender: Electron.WebContents;
  private engines: USIEngineProcess[];

  constructor(configs: EngineConfig[]) {
    this.engines = configs.map(c => new USIEngineProcess(c));
  }

  wakeup(sender: Electron.WebContents) {
    this.sender = sender;

    for (const e of this.engines) {
      e.event.on("response", (response: string) => {
        this.sender.send("engine:response", response);
      });
    }

    ipc.on("engine:command", (_: any, command: string) => {
      this.send(command);
    });
  }

  send(command: string) {
    for (const e of this.engines) {
      e.write(command);
    }
  }

  close() {
    for (const e of this.engines) {
      e.close();
    }
  }
}
