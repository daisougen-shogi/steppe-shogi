"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {DragDropContext, DropTarget} from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch";
import {NativeTypes} from "react-dnd-html5-backend";
import KifuStore from "../stores/KifuStore";
import Hand from "./Hand";
import Board from "./Board";
import List from "./List";
import Engines from "./Engines";
import Handicap from "./Handicap";

import "../steppe.css";

export interface KifuProps {
  kifuStore?: KifuStore;
  connectDropTarget?: (obj: any) => any;
}

@inject("kifuStore")
@observer
@DropTarget<KifuProps>(
  NativeTypes.FILE,
  {
    drop(props, monitor, component: Kifu) {
      const item = monitor.getItem() as HTMLInputElement;
      if (item.files[0]) {
        props.kifuStore.load(item.files[0].path);
      }
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })
)
class Kifu extends React.Component<KifuProps, {}> {

  render(): React.ReactNode {
    return this.props.connectDropTarget(
      <div className="steppe" >
        <div className="board-set" >
          <div className="inlineblock players left">
            <Hand kifuStore={this.props.kifuStore} defaultColor={1} />
            <List player={this.props.kifuStore.player} />
            <Handicap kifuStore={this.props.kifuStore} />
          </div>
          <Board kifuStore={this.props.kifuStore} />
          <div className="inlineblock players right">
            <Hand kifuStore={this.props.kifuStore} defaultColor={0} />
          </div>
        </div>
        <Engines />
      </div>
    );
  }
}

const DragDropKifu = DragDropContext<KifuProps>(MultiBackend(HTML5toTouch))(Kifu);
export default DragDropKifu;
