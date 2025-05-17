import type { GameSession, Player } from "@/core";
import type {
  GameSessionView,
  HomeHandlers,
  LauncherHandlers,
  ShipPlacementView,
} from "@/ui";
import {
  Footer,
  renderGameSessionView,
  renderHomeView,
  renderLauncherView,
  renderShipPlacementView,
} from "@/ui";

export interface ViewHandlers {
  loadLauncherView: () => void;
  loadHomeView: () => void;
  clickOnOnePlayerButton: (gameSession: GameSession) => void;
  clickOnTwoPlayersButton: (gameSession: GameSession) => void;
  loadGameSessionView: (parent: HTMLElement, gameSession: GameSession) => void;
  executeAttack: (cellDiv: HTMLDivElement, gameSession: GameSession) => void;
  announceWinnerAndButton: (player: Player) => void;
}

type ViewType =
  | LauncherHandlers
  | HomeHandlers
  | GameSessionView
  | ShipPlacementView;

export const transitionsDelay = 2000;

export const initViews = (parent: HTMLElement): ViewHandlers => {
  let currentView: ViewType = renderLauncherView(parent);

  const loadLauncherView = () => {
    currentView.destroy();
    currentView = renderLauncherView(parent);
  };
  const loadHomeView = () => {
    currentView.destroy();
    currentView = renderHomeView(parent, transitionsDelay);
  };

  const loadGameSessionView = (
    parent: HTMLElement,
    gameSession: GameSession,
  ) => {
    currentView.destroy();
    currentView = renderGameSessionView(parent, gameSession, transitionsDelay);
  };

  const clickOnOnePlayerButton = (gameSession: GameSession) => {
    if (!("clickOnButton" in currentView)) {
      console.error("clickOnButton not found in current view");
      return;
    }
    (currentView as HomeHandlers).clickOnButton();
    currentView.destroy();
    currentView = renderShipPlacementView(
      parent,
      gameSession.getPlayers()[0],
      null,
      transitionsDelay,
    );
  };
  const clickOnTwoPlayersButton = (gameSession: GameSession) => {
    if (!("clickOnButton" in currentView)) {
      console.error("clickOnButton not found in current view");
      return;
    }
    (currentView as HomeHandlers).clickOnButton();
    currentView.destroy();
    currentView = renderShipPlacementView(
      parent,
      gameSession.getPlayers()[0],
      gameSession.getPlayers()[1],
      transitionsDelay,
    );
  };

  const announceWinnerAndButton = (player: Player) => {
    Footer?.setMessage(`${player.getName()} won the game!`);
    Footer?.showPlayAgainButton();
  };

  const executeAttack = (cellDiv: HTMLDivElement, gameSession: GameSession) => {
    if (!("executeAttack" in currentView)) {
      console.error("executeAttack not found in current view");
      return;
    }
    if (gameSession.getWinner()) {
      return;
    }
    (currentView as GameSessionView).executeAttack(cellDiv);
    if (gameSession.getWinner()) {
      announceWinnerAndButton(gameSession.getWinner()!);
      return;
    }
  };

  return {
    loadLauncherView,
    loadHomeView,
    clickOnOnePlayerButton,
    clickOnTwoPlayersButton,
    loadGameSessionView,
    executeAttack,
    announceWinnerAndButton,
  };
};
