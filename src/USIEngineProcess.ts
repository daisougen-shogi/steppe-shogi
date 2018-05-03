"use strict";
import {spawn, ChildProcess} from "child_process";
import {dirname, basename} from "path";
import {EventEmitter} from "events";
import {EngineConfig} from "./config";

export default class USIEngineProcess {
  event: EventEmitter;
  private process: ChildProcess;

  constructor(config: EngineConfig) {
    this.event = new EventEmitter();
    const cwd = dirname(config.path);
    this.process = spawn(config.path, [], {
      cwd
    });
    this.process.stdout.on("data", raw => {
      this.event.emit("response", raw.toString());
    });
  }

  write(command: string) {
    this.process.stdin.write(`${command}\n`);
  }

  close() {
    this.process.kill();
  }
}
