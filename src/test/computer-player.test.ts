import {
  areCoordsEqual,
  CellState,
  newComputerPlayer,
  newPlayer,
  newShip,
  type AttackInfo,
} from "@/core";
import { expect, expectTypeOf, test } from "vitest";

test("make an attack to the enemy", () => {
  const computerPlayer = newComputerPlayer(newPlayer("Enemy"));
  expectTypeOf(computerPlayer.attackToEnemy()).toEqualTypeOf<
    AttackInfo | Error
  >();
});

test("attack adjacent cells if a ship have been hit", () => {
  const enemy = newPlayer("Enemy");
  enemy.removeAllPlacedShips();
  expect(enemy.getRemainingShips()).toBe(0);
  enemy.placeShip(newShip(2), { x: 0, y: 0 }, false, "patrol-boat");
  const computerPlayer = newComputerPlayer(enemy);

  let attackInfo: AttackInfo = computerPlayer.attackToEnemy() as AttackInfo;
  while (attackInfo.result !== CellState.hit) {
    attackInfo = computerPlayer.attackToEnemy() as AttackInfo;
  }

  // Visualize the ship and its adjacent cells
  // |     [0,1]    |     [1,1]     |
  // | [0,0](ship)  | [1,0](ship)   |    [2, 0]    |

  expect(attackInfo.result).toBe(CellState.hit);

  const adjacentCoords = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 0 },
  ];

  attackInfo = computerPlayer.attackToEnemy() as AttackInfo; // it must be adjacent to the ship
  expect(
    adjacentCoords.some((coord) => areCoordsEqual(coord, attackInfo.coords)),
  ).toBe(true);
});

test("computer player only attacks legal coordinates", () => {
  const enemy = newPlayer("Enemy");
  const computerPlayer = newComputerPlayer(enemy);
  const totalCells =
    enemy.getGameboard().getSize() * enemy.getGameboard().getSize();
  let attackInfo: AttackInfo;
  for (let i = 0; i < totalCells; i++) {
    attackInfo = computerPlayer.attackToEnemy() as AttackInfo;
    expect(attackInfo.coords.x).toBeLessThan(enemy.getGameboard().getSize());
    expect(attackInfo.coords.y).toBeLessThan(enemy.getGameboard().getSize());
  }
});

test("computer player returns an error when all cells have been attacked", () => {
  const enemy = newPlayer("Enemy");
  const computerPlayer = newComputerPlayer(enemy);
  const totalCells =
    enemy.getGameboard().getSize() * enemy.getGameboard().getSize();
  for (let i = 0; i < totalCells; i++) {
    computerPlayer.attackToEnemy();
  } // all cells attacked

  expect(computerPlayer.attackToEnemy()).toBeInstanceOf(Error);
});
