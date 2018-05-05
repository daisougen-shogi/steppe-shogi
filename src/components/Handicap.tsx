"use strict";

import {observer} from "mobx-react";
import * as React from "react";
import KifuStore from "../stores/KifuStore";
import {HIRATE} from "../constants";

export interface HandicapProps {
  kifuStore: KifuStore;
}

const presets: [string, string][] = [
    [HIRATE, "平手"],
    ["KY", "香落ち"],
    ["KY_R", "右香落ち"],
    ["KA", "角落ち"],
    ["HI", "飛車落ち"],
    ["HIKY", "飛車香落ち"],
    ["2", "二枚落ち"],
    ["3", "三枚落ち"],
    ["4", "四枚落ち"],
    ["5", "五枚落ち"],
    ["5_L", "左五枚落ち"],
    ["6", "六枚落ち"],
    ["8", "八枚落ち"],
    ["10", "十枚落ち"]
];

@observer
export default class Handicap extends React.Component<HandicapProps, {}> {
  constructor(props: HandicapProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const options = presets.map(([value, text], i) => <option key={i} value={value}>{text}</option>);
    return (
      <select className="handicap" size={1} onChange={this.onChange} value={this.props.kifuStore.preset} >
        {options}
      </select>
    );
  }

  onChange(e: any) {
    const preset = e.target.value;
    this.props.kifuStore.handicap(preset);
  }
}
