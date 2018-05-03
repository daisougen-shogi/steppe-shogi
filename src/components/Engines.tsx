"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import EngineStore from "../stores/EngineStore";

export interface EngineProps {
  engineStore?: EngineStore
}

@inject("engineStore")
@observer
export default class Engine extends React.Component<EngineProps, {}> {

  render() {
    return (
      <div>
        <p>{this.props.engineStore.response}</p>
      </div>
    );
  }
}
