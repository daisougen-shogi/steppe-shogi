"use strict";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {Line} from "react-chartjs-2";
import EnginesStore from "../stores/EnginesStore";

export interface GraphProps {
  enginesStore?: EnginesStore
}

@inject("enginesStore")
@observer
export default class Graph extends React.Component<GraphProps, {}> {

  render() {
    return (
      <div className="graph" >
        <Line
          data={this.props.enginesStore.data}
          options={{
            responsive: true,
            animation: {
              duration: 0
            },
            maintainAspectRatio: false,
            elements: {
              point: {
                radius: 0
              }
            },
            scales: {
              xAxes: [
                {
                  type: "linear",
                  position: "bottom",
                  ticks: {
                    callback: (value: number) => {return ((value % 10) == 0)? value : ""},
                    min: 0,
                    max: 100,
                    gridLines: {
                      display: false
                    }
                  }
                }
              ],
              yAxes: [
                {
                  ticks: {
                    callback: (value: number) => {return ((value % 500) == 0)? value : ""},
                    beginAtZero: true,
                    min: -5000,
                    max: 5000,
                  }
                }
              ]
            }
          }}
        />
      </div>
    );
  }
}
