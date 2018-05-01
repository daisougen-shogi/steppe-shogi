"use strict";
import * as path from "path";
import {app, BrowserWindow, Menu} from "electron";
import * as url from "url";
import {createMenu} from "./menu";
import {Config, loadConfig} from "./config";

let mainWindow: BrowserWindow;
let menu: Menu;

const urlPattern = new RegExp("^https?:$");

function createWindow(baseDir: string, config: Config) {
  mainWindow = new BrowserWindow({
    width: config.width,
    height: config.height,
    // 64x64
    icon: path.join(baseDir, "icon.png"),
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(baseDir, "preload.js")
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(baseDir, "index.html"),
    protocol: "file:",
    slashes: true
  }));

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.once("devtools-opened", () => setImmediate(() => mainWindow.focus()));
    mainWindow.webContents.openDevTools({mode: "detach"});
  }

  mainWindow.once("closed", () => {
    mainWindow = null;
  });
}

app.on("browser-window-created", (event, window) => {
  window.webContents.on("new-window", (event, targetUrl, frameName, disposition, options) => {
    const protocol = url.parse(targetUrl).protocol;
    if(protocol === undefined) {
      throw new Error("undefined protocol:" + url);
    } else if (urlPattern.test(protocol) === false) {
      event.preventDefault();
      throw new Error("invalid url:" + url);
    }
  });
});

app.once("ready", async () => {
  const baseDir = __dirname;
  const config = await loadConfig(baseDir);
  try {
    createWindow(baseDir, config);
    menu = createMenu();
  } catch(e) {
      console.error("Unknown error: ", e);
      app.quit();
  }
});

app.once("window-all-closed", () => {
  app.quit();
});
