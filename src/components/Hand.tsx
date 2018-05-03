"use strict";
import {observer} from "mobx-react";
import * as React from "react";
import {Color} from "shogi.js";
import CapturedPieces from "./CapturedPieces";
import KifuStore from "../stores/KifuStore";

export interface HandProps {
  kifuStore: KifuStore;
  defaultColor: Color;
}

@observer
export default class Hand extends React.Component<HandProps, any> {

  render() {
    const {player} = this.props.kifuStore;
    const kinds = ["FU", "KY", "KE", "GI", "KI", "KA", "HI"];
    const color = this.props.defaultColor;
    const state = player.getState();
    const hand = state.hands[color];
    const playerName = [
      player.kifu.header.先手 || player.kifu.header.下手 || "",
      player.kifu.header.後手 || player.kifu.header.上手 || "",
    ][color];

    return (
      <div className="hand" >
        <div className="name" >{toMark(color) + playerName}</div>
        <div className="box" >{
          (color === 0 ? kinds.reverse() : kinds).filter(kind => hand[kind] > 0)
          .map(kind => (
            <CapturedPieces key={kind} value={hand[kind]} data={{ kind, color }} kifuStore={this.props.kifuStore} />
          ))
        }</div>
      </div>
    );
  }
}

export function toMark(color: Color) {
  return color === Color.Black ? "☗" : "☖";;
}
