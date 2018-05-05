"use strict";
import {observable} from "mobx";
import {IpcRenderer} from "electron";
import Engine from "./Engine";
import * as protocol from "../USIProtocol";
import {EngineConfig} from "../config";
import {usiok, readyok, unknown} from "../constants";

interface Score {
  x: number;
  y: number;
}

export default class EnginesStore {
  engines: Engine[];
  data: any;
  private scores: Map<string, Score[]>;
  private ipc: IpcRenderer;

  constructor(ipc: IpcRenderer, configs: EngineConfig[]) {
    this.ipc = ipc;
    this.engines = configs.map(c => new Engine(c));

    this.scores = new Map<string, Score[]>();
    const datasets = configs.map(c => {
      const data = [
        {
          x: 0,
          y: 0
        }
      ];
      this.scores.set(c.id, data);
      return {
        label: c.name,
        fill: false,
        lineTension: 0.1,
        backgroundColor: c.color,
        borderColor: c.color,
        data
      };
    });
    this.data = {
      datasets
    };
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

  private addScore(id: string, turn: number, score: number) {
    this.scores.get(id).push({
      x: turn,
      y: score
    });
  }
}
