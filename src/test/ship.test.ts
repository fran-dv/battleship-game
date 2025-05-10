import { expect, test } from "vitest";
import { Ship } from "@/core";

test("Hit ship until sunk it", () => {
  const ship = Ship(2);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
