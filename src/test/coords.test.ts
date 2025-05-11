import { areCoordsEqual } from "@/core";
import { expect, test } from "vitest";

test("are coordinates equal function", () => {
  expect(areCoordsEqual({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(true);
  expect(areCoordsEqual({ x: 8, y: 7 }, { x: 8, y: 7 })).toBe(true);
  expect(areCoordsEqual({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(false);
  expect(areCoordsEqual({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(false);
  expect(areCoordsEqual({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(false);
});
