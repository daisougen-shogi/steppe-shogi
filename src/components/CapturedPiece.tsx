"use strict";
import * as React from "react";
import {DragSource, DropTarget} from "react-dnd";
import {Color} from "shogi.js";
import {Formats} from "json-kifu-format";
import KifuStore from "../stores/KifuStore";
import {getPieceImageUrl} from "../image";

export interface CapturedPieceProps {
  data: Formats.IPiece;
  kifuStore: KifuStore;
  connectDragSource?: (element: any) => any;
  isDragging?: boolean;
}

@DragSource<CapturedPieceProps>(
  "capturedpiece",
  {
    beginDrag(props, monitor, component) {
      return {
        color: props.data.color,
        imgSrc: getPieceImage(props),
        piece: props.data.kind,
        signature: props.kifuStore.signature,
      };
    },
    endDrag(props, monitor, component) {
      const item = monitor.getItem() as { color: Color, piece: string };
      props.kifuStore.onMove({
        color: item.color,
        piece: item.piece,
        to: monitor.getDropResult() as Formats.IPlaceFormat,
      });
    }
  },
  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  }
)
export default class CapturedPiece extends React.Component<CapturedPieceProps, any> {
  render() {
    return this.props.connectDragSource(
      <img
        src={getPieceImage(this.props)}
        style={{
          opacity: this.props.isDragging ? 0.4 : 1,
        }}
      />
    );
  }
}

const getPieceImage = (props: CapturedPieceProps) => {
  return getPieceImageUrl(props.data);
}
