import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import Board from "./components/Board";

const stores = {
};

ReactDOM.render(
  <Provider {...stores}>
    <Board />
  </Provider>,
  document.getElementById("app")
);
