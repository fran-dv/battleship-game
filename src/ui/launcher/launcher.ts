import { DataClickAttrs } from "@/ui";
import { renderHomeView } from "@/ui";
import { generateDiv } from "@fran-dv/ui-components";
import styles from "./launcher.module.css";

export interface LauncherHandlers {
  clickOnLaunchGameButton: () => void;
  destroy: () => void;
}

const hideHeader = () => {
  document.querySelector("header")?.classList.add(styles.hidden);
};

const showHeader = () => {
  document.querySelector("header")?.classList.remove(styles.hidden);
};

export const renderLauncherView = (parent: HTMLElement): LauncherHandlers => {
  console.log("renderLauncherView");
  hideHeader();

  const container = generateDiv({ classes: [styles.container] });
  const launchGameButton = document.createElement("button");
  launchGameButton.classList.add(styles.launchGame);
  launchGameButton.textContent = "Launch game";
  launchGameButton.dataset.click = DataClickAttrs.LaunchGame;
  container.appendChild(launchGameButton);
  parent.appendChild(container);

  const destroy = () => {
    parent.removeChild(container);
    showHeader();
  };
  const clickOnLaunchGameButton = () => {
    destroy();
    renderHomeView(parent);
  };

  return {
    destroy,
    clickOnLaunchGameButton,
  };
};
