import { observer } from "mobx-react";
import * as React from "react";
import {JKFPlayer} from "json-kifu-format";
import KifuStore from "../stores/KifuStore";
import Piece from "./Piece";

export interface BoardProps {
  kifuStore: KifuStore
}

@observer
export default class Board extends React.Component<BoardProps, {}> {
  
  private nineY = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  private nineX = this.nineY.slice().reverse();
  
  render() {
    const {player} = this.props.kifuStore;
    const board = player.getState().board;

    const trs = this.nineY.map(y => {
      const pieces = this.nineX.map(x =>
        <Piece
           key={x}
           data={board[x - 1][y - 1]}
           x={x}
           y={y}
           kifuStore={this.props.kifuStore}
        />
      );
      return (
        <tr key={y}>
          {pieces}
          <th>{JKFPlayer.numToKan(y)}</th>
        </tr>
      );
    });

    return (
      <table className="ban">
        <tbody>
          <tr>{ this.nineX.map(x => <th key={x}>{x}</th>) }</tr>
          {trs}
        </tbody>
      </table>
    );
  }
}
