"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import USIEngine from "../stores/Engine";
import * as protocol from "../USIProtocol";
import * as constants from "../constants";

export interface EngineProps {
  engine: USIEngine
}

@observer
export default class Engine extends React.Component<EngineProps, {}> {

  status(state: protocol.USIProtocol) {
    switch (state.type) {
      case constants.usiok:
        return [<p>"起動"</p>];
      case constants.readyok:
        return [<p>"準備完了"</p>];
      case constants.info:
        return state.pv.slice().map((v, i) => <p key={i} >{v}</p>);
      case constants.unknown:
        return [<p>"Unknown"</p>];
    }
  }
  
  render() {
    const engine = this.props.engine;
    return (
      <div className="engine" >
        <span style={{ color: engine.color }} >{engine.name}</span>
        {this.status(this.props.engine.state)}
      </div>
    );
  }
}