import { CellState, newShip } from "@/core";
import { newGameboard } from "@/core";
import { expect, test } from "vitest";

test("get cell state passing coordinates", () => {
  const gameboard = newGameboard();
  const cellState = gameboard.getCellState({ x: 0, y: 0 });
  expect(cellState).toBe(CellState.empty);
});

test("get state of a cells that are part of a ship", () => {
  const gameboard = newGameboard();
  const ship = newShip(2);
  gameboard.placeShip(ship, { x: 0, y: 0 }, false, "patrol-boat");
  const cell1State = gameboard.getCellState({ x: 0, y: 0 });
  const cell2State = gameboard.getCellState({ x: 1, y: 0 });
  expect(cell1State).toBe(CellState.ship);
  expect(cell2State).toBe(CellState.ship);
});

test("make an attack to an empty cell of the gameboard", () => {
  const gameboard = newGameboard();
  gameboard.receiveAttack({ x: 0, y: 0 });
  const cellState = gameboard.getCellState({ x: 0, y: 0 });
  expect(cellState).toBe(CellState.miss);
});

test("make an attack to a ship cell of the gameboard", () => {
  const gameboard = newGameboard();
  const ship = newShip(2);
  gameboard.placeShip(ship, { x: 0, y: 0 }, false, "patrol-boat");
  gameboard.receiveAttack({ x: 0, y: 0 });
  const cellState = gameboard.getCellState({ x: 0, y: 0 });
  expect(cellState).toBe(CellState.hit);
});

test("make an attack to all cells of a ship to sink it", () => {
  const gameboard = newGameboard();
  const ship = newShip(2);
  gameboard.placeShip(ship, { x: 0, y: 0 }, false, "patrol-boat");
  gameboard.receiveAttack({ x: 0, y: 0 });
  gameboard.receiveAttack({ x: 1, y: 0 });
  const cell1State = gameboard.getCellState({ x: 0, y: 0 });
  const cell2State = gameboard.getCellState({ x: 1, y: 0 });
  expect(cell1State).toBe(CellState.sunk);
  expect(cell2State).toBe(CellState.sunk);
});

test("check if all ships are sunk", () => {
  const gameboard = newGameboard();
  const ship = newShip(2);
  gameboard.placeShip(ship, { x: 0, y: 0 }, false, "patrol-boat");
  expect(gameboard.areAllShipsSunk()).toBe(false);
  gameboard.receiveAttack({ x: 0, y: 0 });
  gameboard.receiveAttack({ x: 1, y: 0 });
  expect(gameboard.areAllShipsSunk()).toBe(true);
});

test("get remaining ships", () => {
  const gameboard = newGameboard();
  const ship = newShip(2);
  gameboard.placeShip(ship, { x: 0, y: 0 }, false, "patrol-boat");
  expect(gameboard.getRemainingShips()).toBe(1);
  gameboard.receiveAttack({ x: 0, y: 0 });
  gameboard.receiveAttack({ x: 1, y: 0 });
  expect(gameboard.getRemainingShips()).toBe(0);
});
