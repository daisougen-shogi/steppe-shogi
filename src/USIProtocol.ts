"use strict";

export type USIProtocol = USIOk | ReadyOk | Unknown;

export interface USIOk {
  type: "usiok";
}

export interface ReadyOk {
  type: "readyok";
}

export interface Unknown {
  type: "unknown";
}
