"use strict";
import {Menu, MenuItemConstructorOptions} from "electron";

const templates: MenuItemConstructorOptions[] = [
  {
    label: "ファイル",
    submenu: [
      {
        role: "quit"
      }
    ]
  }
];

export const createMenu = () => {
  const menu = Menu.buildFromTemplate(templates);
  Menu.setApplicationMenu(menu);
  return menu;
}
