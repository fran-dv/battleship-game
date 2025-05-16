import {
  CellState,
  type ComputerPlayer,
  type Coordinates,
  type PlacedShip,
  type Player,
  type Ship,
} from "@/core";
import { generateDiv } from "@fran-dv/ui-components";
import styles from "./gameboard.module.css";
import { DataClickAttrs } from "@/ui";
import { getShipImage } from "@/utilities/ship-image";

export interface GameboardHandlers {
  reRenderCell: (coords: Coordinates) => void;
  reRenderBoardWithShipsVisible: () => void;
  destroy: () => void;
}

type Orientation = "horizontal" | "vertical";

interface ShipRenderData {
  element: HTMLElement;
  type: string;
  length: number;
  orientation: Orientation;
  startCoords: Coordinates;
}

const isCorner = (
  i: number,
  j: number,
  player: Player | ComputerPlayer,
): string | null => {
  const isCornerTopLeft = i === player.getGameboard().getSize() - 1 && j === 0;
  const isCornerTopRight =
    i === player.getGameboard().getSize() - 1 &&
    j === player.getGameboard().getSize() - 1;
  const isCornerBottomLeft = i === 0 && j === 0;
  const isCornerBottomRight =
    i === 0 && j === player.getGameboard().getSize() - 1;

  return isCornerTopLeft
    ? styles.cornerTopLeft
    : isCornerTopRight
      ? styles.cornerTopRight
      : isCornerBottomLeft
        ? styles.cornerBottomLeft
        : isCornerBottomRight
          ? styles.cornerBottomRight
          : null;
};

export const renderGameboard = (
  player: Player | ComputerPlayer,
  container: HTMLElement,
  shipsVisible: boolean = false,
): GameboardHandlers => {
  const board = generateDiv({ classes: [styles.gameboard] });
  for (let i = player.getGameboard().getSize() - 1; i >= 0; i--) {
    for (let j = 0; j < player.getGameboard().getSize(); j++) {
      const cell = generateDiv({
        classes: [styles.cell],
        customAttrs: [
          {
            name: "x",
            value: String(j),
          },
          {
            name: "y",
            value: String(i),
          },
          {
            name: "click",
            value: DataClickAttrs.Cell,
          },
          {
            name: "playerId",
            value: String(player.getId()),
          },
        ],
      });
      const isACorner = isCorner(i, j, player);
      if (isACorner) cell.classList.add(isACorner);
      board.appendChild(cell);
    }
  }

  container.appendChild(board);
  const reRenderCell = ({ x, y }: Coordinates) => {
    console.log(
      `rerendered cell {${x}, ${y}} with status ${player.getGameboard().getCellState({ x, y })}`,
    );
  };

  let cellSize = 0;
  const ships: ShipRenderData[] = [];
  let dragState: {
    ship: ShipRenderData;
    offset: Coordinates;
  } | null = null;

  // calculate cell size
  const calculateCellSize = () => {
    const tempCell = board.querySelector<HTMLElement>(`.${styles.cell}`)!;
    cellSize = tempCell.offsetWidth;
  };

  const _addStylesToShip = (
    cellDiv: HTMLDivElement,
    coords: Coordinates,
    shipLength: number,
    isVertical: boolean,
  ) => {
    const { x, y } = coords;
    // ensure that the ship has the corresponding class
    cellDiv.classList.add(styles.ship);

    let translateXValue: number = 0;
    let translateYValue: number = 0;
    let widthValue: number = 0;
    let heightValue: number = 0;
    if (!isVertical) {
      translateXValue = x * cellSize;
      translateYValue = (player.getGameboard().getSize() - 1 - y) * cellSize;
      widthValue = cellSize * shipLength;
      heightValue = cellSize;
    } else {
      translateXValue = x * cellSize;
      translateYValue =
        (player.getGameboard().getSize() - shipLength - y) * cellSize;
      widthValue = cellSize;
      heightValue = cellSize * shipLength;
    }

    cellDiv.style.setProperty("--translate-x", `${translateXValue}px`);
    cellDiv.style.setProperty("--translate-y", `${translateYValue}px`);
    cellDiv.style.setProperty("--width", `${widthValue}px`);
    cellDiv.style.setProperty("--height", `${heightValue}px`);
  };

  const _createShipElement = (ship: PlacedShip) => {
    const element = generateDiv({ classes: [styles.ship] });
    _addStylesToShip(
      element,
      ship.coords[0],
      ship.ship.getLength(),
      ship.isVertical,
    );
    const shipImage = getShipImage(ship.type, ship.isVertical);
    element.style.backgroundImage = `url(${shipImage})`;
    return element;
  };

  const _updateShips = () => {
    calculateCellSize();
    ships.forEach((shipRenderData) => {
      const { element, orientation, length, startCoords } = shipRenderData;
      _addStylesToShip(
        element as HTMLDivElement,
        startCoords,
        length,
        orientation === "vertical",
      );
    });
  };

  const _initDrag = () => {

  }

  if (shipsVisible) {
    // wait that the gameboard is fully rendered
    setTimeout(() => {
      calculateCellSize();
      player.getAllPlacedShips().forEach((ship) => {
        const element = _createShipElement(ship);
        element.style.zIndex = "10";
        board.appendChild(element);
        ships.push({
          element,
          type: ship.type,
          length: ship.ship.getLength(),
          orientation: ship.isVertical ? "vertical" : "horizontal",
          startCoords: ship.coords[0],
        });
      });
      // drag and drop (lacks implementation)
    }, 100);
  }

  // Make the ships responsive
  const resizeObserver = new ResizeObserver(_updateShips);
  resizeObserver.observe(board);

  const reRenderBoardWithShipsVisible = () => {
    destroy();
    renderGameboard(player, container, true);
  };

  const destroy = () => {
    while (container.firstChild) container.firstChild.remove();
  };

  return {
    reRenderCell,
    reRenderBoardWithShipsVisible,
    destroy,
  };
};
