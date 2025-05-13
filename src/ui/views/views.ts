import type { HomeHandlers, LauncherHandlers } from "@/ui";
import { renderHomeView } from "@/ui";
import { renderLauncherView } from "@/ui";

interface ViewHandlers {
  loadLauncherView: () => void;
  loadHomeView: () => void;
  clickOnOnePlayerButton: () => void;
  clickOnTwoPlayersButton: () => void;
}

type ViewType = LauncherHandlers | HomeHandlers;

export const initViews = (parent: HTMLElement): ViewHandlers => {
  let currentView: ViewType = renderLauncherView(parent);

  const loadLauncherView = () => {
    currentView.destroy();
    currentView = renderLauncherView(parent);
  };
  const loadHomeView = () => {
    currentView.destroy();
    currentView = renderHomeView(parent);
  };
  const clickOnOnePlayerButton = () => {
    if (!("clickOnOnePlayerButton" in currentView)) {
      console.error("clickOnOnePlayerButton not found in current view");
      return;
    }
    (currentView as HomeHandlers).clickOnOnePlayerButton();
  };
  const clickOnTwoPlayersButton = () => {
    if (!("clickOnTwoPlayersButton" in currentView)) {
      console.error("clickOnTwoPlayersButton not found in current view");
      return;
    }
    (currentView as HomeHandlers).clickOnTwoPlayersButton();
  };

  return {
    loadLauncherView,
    loadHomeView,
    clickOnOnePlayerButton,
    clickOnTwoPlayersButton,
  };
};
