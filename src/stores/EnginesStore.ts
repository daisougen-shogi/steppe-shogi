"use strict";
import {observable} from "mobx";
import {IpcRenderer} from "electron";
import Engine from "./Engine";
import * as protocol from "../USIProtocol";
import {EngineConfig} from "../config";
import {usiok, readyok, unknown} from "../constants";
import {Score} from "../Score";

export default class EnginesStore {
  engines: Engine[];
  configs: EngineConfig[];
  @observable private scores: Map<string, Score[]>;
  private ipc: IpcRenderer;

  constructor(ipc: IpcRenderer, configs: EngineConfig[]) {
    this.ipc = ipc;
    this.engines = configs.map(c => new Engine(c));
  }

  apply(id: string, response: protocol.USIProtocol, turn: number) {
    const engine = this.engines.find(e => e.id === id);
    engine.state = response;
    switch (response.type) {
      case usiok:
        this.ready(id);
        return;
      case readyok:
      case unknown:
        return;
    }
  }

  usi() {
    this.ipc.send("engine:usi");
  }

  private ready(id: string) {
    this.ipc.send("engine:ready", id);
  }

  private addScore(engine: Engine, turn: number, value: number) {
    engine.scores.push({
      turn,
      value
    });
  }
}
