"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {LineChart, XAxis, YAxis} from "recharts";
// LineProps.dataがd.tsに定義されていないので苦肉の策
var Line = require("recharts").Line;
import EnginesStore from "../stores/EnginesStore";
import Engine from "../stores/Engine";

export interface GraphProps {
  engines: Engine[]
}

@inject("enginesStore")
@observer
export default class Graph extends React.Component<GraphProps, {}> {

  render() {
    return (
      <div className="graph" >
        <LineChart width={400} height={600} >
          <XAxis
            dataKey="turn"
            type="number"
            ticks={[0, 20, 40, 60, 80, 100]}
          />
          <YAxis
            dataKey="value"
            ticks={[-5000, -4000, -3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000]}
          />
          { this.props.engines.map((engine: Engine) => (
            <Line
              key={engine.id}
              name={engine.name}
              type="linear"
              dataKey="value"
              data={engine.scores.slice()}
              stroke={engine.color}
              strokeWidth="2"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </div>
    );
  }
}
