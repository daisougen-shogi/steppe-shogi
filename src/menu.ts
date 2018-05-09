"use strict";
import {app, Menu, MenuItemConstructorOptions} from "electron";
import EngineProcessor from "./EngineProcessor";

export const createMenu = (mainWindow: Electron.BrowserWindow, engine: EngineProcessor) => {
  const fileSubmenu: MenuItemConstructorOptions[] = [
    {
      label: "棋譜ファイルを開く",
      click: () => mainWindow.webContents.send("shogi:choose-kifu")
    },
    {
      label: "棋譜を保存する",
      click: () => mainWindow.webContents.send("shogi:save-kifu")
    }
  ];

  const templates: MenuItemConstructorOptions[] = [
    {
      label: "ファイル",
      submenu: fileSubmenu
    },
    {
      label: "対局",
      submenu: [
        {
          label: "新規対局",
          click: () => mainWindow.webContents.send("shogi:init")
        },
        {
          label: "対局開始",
          click: async () => engine.newGame()
        }
      ]
    }
  ];

  if (process.platform === "darwin") {
    templates.unshift({
      label: app.getName(),
      submenu: [
        {
          role: "about"
        },
        {
          type: "separator"
        },
        {
          role: "quit"
        }
      ]
    });
  } else {
    fileSubmenu.push({
      role: "quit"
    });
  }

  const menu = Menu.buildFromTemplate(templates);
  Menu.setApplicationMenu(menu);
  return menu;
};
