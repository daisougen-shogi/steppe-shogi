"use strict";
import {observable, computed} from "mobx";
import * as protocol from "../USIProtocol";
import {EngineConfig} from "../config";
import * as constants from "../constants";
import {Score} from "../Score";

export default class Engine {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  @observable scores: Score[];
  @observable private _state: protocol.USIProtocol;

  constructor(config: EngineConfig) {
    this.id = config.id;
    this.name = config.name;
    this.color = config.color;
    this.scores = [
      {
        turn: 0,
        value: 0
      }
    ];
    this._state = {
      type: "unknown"
    };
  }

  set state(state: protocol.USIProtocol) {
    if (this._state.type === "info" && state.type === "info" && this._state.multipv <= state.multipv) {
      return;
    }
    if (state.type === "info" && "pv" in state === false) {
      state.pv = [];
    }
    this._state = state;
  }

  @computed
  get state() {
    return this._state;
  }
}
