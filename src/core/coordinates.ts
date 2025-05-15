export interface Coordinates {
  x: number;
  y: number;
}

export const areCoordsEqual = (coords1: Coordinates, coords2: Coordinates) => {
  return coords1.x === coords2.x && coords1.y === coords2.y;
};

export const getRandomCoords = (
  amount: number,
  gameboardSize: number,
): Array<Coordinates> => {
  const coords: Array<Coordinates> = [];
  for (let i = 0; i < amount; i++) {
    const x = Math.floor(Math.random() * gameboardSize);
    const y = Math.floor(Math.random() * gameboardSize);
    coords.push({ x, y });
  }
  return coords;
};
