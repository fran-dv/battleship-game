import type { CellStateType, Coordinates, Gameboard, Ship } from "@/core";
import { newGameboard } from "@/core";

export interface Player {
  getName: () => string;
  getGameboard: () => Gameboard;
  isTurn: () => boolean;
  setTurn: (isTurn: boolean) => void;
  receiveAttack: (coords: Coordinates) => CellStateType;
  placeShip: (ship: Ship, coords: Coordinates, isVertical: boolean) => void;
}

export const newPlayer = (name: string): Player => {
  let _isTurn = false;
  const _name = name;
  const _gameboard = newGameboard();

  const getName = () => _name;
  const getGameboard = () => _gameboard;
  const isTurn = () => _isTurn;

  const setTurn = (isTurn: boolean) => {
    _isTurn = isTurn;
  };

  const receiveAttack = (coords: Coordinates) => {
    return _gameboard.receiveAttack(coords);
  };

  const placeShip = (ship: Ship, coords: Coordinates, isVertical: boolean) => {
    _gameboard.placeShip(ship, coords, isVertical);
  };

  return {
    getName,
    getGameboard,
    isTurn,
    setTurn,
    receiveAttack,
    placeShip,
  };
};
