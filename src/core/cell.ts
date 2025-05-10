export const CellState = {
  empty: "empty", // default empty state
  ship: "ship", // contains an unhit part of a ship
  hit: "hit", // successful attack on a ship
  miss: "miss", // failed attack (shot landed in water)
  sunk: "sunk", // ship cell sunk
};

export type CellStateType = keyof typeof CellState;

export interface Cell {
  getState: () => CellStateType;
  setState: (state: CellStateType) => void;
}

export const newCell = (): Cell => {
  let _state: CellStateType = CellState.empty as CellStateType;

  const setState = (state: CellStateType) => {
    _state = state;
  };

  const getState = () => _state;

  return {
    getState,
    setState,
  };
};
