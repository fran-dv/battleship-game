import { generateDiv } from "@fran-dv/ui-components";
import styles from "./home.module.css";
import logo from "@/assets/image/logo.png";
import { DataClickAttrs, SoundManager } from "@/ui";

const buttonTexts = {
  onePlayer: "One player",
  twoPlayers: "Two players",
};

export interface HomeHandlers {
  clickOnOnePlayerButton: () => void;
  clickOnTwoPlayersButton: () => void;
  destroy: () => void;
}

export const renderHomeView = (parent: HTMLElement): HomeHandlers => {
  document.body.classList.add(styles.mainBackground);
  const container = generateDiv({ classes: [styles.container] });
  const homeLogoSection = generateDiv({
    classes: [styles.battleshipLogoSection],
  });
  const homeLogo = document.createElement("img");
  homeLogo.classList.add(styles.battleshipLogo);
  homeLogo.src = logo;
  homeLogoSection.appendChild(homeLogo);
  const homeButtonsSection = generateDiv({
    classes: [styles.homeButtonsSection],
  });
  const onePlayerButton = document.createElement("button");
  onePlayerButton.classList.add(styles.homeButton);
  onePlayerButton.textContent = buttonTexts.onePlayer;
  onePlayerButton.dataset.click = DataClickAttrs.OnePlayer;
  const twoPlayersButton = document.createElement("button");
  twoPlayersButton.classList.add(styles.homeButton);
  twoPlayersButton.textContent = buttonTexts.twoPlayers;
  twoPlayersButton.dataset.click = DataClickAttrs.TwoPlayers;
  homeButtonsSection.appendChild(onePlayerButton);
  homeButtonsSection.appendChild(twoPlayersButton);

  container.appendChild(homeLogoSection);
  container.appendChild(homeButtonsSection);
  parent.appendChild(container);

  const clickOnOnePlayerButton = () => {
    SoundManager.clickOnButton();
    // renderOnePlayerView(parent);
  };

  const clickOnTwoPlayersButton = () => {
    SoundManager.clickOnButton();
    // renderTwoPlayersView(parent);
  };

  const destroy = () => {
    parent.removeChild(container);
  };

  SoundManager.playBackgroundMusic();
  return {
    clickOnOnePlayerButton,
    clickOnTwoPlayersButton,
    destroy,
  };
};
