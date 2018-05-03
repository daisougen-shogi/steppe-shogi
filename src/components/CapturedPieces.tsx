"use strict";
import * as React from "react";
import {Formats} from "json-kifu-format";
import CapturedPiece from "./CapturedPiece";
import KifuStore from "../stores/KifuStore";

export interface CapturedPiecesProps {
  data: Formats.IPiece;
  value: number;
  kifuStore: KifuStore;
}

export default class CapturedPieces extends React.Component<CapturedPiecesProps, any> {
  render() {
    return (
      <span className="capturedpiece" >
        <CapturedPiece
          data={this.props.data}
          kifuStore={this.props.kifuStore}
        />
        <span className="value" >{this.props.value}</span>
      </span>
    );
  }
}
