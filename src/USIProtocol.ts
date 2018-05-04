"use strict";

export type USIProtocol = USIOk | Unknown;

export interface USIOk {
  type: "usiok";
}

export interface Unknown {
  type: "unknown";
}
