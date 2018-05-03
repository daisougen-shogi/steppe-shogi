"use strict";
import {observer} from "mobx-react";
import * as React from "react";
import {JKFPlayer} from "json-kifu-format";

export interface ListProps {
  player: JKFPlayer;
}

@observer
export default class List extends React.Component<ListProps, {}> {
  constructor(props: ListProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const options = this.props.player.getReadableKifuState()
      .map((kifu, i) => {
        const textContent =
          (i + "").padEnd(5, "\xa0") + kifu.kifu;
        return (
          <option key={i} value={i}>
            {textContent}
          </option>
        );
      });
    return (
      <select className="list" size={7} onChange={this.onChange} value={this.props.player.tesuu}>
        {options}
      </select>
    );
  }

  onChange(e: any) {
    this.props.player.goto(e.target.value);
  }
}