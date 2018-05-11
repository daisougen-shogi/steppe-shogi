import Engine from "../../stores/Engine";
import {Info} from "../../USIProtocol";

describe("stores/Engine", () => {
  test("multipvが小さい場合は状態を書き換えない", () => {
    const expected: Info = {
      type: "info",
      multipv: 1
    };
    const engine = new Engine({
      id: "0",
      name: "test",
      path: "",
      color: "white"
    });
    engine.state = expected;
    engine.state = {
      type: "info",
      multipv: 2
    };
    expect(engine.state).toEqual(expected);
  });
});
