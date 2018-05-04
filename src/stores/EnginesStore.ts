"use strict";
import {observable} from "mobx";
import {IpcRenderer} from "electron";
import Engine from "./Engine";
import * as protocol from "../USIProtocol";
import {EngineConfig} from "../config";

export default class EnginesStore {
  engines: Engine[];
  private ipc: IpcRenderer;

  constructor(ipc: IpcRenderer, configs: EngineConfig[]) {
    this.ipc = ipc;
    this.engines = configs.map(c => new Engine(c));
  }

  apply(id: string, response: string[]) {
    const engine = this.engines.find(e => e.id === id);
    if (response.find(res => res.startsWith("usiok"))) {
      engine.state = {
        type: "usiok"
      };
    }
  }

  usi() {
    // USIエンジン起動時に最初に送るコマンド
    this.ipc.send("engine:command", "usi");
  }
}
