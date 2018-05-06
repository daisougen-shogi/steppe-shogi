import {inject, observer} from "mobx-react";
import * as React from "react";
import Kifu from "./Kifu";
import Graph from "./Graph";
import EnginesStore from "../stores/EnginesStore";

const style = {
  display: "flex",
  justifyContent: "space-between"
}

export interface ShogiProps {
  enginesStore?: EnginesStore
}

@inject("enginesStore")
@observer
export default class Shogi extends React.Component<ShogiProps, {}> {

  render() {
    return (
      <div style={style}>
        <Kifu />
        <Graph engines={this.props.enginesStore.engines} />
      </div>
    )
  }
}
