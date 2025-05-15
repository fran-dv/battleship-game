import type { GameSession } from "@/core";
import type {
  GameSessionView,
  HomeHandlers,
  LauncherHandlers,
  ShipPlacementView,
} from "@/ui";
import {
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

  return {
    loadLauncherView,
    loadHomeView,
    clickOnOnePlayerButton,
    clickOnTwoPlayersButton,
    loadGameSessionView,
  };
};
