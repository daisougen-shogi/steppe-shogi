"use strict";
import {observable, computed} from "mobx";
import * as protocol from "../USIProtocol";
import {EngineConfig} from "../config";

export default class Engine {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  @observable private _state: protocol.USIProtocol;

  constructor(config: EngineConfig) {
    this.id = config.id;
    this.name = config.name;
    this.color = config.color;
    this._state = {
      type: "unknown"
    };
  }

  set state(state: protocol.USIProtocol) {
    this._state = state;
  }

  @computed
  get status(): string {
    switch (this._state.type) {
      case "usiok":
        return "起動";
      case "unknown":
        return "Unknown";
    }
  }
}
