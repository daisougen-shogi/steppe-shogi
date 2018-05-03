"use strict";
import {EngineConfig} from "../config";

export default class ScoreStore {
  data: any;

  constructor(engines: EngineConfig[]) {
    const datasets = engines.map(e => ({
      label: e.name,
      fill: false,
      lineTension: 0.1,
      backgroundColor: e.color,
      borderColor: e.color,
      data: [
        {
          x: 0,
          y: 0
        },
        {
          x: 1,
          y: 65
        }
      ]
    }));
    this.data = {
      datasets
    };
  }
}
