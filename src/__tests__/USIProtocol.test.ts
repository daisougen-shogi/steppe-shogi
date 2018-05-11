import {parseInfo} from "../USIProtocol";

describe("USIProtocol", () => {
  test("depth", () => {
    expect(parseInfo(["info", "depth", "1"])).toEqual({
      type: "info",
      depth: 1
    });
  });

  test("time", () => {
    expect(parseInfo(["info", "time", "1"])).toEqual({
      type: "info",
      time: 1
    });
  });

  test("nodes", () => {
    expect(parseInfo(["info", "nodes", "1"])).toEqual({
      type: "info",
      nodes: 1
    });
  });

  test("pv", () => {
    expect(parseInfo(["info", "pv", "P*5h", "4g5g", "5h5g", "8b8f"])).toEqual({
      type: "info",
      pv: ["P*5h", "4g5g", "5h5g", "8b8f"]
    });
  });

  test("score cp", () => {
    expect(parseInfo(["info", "score", "cp", "1"])).toEqual({
      type: "info",
      centipawn: 1
    });
  });

  test("score cp lowerbound", () => {
    expect(parseInfo(["info", "score", "cp", "1", "lowerbound"])).toEqual({
      type: "info",
      centipawn: 1
    });
  });

  test("score cp upperbound", () => {
    expect(parseInfo(["info", "score", "cp", "1", "upperbound"])).toEqual({
      type: "info",
      centipawn: 1
    });
  });

  test("score mate number", () => {
    expect(parseInfo(["info", "score", "mate", "1"])).toEqual({
      type: "info",
      mate: 1
    });
  });

  test("score mate +", () => {
    expect(parseInfo(["info", "score", "mate", "+"])).toEqual({
      type: "info",
      mate: "+"
    });
  });

  test("score mate -", () => {
    expect(parseInfo(["info", "score", "mate", "-"])).toEqual({
      type: "info",
      mate: "-"
    });
  });

  test("currmove", () => {
    expect(parseInfo(["info", "currmove", "4c4d"])).toEqual({
      type: "info",
      currmove: "4c4d"
    });
  });

  test("hashfull", () => {
    expect(parseInfo(["info", "hashfull", "1"])).toEqual({
      type: "info",
      hashfull: 1
    });
  });

  test("nps", () => {
    expect(parseInfo(["info", "nps", "1"])).toEqual({
      type: "info",
      nps: 1
    });
  });

  test("string", () => {
    expect(parseInfo(["info", "string", "hoge", "fuga"])).toEqual({
      type: "info",
      string: "hoge fuga"
    });
  });

  test("独自プロパティは無視", () => {
    expect(parseInfo(["info", "hoge"])).toEqual({
      type: "info"
    });
  });
});
