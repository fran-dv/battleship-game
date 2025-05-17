import {
  CellState,
  type ComputerPlayer,
  type Coordinates,
  type PlacedShip,
  type Player,
  type ShipType,
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
    const cellSelector = ({ x, y }: Coordinates) =>
      `.${styles.cell}[data-x="${x}"][data-y="${y}"]`;
    const cell = board.querySelector<HTMLElement>(cellSelector({ x, y }));
    if (!cell) {
      console.error(`Cell {${x}, ${y}} not found`);
      return;
    }
    const removeAllStateClasses = () => {
      cell.classList.remove(styles.hit, styles.miss, styles.sunk);
    };
    removeAllStateClasses();
    const cellStatus = player.getGameboard().getCellState({ x, y });
    if (cellStatus === CellState.hit || cellStatus === CellState.miss) {
      cell.classList.add(styles[cellStatus]);
      return;
    }

    if (cellStatus === CellState.sunk) {
      const ship = player.getGameboard().getShipByCoords({ x, y });
      if (!ship) {
        console.error(`Ship not found at cell {${x}, ${y}}`);
        return;
      }
      removeAllStateClasses();
      ship.coords.forEach((coord) => {
        const cell = board.querySelector<HTMLElement>(cellSelector(coord));
        if (!cell) {
          console.error(`Cell {${coord.x}, ${coord.y}} not found`);
          return;
        }
        cell.classList.add(styles[cellStatus]);
      });
    }
  };

  let cellSize = 0;
  const ships: ShipRenderData[] = [];

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

  let dragState: {
    ship: ShipRenderData;
    offset: Coordinates;
  } | null = null;

  let currentSelectedShip: PlacedShip | null = null;

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragState) return;

    const { ship, offset } = dragState;
    const placedShipObject = player
      .getGameboard()
      .getShipByCoords(ship.startCoords);
    if (placedShipObject) {
      currentSelectedShip = {
        ship: placedShipObject.ship,
        coords: placedShipObject.coords,
        isVertical: placedShipObject.isVertical,
        type: placedShipObject.type,
      };
      player.removePlacedShip(currentSelectedShip.coords[0]);
    }

    const rect = board.getBoundingClientRect();
    const clientX =
      window.TouchEvent && e instanceof TouchEvent
        ? e.touches[0].clientX
        : (e as MouseEvent).clientX;
    const clientY =
      window.TouchEvent && e instanceof TouchEvent
        ? e.touches[0].clientY
        : (e as MouseEvent).clientY;

    const gridX =
      Math.round((clientX - rect.left - offset.x) / cellSize) * cellSize;
    const gridY =
      Math.round((clientY - rect.top - offset.y) / cellSize) * cellSize;

    ship.element.style.transform = `translate(${gridX}px, ${gridY}px)`;
  };

  const _getShipStartCoords = (x: number, y: number): Coordinates => {
    if (!dragState) {
      console.error("No ship selected");
      return { x: 0, y: 0 };
    }
    const isVertical = dragState.ship.orientation === "vertical";
    const shipLength = dragState.ship.length;

    // initial pos
    const startCol = Math.round(x / cellSize);
    const value =
      player.getGameboard().getSize() - 1 - Math.round(y / cellSize);
    const startRow = isVertical ? value - shipLength + 1 : value;

    return { x: startCol, y: startRow };
  };

  const resetShipPosition = () => {
    if (!dragState) return;

    const isVertical = dragState.ship.orientation === "vertical";
    const shipLength = dragState.ship.length;
    let translateXValue = 0;
    let translateYValue = 0;
    if (!isVertical) {
      translateXValue = dragState.ship.startCoords.x * cellSize;
      translateYValue =
        (player.getGameboard().getSize() - 1 - dragState.ship.startCoords.y) *
        cellSize;
    } else {
      translateXValue = dragState.ship.startCoords.x * cellSize;
      translateYValue =
        (player.getGameboard().getSize() -
          shipLength -
          dragState.ship.startCoords.y) *
        cellSize;
    }

    dragState.ship.element.style.transform = `translate(
      ${translateXValue}px, 
      ${translateYValue}px
    )`;
  };

  const cleanUpDrag = () => {
    if (!dragState) return;
    dragState.ship.element.classList.remove(styles.dragging);
    dragState = null;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("touchmove", onDrag);
  };

  const stopDrag = () => {
    if (!dragState) return;
    // Calculate final position
    const matrix = new DOMMatrix(dragState.ship.element.style.transform);
    const x = matrix.m41;
    const y = matrix.m42;

    const startCoords = _getShipStartCoords(x, y);
    const startCol = startCoords.x;
    const startRow = startCoords.y;

    const isVertical = dragState.ship.orientation === "vertical";
    const shipLength = dragState.ship.length;

    const endCol = isVertical ? startCol : startCol + shipLength - 1;
    const endRow = isVertical ? startRow + shipLength - 1 : startRow;

    // board limits
    const boardSize = player.getGameboard().getSize();
    const isValidPosition =
      startCol >= 0 &&
      startCol < boardSize &&
      startRow >= 0 &&
      startRow < boardSize &&
      endCol < boardSize &&
      endCol >= 0 &&
      endRow < boardSize &&
      endRow >= 0;

    if (!isValidPosition) {
      player.placeShip(
        currentSelectedShip!.ship!,
        currentSelectedShip!.coords[0],
        currentSelectedShip!.isVertical,
        currentSelectedShip!.type,
      );
      resetShipPosition();
      currentSelectedShip = null;
      cleanUpDrag();
      return;
    }

    // Try to place ship
    if (!currentSelectedShip) {
      console.error("no ship selected");
      return;
    }
    const ship = currentSelectedShip.ship;
    const success = player
      .getGameboard()
      .placeShip(
        ship,
        { x: startCol, y: startRow },
        dragState.ship.orientation === "vertical",
        dragState.ship.type as ShipType,
      );

    if (!success) {
      player.placeShip(
        currentSelectedShip!.ship!,
        currentSelectedShip!.coords[0],
        currentSelectedShip!.isVertical,
        currentSelectedShip!.type,
      );
      currentSelectedShip = null;
      resetShipPosition();
      cleanUpDrag();
      return;
    }
    dragState.ship.startCoords = { x: startCol, y: startRow };
    cleanUpDrag();
    currentSelectedShip = null;
  };

  const startDrag = (e: MouseEvent | TouchEvent) => {
    const shipElem = e.currentTarget as HTMLDivElement;
    const shipData = ships.find((s) => s.element === shipElem)!;

    shipElem.classList.add(styles.dragging);
    const rect = shipElem.getBoundingClientRect();
    const offsetX =
      (window.TouchEvent && e instanceof TouchEvent
        ? e.touches[0].clientX
        : (e as MouseEvent).clientX) - rect.left;
    const offsetY =
      (window.TouchEvent && e instanceof TouchEvent
        ? e.touches[0].clientY
        : (e as MouseEvent).clientY) - rect.top;
    dragState = {
      ship: shipData,
      offset: { x: offsetX, y: offsetY },
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);
  };

  const _initDrag = () => {
    ships.forEach((shipData) => {
      const { element } = shipData;
      element.addEventListener("mousedown", startDrag);
      element.addEventListener("touchstart", startDrag);
    });
  };

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
      _initDrag();
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
