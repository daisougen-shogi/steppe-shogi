"use strict";

(window as any).eval = global.eval = () => {
  throw new Error("not support eval() for security reasons");
};
