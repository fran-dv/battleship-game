export interface Coordinates {
  x: number;
  y: number;
}

export const areCoordsEqual = (coords1: Coordinates, coords2: Coordinates) => {
  return coords1.x === coords2.x && coords1.y === coords2.y;
};
