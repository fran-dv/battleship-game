import { DataClickAttrs } from "@/ui";
import { renderHomeView } from "@/ui";
import { generateDiv } from "@fran-dv/ui-components";
import styles from "./launcher.module.css";

export interface LauncherHandlers {
  clickOnLaunchGameButton: () => void;
  destroy: () => void;
}

const hideFooter = () => {
  document.querySelector("footer")?.classList.add(styles.hidden);
};

const showFooter = () => {
  document.querySelector("footer")?.classList.remove(styles.hidden);
};

export const renderLauncherView = (parent: HTMLElement): LauncherHandlers => {
  console.log("renderLauncherView");
  hideFooter();

  const container = generateDiv({ classes: [styles.container] });
  const launchGameButton = document.createElement("button");
  launchGameButton.classList.add(styles.launchGame);
  launchGameButton.textContent = "Launch game";
  launchGameButton.dataset.click = DataClickAttrs.LaunchGame;
  container.appendChild(launchGameButton);
  parent.appendChild(container);

  const destroy = () => {
    parent.removeChild(container);
    showFooter();
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
