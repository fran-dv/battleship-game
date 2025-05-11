import {
  areCoordsEqual,
  CellState,
  newCell,
  type Cell,
  type CellStateType,
  type Ship,
} from "@/core";
import type { Coordinates } from "@/core";

export interface Gameboard {
  placeShip: (ship: Ship, coords: Coordinates, isVertical: boolean) => void;
  getCellState: (coords: Coordinates) => CellStateType;
  receiveAttack: (coords: Coordinates) => CellStateType;
  getShipByCoords: (coords: Coordinates) => PlacedShip | null;
  areAllShipsSunk: () => boolean;
  getSize: () => number;
}

export interface PlacedShip {
  ship: Ship;
  coords: Array<Coordinates>;
  isVertical: boolean;
}

export const newGameboard = (size: number = 10): Gameboard => {
  const _size = size;
  const _board: Array<Array<Cell>> = Array.from({ length: _size }, () =>
    Array.from({ length: _size }, () => newCell()),
  );
  const _placedShips: Array<PlacedShip> = [];

  const getShipByCoords = (coords: Coordinates): PlacedShip | null => {
    const placedShip = _placedShips.find((placeShip) =>
      placeShip.coords.some((coord) => areCoordsEqual(coord, coords)),
    );
    if (!placedShip) return null;

    return placedShip;
  };

  const getSize = () => _size;

  const placeShip = (ship: Ship, coords: Coordinates, isVertical: boolean) => {
    const { x, y } = coords;
    const shipCellsCords: Array<Coordinates> = [];
    for (let i = 0; i < ship.getLength(); i++) {
      const newX = isVertical ? x : x + i;
      const newY = isVertical ? y + i : y;
      const followedCell = _board[newX][newY];
      followedCell.setState(CellState.ship as CellStateType);
      shipCellsCords.push({ x: newX, y: newY });
    }
    _placedShips.push({ ship, coords: shipCellsCords, isVertical });
  };

  const receiveAttack = ({ x, y }: Coordinates) => {
    const cell = _board[x][y];
    const placedShip = getShipByCoords({ x, y });
    if (placedShip) {
      placedShip.ship.hit();

      if (placedShip.ship.isSunk()) {
        placedShip.coords.forEach((coord) => {
          _board[coord.x][coord.y].setState(CellState.sunk as CellStateType);
        });
      } else {
        cell.setState(CellState.hit as CellStateType);
      }

      return cell.getState();
    }

    cell.setState(CellState.miss as CellStateType);
    return cell.getState();
  };

  const getCellState = (coords: Coordinates): CellStateType => {
    const { x, y } = coords;
    const cell = _board[x][y];
    return cell.getState();
  };

  const areAllShipsSunk = () => {
    return _placedShips.every((ship) => ship.ship.isSunk());
  };

  return {
    getSize,
    placeShip,
    getCellState,
    receiveAttack,
    getShipByCoords,
    areAllShipsSunk,
  };
};
