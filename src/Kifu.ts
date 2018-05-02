"use strict";
import {ipcMain as ipc} from "electron";
import {extname} from "path";
import * as fs from "fs";

export default class Kifu {
  private sender: Electron.WebContents;
  private path: string;

  constructor() {
    this.path = "";
  }

  wakeup(sender: Electron.WebContents) {
    this.sender = sender;

    ipc.on("kifu:load", (_: any, path: string) => {
      this.load(path);
    });

    ipc.on("kifu:save", (_: any, path: string, kifu: string) => {
      this.save(path, kifu);
    });
  }

  private load(path: string) {
    // TODO: エラーを掴んでrendererに表示する
    const kifu = fs.readFileSync(path, "utf8");
    this.path = path;
    this.sender.send("shogi:apply-kifu", kifu, path);
  }

  private save(path: string, kifu: string) {
    // TODO: エラーを掴んでrendererに表示する
    fs.writeFileSync(path, kifu, "utf8");
    this.path = path;
  }
}
