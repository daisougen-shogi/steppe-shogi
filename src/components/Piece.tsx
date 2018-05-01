"use strict";
import {observer} from "mobx-react";
import * as React from "react";
import {Color} from "shogi.js";
import KifuStore from "../stores/KifuStore";

export interface PieceProps {
  data: {
    color?: Color;
    kind?: string
  };
  x: number;
  y: number;
  kifuStore: KifuStore;
}

@observer
export default class Piece extends React.Component<PieceProps, {}> {

  render() {
    return (
      <td>
        <div>
          <img src={this.getPieceImage(this.props)} />
        </div>
      </td>
    );
  }

  private getPieceImage(props: PieceProps) {
    const piece = props.data;
    if(piece && piece.kind) {
      // TODO: implement
      return "images/dummy.png";
    } else {
      return "images/blank.png";
    }
  }
}
