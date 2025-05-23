import {
  CellState,
  type CellStateType,
  type Coordinates,
  type GameSession,
} from "@/core";
import { generateDiv } from "@fran-dv/ui-components";
import styles from "./game-session.module.css";
import {
  Footer,
  renderGameboard,
  SoundManager,
  type GameboardHandlers,
} from "@/ui";
import { doWithDelay } from "@/utilities";

export interface GameSessionView {
  executeAttack: (cellDiv: HTMLDivElement) => void;
  destroy: () => void;
}

const setStyles = (parent: HTMLElement, put: boolean) => {
  const footer = document.querySelector("footer");
  if (!footer) {
    console.error("Footer element was not found");
  }
  if (!put) {
    parent.classList.remove(styles.overlay);
    parent.classList.remove(styles.parent);
    footer?.classList.remove(styles.overlay);
    return;
  }
  parent.classList.add(styles.overlay);
  parent.classList.add(styles.parent);
  footer?.classList.add(styles.overlay);
};

export const renderGameSessionView = (
  parent: HTMLElement,
  gameSession: GameSession,
  delay: number = 0,
): GameSessionView => {
  const boardsContainers = [
    generateDiv({ classes: [styles.boardContainer] }),
    generateDiv({ classes: [styles.boardContainer] }),
  ];

  const boards: Record<number, GameboardHandlers> = {
    [gameSession.getPlayers()[0].getId()]: renderGameboard(
      gameSession.getPlayers()[0],
      boardsContainers[0],
    ),
    [gameSession.getPlayers()[1].getId()]: renderGameboard(
      gameSession.getPlayers()[1],
      boardsContainers[1],
    ),
  };

  const setInTurnIndications = () => {
    Footer?.setMessage(`${gameSession.getPlayerInTurn().getName()}'s turn!`);
    boardsContainers.forEach((boardsContainer) => {
      const boardTitle: HTMLHeadingElement | null =
        boardsContainer.querySelector(`.${styles.boardTitle}`);
      if (
        boardTitle &&
        boardTitle.dataset.playerId ===
          gameSession.getPlayerInTurn().getId().toString()
      ) {
        boardTitle.classList.add(styles.inTurn);
      } else if (boardTitle) {
        boardTitle.classList.remove(styles.inTurn);
      }
    });
  };

  const resetTurnIndications = () => {
    boardsContainers.forEach((boardContainer) => {
      const boardTitle: HTMLHeadingElement | null =
        boardContainer.querySelector(`.${styles.boardTitle}`);
      if (boardTitle) {
        boardTitle.classList.remove(styles.inTurn);
      }
    });
  };

  boardsContainers.forEach((boardContainer, i) => {
    const boardLegends = document.createElement("div");
    boardLegends.classList.add(styles.boardLegendsContainer);
    const boardTitle = document.createElement("h2");
    boardTitle.classList.add(styles.boardTitle);
    boardTitle.dataset.playerId = gameSession
      .getPlayers()
      [i].getId()
      .toString();
    boardTitle.textContent = gameSession.getPlayers()[i].getName();
    boardLegends.appendChild(boardTitle);
    doWithDelay(() => {
      boardContainer.appendChild(boardLegends);
      parent.appendChild(boardContainer);
      setStyles(parent, true);
      // indicate the first turn
      setInTurnIndications();
    }, delay);
  });

  // game session management
  const executeAttack = (cellDiv: HTMLDivElement) => {
    const x = Number(cellDiv.dataset.x);
    const y = Number(cellDiv.dataset.y);
    const playerId = Number(cellDiv.dataset.playerId);

    if (playerId === gameSession.getPlayerInTurn().getId()) {
      return;
    }
    const cellAttackedState = gameSession
      .getPlayerById(playerId)
      ?.getGameboard()
      .getCellState({ x, y });
    if (
      cellAttackedState !== CellState.empty &&
      cellAttackedState !== CellState.ship
    ) {
      return;
    }

    const reRenderCellAfterAttack = (coords: Coordinates, playerId: number) => {
      boards[playerId].reRenderCell(coords);
    };

    const playSound = (cellStatus: CellStateType) => {
      SoundManager.playCellSound(cellStatus);
    };

    gameSession.makeAttack(
      { x, y },
      setInTurnIndications,
      reRenderCellAfterAttack,
      playSound,
    );
    if (gameSession.getWinner()) {
      resetTurnIndications();
    }
  };

  const destroy = () => {
    setStyles(parent, false);
    while (parent.firstChild) parent.firstChild.remove();
  };

  return {
    executeAttack,
    destroy,
  };
};
