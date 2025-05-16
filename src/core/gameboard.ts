import {
  areCoordsEqual,
  CellState,
  newCell,
  type Cell,
  type CellStateType,
  type Ship,
} from "@/core";
import type { Coordinates, ShipType } from "@/core";
import { GameRules } from "./game-rules";

export interface Gameboard {
  placeShip: (
    ship: Ship,
    coords: Coordinates,
    isVertical: boolean,
    type: ShipType,
  ) => boolean;
  getCellState: (coords: Coordinates) => CellStateType;
  receiveAttack: (coords: Coordinates) => CellStateType;
  getShipByCoords: (coords: Coordinates) => PlacedShip | null;
  areAllShipsSunk: () => boolean;
  getSize: () => number;
  getRemainingShips: () => number;
  removePlacedShip: (coords: Coordinates) => boolean;
  removeAllPlacedShips: () => void;
  getAllPlacedShips: () => Array<PlacedShip>;
}

export interface PlacedShip {
  ship: Ship;
  coords: Array<Coordinates>;
  isVertical: boolean;
  type: ShipType;
}

export const newGameboard = (size: number = GameRules.boardSize): Gameboard => {
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

  const _isValidPlaceForShip = (
    ship: Ship,
    coords: Coordinates,
    isVertical: boolean,
  ): boolean => {
    const { x, y } = coords;
    for (let i = 0; i < ship.getLength(); i++) {
      const newX = isVertical ? x : x + i;
      const newY = isVertical ? y + i : y;
      if (newX < 0 || newX >= _size || newY < 0 || newY >= _size) {
        return false;
      }
      if (_board[newX][newY].getState() !== CellState.empty) {
        return false;
      }
    }
    return true;
  };

  const placeShip = (
    ship: Ship,
    { x, y }: Coordinates,
    isVertical: boolean,
    type: ShipType,
  ): boolean => {
    if (!_isValidPlaceForShip(ship, { x, y }, isVertical)) {
      return false;
    }
    const shipCellsCords: Array<Coordinates> = [];
    for (let i = 0; i < ship.getLength(); i++) {
      const newX = isVertical ? x : x + i;
      const newY = isVertical ? y + i : y;
      const followedCell = _board[newX][newY];
      followedCell.setState(CellState.ship as CellStateType);
      shipCellsCords.push({ x: newX, y: newY });
    }
    _placedShips.push({ ship, coords: shipCellsCords, isVertical, type });
    return true;
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
    return (
      _placedShips.every((ship) => ship.ship.isSunk()) ||
      _placedShips.length === 0
    );
  };

  const getRemainingShips = () => {
    if (areAllShipsSunk()) {
      return 0;
    }
    let remaining = 0;
    _placedShips.forEach((ship) => {
      if (!ship.ship.isSunk()) {
        remaining++;
      }
    });
    return remaining;
  };

  const _removePlacedShipFromArray = (placedShip: PlacedShip) => {
    const index = _placedShips.findIndex((ship) => ship === placedShip);
    if (index === -1) {
      return;
    }
    _placedShips.splice(index, 1);
    return;
  };

  const removePlacedShip = ({ x, y }: Coordinates): boolean => {
    const placedShip = getShipByCoords({ x, y });
    if (!placedShip) return false;
    placedShip.coords.forEach((coord) => {
      _board[coord.x][coord.y].setState(CellState.empty as CellStateType);
    });
    _removePlacedShipFromArray(placedShip);
    return true;
  };

  const removeAllPlacedShips = () => {
    while (_placedShips.length > 0) {
      removePlacedShip(_placedShips[0].coords[0]);
    }
  };

  const getAllPlacedShips = (): Array<PlacedShip> => {
    return _placedShips;
  };

  return {
    getSize,
    placeShip,
    getCellState,
    receiveAttack,
    getShipByCoords,
    areAllShipsSunk,
    getRemainingShips,
    removePlacedShip,
    removeAllPlacedShips,
    getAllPlacedShips,
  };
};
