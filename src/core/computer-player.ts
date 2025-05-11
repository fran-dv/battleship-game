import {
  areCoordsEqual,
  CellState,
  newPlayer,
  type CellStateType,
  type Coordinates,
  type Player,
} from "@/core";

interface ComputerPlayer extends Player {
  attackToEnemy: () => AttackInfo | Error;
}

export interface AttackInfo {
  coords: Coordinates;
  result: CellStateType;
}

export const newComputerPlayer = (
  enemy: Player,
  name: string = "Captain Ironskulls",
): ComputerPlayer => {
  const _name = name;
  const _player = newPlayer(_name);
  const _enemy = enemy;
  const _gameboard = _player.getGameboard();

  let _previousAttacks: Array<AttackInfo> = [];

  const _noMoreAttacks = (): boolean =>
    _previousAttacks.length === _gameboard.getSize() * _gameboard.getSize();

  const _invalidCoords = (coords: Coordinates): boolean => {
    return (
      coords.x < 0 ||
      coords.x >= _gameboard.getSize() ||
      coords.y < 0 ||
      coords.y >= _gameboard.getSize() ||
      _previousAttacks.some((attack) => areCoordsEqual(attack.coords, coords))
    );
  };

  const _generateValidRandomCoords = (): Coordinates => {
    if (_noMoreAttacks()) {
      // prevent infinite loop
      throw new Error("All cells have been attacked");
    }

    let coords: Coordinates = {
      x: Math.floor(Math.random() * _gameboard.getSize()),
      y: Math.floor(Math.random() * _gameboard.getSize()),
    };

    while (_invalidCoords(coords)) {
      coords = {
        x: Math.floor(Math.random() * _gameboard.getSize()),
        y: Math.floor(Math.random() * _gameboard.getSize()),
      };
    }
    return coords;
  };

  const _getAdjacentCoords = (coords: Coordinates): Array<Coordinates> => {
    const { x, y } = coords;
    const adjacentCoords: Array<Coordinates> = [];
    if (x > 0) adjacentCoords.push({ x: x - 1, y });
    if (x < _gameboard.getSize() - 1) adjacentCoords.push({ x: x + 1, y });
    if (y > 0) adjacentCoords.push({ x, y: y - 1 });
    if (y < _gameboard.getSize() - 1) adjacentCoords.push({ x, y: y + 1 });
    return adjacentCoords;
  };

  const _generateValidAdjacentCoordsOrRandom = (
    coords: Coordinates,
  ): Coordinates => {
    const adjacentCoords = _getAdjacentCoords(coords);

    for (let i = 0; i < adjacentCoords.length; i++) {
      if (!_invalidCoords(adjacentCoords[i])) {
        return adjacentCoords[i];
      }
    }

    return _generateValidRandomCoords();
  };

  const _allAdjacentCellsAttacked = (coords: Coordinates): boolean => {
    const adjacentCoords = _getAdjacentCoords(coords);
    return adjacentCoords.every((adjacent) => {
      return _invalidCoords(adjacent);
    });
  };

  const _getCoordsToAttack = (): Coordinates => {
    if (_previousAttacks.length === 0) {
      return _generateValidRandomCoords();
    }

    const previousIndex = _previousAttacks.length - 1;

    // check the last 4 attacks
    if (_previousAttacks[previousIndex].result !== CellState.sunk) {
      if (_previousAttacks[previousIndex].result === CellState.hit) {
        if (
          !_allAdjacentCellsAttacked(_previousAttacks[previousIndex].coords)
        ) {
          return _generateValidAdjacentCoordsOrRandom(
            _previousAttacks[previousIndex].coords,
          );
        }
      } else if (
        previousIndex > 0 &&
        _previousAttacks[previousIndex - 1].result !== CellState.sunk &&
        _previousAttacks[previousIndex - 1].result === CellState.hit
      ) {
        if (
          !_allAdjacentCellsAttacked(_previousAttacks[previousIndex - 1].coords)
        ) {
          return _generateValidAdjacentCoordsOrRandom(
            _previousAttacks[previousIndex - 1].coords,
          );
        }
      } else if (
        previousIndex > 1 &&
        _previousAttacks[previousIndex - 2].result !== CellState.sunk &&
        _previousAttacks[previousIndex - 2].result === CellState.hit
      ) {
        if (
          !_allAdjacentCellsAttacked(_previousAttacks[previousIndex - 2].coords)
        ) {
          return _generateValidAdjacentCoordsOrRandom(
            _previousAttacks[previousIndex - 2].coords,
          );
        }
      } else if (
        previousIndex > 2 &&
        _previousAttacks[previousIndex - 3].result !== CellState.sunk &&
        _previousAttacks[previousIndex - 3].result === CellState.hit
      ) {
        if (
          !_allAdjacentCellsAttacked(_previousAttacks[previousIndex - 3].coords)
        ) {
          return _generateValidAdjacentCoordsOrRandom(
            _previousAttacks[previousIndex - 3].coords,
          );
        }
      }
    }
    return _generateValidRandomCoords();
  };

  const attackToEnemy = () => {
    if (_noMoreAttacks()) {
      return new Error("All cells have been attacked");
    }
    const coords = _getCoordsToAttack();
    const result = _enemy.receiveAttack(coords);
    const attackInfo: AttackInfo = { coords, result };
    _previousAttacks.push(attackInfo);
    return attackInfo;
  };

  return {
    ..._player,
    attackToEnemy,
  };
};
