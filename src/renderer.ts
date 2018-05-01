""use strict";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";

const stores = {
};

ReactDOM.render(
  <Provider {...stores}>
  </Provider>,
  document.getElementById("app")
);
