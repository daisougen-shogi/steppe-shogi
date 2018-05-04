"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import USIEngine from "../stores/Engine";

export interface EngineProps {
  engine: USIEngine
}

@observer
export default class Engine extends React.Component<EngineProps, {}> {

  render() {
    const engine = this.props.engine;
    return (
      <div className="engine" >
        <span style={{ color: engine.color }} >{engine.name}</span>
        <p>{engine.status}</p>
      </div>
    );
  }
}