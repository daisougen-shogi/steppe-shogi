import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {Remote, IpcRenderer} from "electron";
import Board from "./components/Board";
import KifuStore from "./stores/KifuStore";

const kifuStore = new KifuStore();

const stores = {
  kifuStore
};

interface Electron {
  remote: Remote;
  ipc: IpcRenderer;
}

const w = (window as Window & Electron);

const chooseKifuFile = () => {
  const filters = [
    {
      name: "JKF, KIF, KI2, CSA",
      extensions: ["jkf", "kif", "ki2", "csa"]
    }
  ];
  const paths = w.remote.dialog.showOpenDialog({
    title: "棋譜ファイルを選択してください",
    filters,
    properties: ["openFile"]
  });
  if (!paths || paths.length === 0) {
    return;
  }
  w.ipc.send("kifu:load", paths[0]);
};

w.ipc.on("shogi:choose-file", () => chooseKifuFile());

w.ipc.on("shogi:apply-kifu", (_: any, kifu: string, path: string) =>
  kifuStore.parse(kifu, path)
);

ReactDOM.render(
  <Provider {...stores}>
    <Board kifuStore={kifuStore} />
  </Provider>,
  document.getElementById("app")
);
