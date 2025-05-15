import type { CellStateType, Coordinates, Gameboard, Ship } from "@/core";
import { GameRules, getRandomCoords, newGameboard, newShip } from "@/core";
import { getUniqueId } from "@/utilities";

export interface Player {
  getId: () => number;
  getName: () => string;
  getGameboard: () => Gameboard;
  receiveAttack: (coords: Coordinates) => CellStateType;
  placeShip: (ship: Ship, coords: Coordinates, isVertical: boolean) => boolean;
  areAllShipsSunk: () => boolean;
  getRemainingShips: () => number;
  removePlacedShip: (coords: Coordinates) => void;
  removeAllPlacedShips: () => void;
}

export const newPlayer = (name: string): Player => {
  const _name = name;
  const _gameboard = newGameboard();
  const _id = getUniqueId();

  const getId = () => _id;
  const getName = () => _name;
  const getGameboard = () => _gameboard;
  const receiveAttack = (coords: Coordinates) => {
    return _gameboard.receiveAttack(coords);
  };

  const placeShip = (
    ship: Ship,
    coords: Coordinates,
    isVertical: boolean,
  ): boolean => {
    return _gameboard.placeShip(ship, coords, isVertical);
  };

  const areAllShipsSunk = (): boolean => {
    return _gameboard.areAllShipsSunk();
  };

  const getRemainingShips = (): number => {
    return _gameboard.getRemainingShips();
  };

  // place computer player's ships
  GameRules.ships.forEach((ship) => {
    let vertical = true;
    let success: boolean = false;
    while (!success) {
      const randomCoords = getRandomCoords(1, _gameboard.getSize());
      success = placeShip(newShip(ship.size), randomCoords[0], vertical);
    }
    vertical = !vertical;
  });

  const removePlacedShip = (coords: Coordinates) => {
    _gameboard.removePlacedShip(coords);
  };

  const removeAllPlacedShips = () => {
    _gameboard.removeAllPlacedShips();
  };

  return {
    getId,
    getName,
    getGameboard,
    receiveAttack,
    placeShip,
    areAllShipsSunk,
    getRemainingShips,
    removePlacedShip,
    removeAllPlacedShips,
  };
};
