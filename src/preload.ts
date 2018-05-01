"use strict";
import {remote, ipcRenderer as ipc} from "electron";

const w = window as any;
w.exports = module.exports;

w.eval = global.eval = () => {
  throw new Error("not support eval() for security reasons");
};

w.ipc = ipc;
w.remote = remote;
