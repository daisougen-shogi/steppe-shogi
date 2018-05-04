"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import EnginesStore from "../stores/EnginesStore";
import Engine from "./Engine";

export interface EnginesProps {
  enginesStore?: EnginesStore
}

@inject("enginesStore")
export default class Engines extends React.Component<EnginesProps, {}> {

  render() {
    return (
      <div className="engines" >
        {this.props.enginesStore.engines.map(e => <Engine key={e.id} engine={e} />)}
      </div>
    );
  }
}
