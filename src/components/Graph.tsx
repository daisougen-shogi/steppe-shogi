"use strict";
import {observer} from "mobx-react";
import * as React from "react";
import {Line} from "react-chartjs-2";

export interface GraphProps {
}

const data = {
  datasets: [
    {
      label: "将棋エンジン",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75, 192, 192, 1)",
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [
        {
          x: 0,
          y: 0
        },
        {
          x: 1,
          y: 65
        }
      ]
    }
  ]
};

const style = {
  width: 400,
  height: 600
}

@observer
export default class Graph extends React.Component<GraphProps, {}> {

  render() {
    return (
      <div style={style} >
        <Line
          data={data}
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
