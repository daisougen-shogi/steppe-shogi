"use strict";
import {observer} from "mobx-react";
import * as React from "react";
import {DragSource, DropTarget} from "react-dnd";
import {Color} from "shogi.js";
import {Formats} from "json-kifu-format";
import KifuStore from "../stores/KifuStore";
import {getPieceImageUrl} from "../image";

export interface PieceProps {
  data: Formats.IPiece;
  x: number;
  y: number;
  kifuStore: KifuStore;
  connectDropTarget?: (obj: any) => Element;
  connectDragSource?: (obj: any) => Element;
  isDragging?: boolean;
}

@observer
@DragSource(
  "piece",
  {
    beginDrag(props: PieceProps, monitor, component) {
      return {
        x: props.x,
        y: props.y,
        imgSrc: getPieceImage(props),
        signature: props.kifuStore.signature
      };
    },
    endDrag(props: PieceProps, monitor, component) {
      props.kifuStore.onMove({
        color: props.data.color,
        piece: props.data.kind,
        from: monitor.getItem() as Formats.IPlaceFormat,
        to: monitor.getDropResult() as Formats.IPlaceFormat
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
@DropTarget(
  ["piece", "capturedpiece"],
  {
    drop(props: PieceProps, monitor, component) {
      return { x: props.x, y: props.y };
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget()
  })
)
export default class Piece extends React.Component<PieceProps, any> {

  render(): React.ReactNode {
    return (
      <td>
        { this.props.connectDropTarget(
            this.props.connectDragSource(
              <div>
                <img src={getPieceImage(this.props)} style={{ opacity: this.props.isDragging ? 0.4 : 1 }} />
              </div>
            )
          )
        }
      </td>
    );
  }
}

const getPieceImage = (props: PieceProps) => {
  return getPieceImageUrl(props.data);
}
