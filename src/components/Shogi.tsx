import {observer} from "mobx-react";
import * as React from "react";
import Kifu from "./Kifu";
import Graph from "./Graph";

const style = {
  display: "flex",
  justifyContent: "space-between"
}

export interface ShogiProps {
}

@observer
export default class Shogi extends React.Component<ShogiProps, {}> {

  render() {
    return (
      <div style={style}>
        <Kifu />
        <Graph />
      </div>
    )
  }
}
