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

test("place ship", () => {
  const player = newPlayer("Player");
  const coords = { x: 0, y: 0 };
  player.placeShip(newShip(2), coords, true, "patrol-boat");
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
  player.placeShip(newShip(2), coords, false, "patrol-boat");
  expect(player.receiveAttack(coords)).toBe(CellState.hit);
});

test("receive attack and sink a ship", () => {
  const player = newPlayer("Player");
  const coords = { x: 0, y: 0 };
  player.placeShip(newShip(1), coords, false, "patrol-boat");
  expect(player.receiveAttack(coords)).toBe(CellState.sunk);
});

test("id is different each time", () => {
  const player1 = newPlayer("Player");
  const player2 = newPlayer("Player");
  const player3 = newPlayer("Player");
  expect(player1.getId()).not.toBe(player2.getId());
  expect(player1.getId()).not.toBe(player3.getId());
  expect(player2.getId()).not.toBe(player3.getId());
});

test("random ships placement", () => {
  const player = newPlayer("Enemy");
  expect(player.getGameboard().getRemainingShips()).toBe(5);
});
