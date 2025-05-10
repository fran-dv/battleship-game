import { expect, test } from "vitest";
import { newShip } from "@/core";

test("Hit ship until sunk it", () => {
  const ship = newShip(2);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
