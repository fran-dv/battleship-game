import { CellState, type Gameboard, newPlayer, newShip } from "@/core";
import { expect, expectTypeOf, test } from "vitest";

test("get user name", () => {
  const player = newPlayer("Player");
  expect(player.getName()).toBe("Player");
});

test("get gameboard", () => {
  const player = newPlayer("Player");
  expectTypeOf(player.getGameboard()).toEqualTypeOf<Gameboard>();
});

test("is turn", () => {
  const player = newPlayer("Player");
  expect(player.isTurn()).toBe(false);
});

test("set turn", () => {
  const player = newPlayer("Player");
  player.setTurn(true);
  expect(player.isTurn()).toBe(true);
});

test("place ship", () => {
  const player = newPlayer("Player");
  const coords = { x: 0, y: 0 };
  player.placeShip(newShip(2), coords, true);
  expect(player.getGameboard().getCellState({ x: 0, y: 0 })).toBe(
    CellState.ship,
  );
  expect(player.getGameboard().getCellState({ x: 0, y: 1 })).toBe(
    CellState.ship,
  );
});

test("receive attack and hit a ship", () => {
  const player = newPlayer("Player");
  const coords = { x: 0, y: 0 };
  player.placeShip(newShip(2), coords, false);
  expect(player.receiveAttack(coords)).toBe(CellState.hit);
});

test("receive attack and sink a ship", () => {
  const player = newPlayer("Player");
  const coords = { x: 0, y: 0 };
  player.placeShip(newShip(1), coords, false);
  expect(player.receiveAttack(coords)).toBe(CellState.sunk);
});

test("receive attack and miss", () => {
  const player = newPlayer("Player");
  const coords = { x: 0, y: 0 };
  expect(player.receiveAttack(coords)).toBe(CellState.miss);
});
