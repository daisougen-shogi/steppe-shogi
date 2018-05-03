"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {JKFPlayer} from "json-kifu-format";
import KifuStore from "../stores/KifuStore";
import Piece from "./Piece";

export interface BoardProps {
  kifuStore: KifuStore
}

const nineY = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const nineX = nineY.slice().reverse();

@observer
export default class Board extends React.Component<BoardProps, {}> {

  render() {
    const {player} = this.props.kifuStore;
    const board = player.getState().board;

    const trs = nineY.map(y => {
      const pieces = nineX.map(x =>
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
          <tr>{ nineX.map(x => <th key={x}>{x}</th>) }</tr>
          {trs}
        </tbody>
      </table>
    );
  }
}
