"use strict";

export type USIProtocol = USIOk | ReadyOk | Info | Unknown;

export interface USIOk {
  type: "usiok";
}

export interface ReadyOk {
  type: "readyok";
}

export interface Info {
  type: "info";
  values: string[];
}

export interface Unknown {
  type: "unknown";
}
