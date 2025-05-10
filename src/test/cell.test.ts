import { CellState, type CellStateType, newCell } from "@/core";
import { expect, test } from "vitest";

test("initial state of a cell is empty", () => {
  const cell = newCell();
  expect(cell.getState()).toBe(CellState.empty);
});

test("set state of a cell to ship", () => {
  const cell = newCell();
  cell.setState(CellState.ship as CellStateType);
  expect(cell.getState()).toBe(CellState.ship);
});

test("set state of a cell to hit", () => {
  const cell = newCell();
  cell.setState(CellState.hit as CellStateType);
  expect(cell.getState()).toBe(CellState.hit);
});

test("set state of a cell to miss", () => {
  const cell = newCell();
  cell.setState(CellState.miss as CellStateType);
  expect(cell.getState()).toBe(CellState.miss);
});

test("set state of a cell to sunk", () => {
  const cell = newCell();
  cell.setState(CellState.sunk as CellStateType);
  expect(cell.getState()).toBe(CellState.sunk);
});
