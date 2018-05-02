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

const chooseSaveFile = () => {
  const filters = [
    {
      name: "JKF",
      extensions: ["jkf"]
    }
  ];
  const path = w.remote.dialog.showSaveDialog({
    title: "保存するファイルを選択してください",
    filters
  });
  if (!path) {
    return;
  }
  w.ipc.send("kifu:save", path, kifuStore.player.toJKF());
};

w.ipc.on("shogi:choose-kifu", () => chooseKifuFile());

w.ipc.on("shogi:apply-kifu", (_: any, kifu: string, path: string) =>
  kifuStore.parse(kifu, path)
);

w.ipc.on("shogi:save-kifu", () => chooseSaveFile());

ReactDOM.render(
  <Provider {...stores}>
    <Board kifuStore={kifuStore} />
  </Provider>,
  document.getElementById("app")
);
