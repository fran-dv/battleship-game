interface Ship {
  hit: () => void;
  getLength: () => number;
  isSunk: () => boolean;
}

export const Ship = (length: number): Ship => {
  const _length = length;
  let _hits = 0;

  const hit = () => {
    _hits++;
  };

  const isSunk = () => _hits === _length;

  const getLength = () => _length;

  return {
    hit,
    getLength,
    isSunk,
  };
};
