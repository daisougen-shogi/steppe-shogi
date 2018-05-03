import {observer} from "mobx-react";
import * as React from "react";
import Board from "./Board";
import Graph from "./Graph";

const style = {
  display: "flex",
  "justify-content": "space-between"
}

@observer
export default class Shogi extends React.Component<{}, {}> {

  render() {
    return (
      <div style={style}>
        <Board />
        <Graph />
      </div>
    )
  }
}