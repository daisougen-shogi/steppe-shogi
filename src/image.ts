"use strict";
import {Formats} from "json-kifu-format";

export const getPieceImageUrl = (piece: Formats.IPiece) => {
  if (piece && piece.kind) {
    // TODO: implement
    return "images/dummy.png";
  } else {
    return "images/blank.png";
  }
};
