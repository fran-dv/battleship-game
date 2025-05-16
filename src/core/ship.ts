export interface Ship {
  hit: () => void;
  getLength: () => number;
  isSunk: () => boolean;
}

export const newShip = (length: number): Ship => {
  let _hits = 0;
  const _length = length;

  const isSunk = () => _hits === _length;

  const hit = () => {
    if (!isSunk()) {
      _hits++;
    }
  };

  const getLength = () => _length;

  return {
    hit,
    getLength,
    isSunk,
  };
};
