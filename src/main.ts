"use strict";
import * as path from "path";
import {app, BrowserWindow, Menu} from "electron";
import * as url from "url";
import {createMenu} from "./menu";
import {Config, loadConfig} from "./config";
import Kifu from "./Kifu";
import Engine from "./Engine";

let mainWindow: BrowserWindow;
let engine: Engine;
const isProd = process.env.NODE_ENV === "production";

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
      webSecurity: false,
      nodeIntegration: false,
      preload: path.join(baseDir, "preload.js")
    }
  });

  if (isProd === false) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(baseDir, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  engine.wakeup(mainWindow.webContents, config.engines);

  const kifu = new Kifu();
  kifu.wakeup(mainWindow.webContents);

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
    if (protocol === undefined) {
      throw new Error("undefined protocol:" + url);
    } else if (urlPattern.test(protocol) === false) {
      event.preventDefault();
      throw new Error("invalid url:" + url);
    }
  });
});

app.once("ready", async () => {
  const baseDir = isProd ? process.resourcesPath : __dirname;
  try {
    const config = await loadConfig(baseDir);
    (global as any).config = config;
    engine = new Engine();
    createWindow(baseDir, config);
    createMenu(mainWindow);
  } catch (e) {
    console.error("Unknown error: ", e);
    if (engine) {
      engine.close();
    }
    app.quit();
  }
});

app.once("window-all-closed", () => {
  if (engine) {
    engine.close();
  }
  app.quit();
});
