import {
  CellState,
  type ComputerPlayer,
  type Coordinates,
  type Player,
} from "@/core";
import { generateDiv } from "@fran-dv/ui-components";
import styles from "./gameboard.module.css";
import { DataClickAttrs } from "@/ui";

export interface GameboardHandlers {
  reRenderCell: (coords: Coordinates) => void;
  reRenderBoardWithShipsVisible: () => void;
  destroy: () => void;
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
  console.log("rendering gameboard...");
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
      const cellState = player.getGameboard().getCellState({ x: j, y: i });
      if (shipsVisible && cellState === CellState.ship) {
        const div = generateDiv();
        div.textContent = "X";
        cell.appendChild(div);
      }
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

  const reRenderBoardWithShipsVisible = () => {
    console.log("rerendered board with ships visible");
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
