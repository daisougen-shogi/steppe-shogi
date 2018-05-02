"use strict";
import {app, Menu, MenuItemConstructorOptions} from "electron";

export const createMenu = (mainWindow: Electron.BrowserWindow) => {
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
