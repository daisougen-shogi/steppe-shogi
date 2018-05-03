"use strict";
import {observable} from "mobx";
import {IpcRenderer} from "electron";

export default class EngineStore {
  @observable response: string;
  private ipc: IpcRenderer;

  constructor(ipc: IpcRenderer) {
    this.ipc = ipc;
    this.response = "";
  }

  apply(response: string) {
    const cs = response.split("\n").filter(c => c !== "\n" && c !== "");
    this.response += cs[cs.length - 1];
  }

  usi() {
    // USIエンジン起動時に最初に送るコマンド
    this.ipc.send("engine:command", "usi");
  }
}
