"use strict";
import {promisify} from "util";
import * as path from "path";
import * as fs from "fs";

export interface EngineConfig {
  id: string;
  name: string;
  path: string;
  color: string;
}

export interface Config {
  width: number;
  height: number;
  engines: EngineConfig[];
}

export const loadConfig = async (targetDir: string) => {
  const file = path.join(targetDir, "config.json");
  const text = await promisify(fs.readFile)(file, {encoding: "utf8"});
  return JSON.parse(text) as Config;
};
