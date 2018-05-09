import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {Remote, IpcRenderer} from "electron";
import Shogi from "./components/Shogi";
import KifuStore from "./stores/KifuStore";
import EnginesStore from "./stores/EnginesStore";
import {Config} from "./config";
import {USIProtocol} from "./USIProtocol";

interface Electron {
  remote: Remote;
  ipc: IpcRenderer;
}
const w = (window as Window & Electron);

const config = w.remote.getGlobal("config") as Config;

const kifuStore = new KifuStore(w.ipc);
const enginesStore = new EnginesStore(w.ipc, config.engines);

const stores = {
  kifuStore,
  enginesStore
};

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

w.ipc.on("shogi:init", () => {
  kifuStore.clear();
});

w.ipc.on("engine:response", (_: any, id: string, response: USIProtocol) => {
  enginesStore.apply(id, response, kifuStore.player.tesuu);
});

enginesStore.usi();

ReactDOM.render(
  <Provider {...stores}>
    <Shogi />
  </Provider>,
  document.getElementById("app")
);
