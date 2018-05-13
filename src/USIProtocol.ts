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
  depth?: number;
  seldepth?: number;
  time?: number; // ms
  nodes?: number;
  pv?: string[];
  multipv?: number;
  centipawn?: number;
  // 将棋所は数値ではなく '+' や '-' のみの場合があるらしい
  mate?: number | "+" | "-";
  currmove?: string;
  hashfull?: number;
  nps?: number;
  string?: string;
}

const readToken = (tokens: string[]) => {
  return tokens.shift();
};

const parseScore = (info: Info, tokens: string[]) => {
  if (readToken(tokens) === "cp") {
    info.centipawn = parseInt(readToken(tokens), 10);

    // TODO: lowerbound|upperboundの扱いを決める
    const next = tokens[0];
    if (next === "lowerbound" || next === "upperbound") {
      readToken(tokens);
    }
  } else {
    const value = readToken(tokens);
    if (value === "+" || value === "-") {
      info.mate = value;
    } else {
      info.mate = parseInt(value, 10);
    }
  }
};

export const parseInfo = (values: string[]) => {
  const info: Info = {
    type: "info"
  };
  // values[0]は"info"なので除外
  let tokens = values.slice(1);
  while (tokens.length > 0) {
    let token = tokens.shift();
    switch (token) {
      case "depth":
        info[token] = parseInt(readToken(tokens), 10);
        if (tokens[0] === "seldepth") {
          readToken(tokens);
          info.seldepth = parseInt(readToken(tokens), 10);
        }
        break;
      case "time":
      case "nodes":
      case "multipv":
      case "hashfull":
      case "nps":
        info[token] = parseInt(readToken(tokens), 10);
        break;
      case "currmove":
        info[token] = readToken(tokens);
        break;
      case "score":
        parseScore(info, tokens);
        break;
      case "pv":
        info.pv = tokens;
        tokens = [];
        break;
      case "string":
        info.string = tokens.join(" ");
        tokens = [];
        break;
      default:
        break;
    }
  }

  return info;
};

export interface Unknown {
  type: "unknown";
}
