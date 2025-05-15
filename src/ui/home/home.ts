import { generateDiv } from "@fran-dv/ui-components";
import styles from "./home.module.css";
import animations from "@/ui/animations/animations.module.css";
import logo from "@/assets/image/logo.png";
import { DataClickAttrs, SoundManager } from "@/ui";

const buttonTexts = {
  onePlayer: "One player",
  twoPlayers: "Two players",
};

export interface HomeHandlers {
  clickOnButton: () => void;
  destroy: () => void;
}

export const renderHomeView = (
  parent: HTMLElement,
  delay: number = 0,
): HomeHandlers => {
  const footer = document.querySelector("footer");
  if (footer) {
    footer.classList.add(styles.footer);
  }
  document.body.classList.add(styles.mainBackground);
  const container = generateDiv({ classes: [styles.container] });
  container.classList.add(animations.fadeIn);
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

  parent.classList.add(styles.parent);

  const clickOnButton = () => {
    SoundManager.clickOnButton();
  };

  const destroy = () => {
    container.classList.remove(animations.fadeIn);
    container.classList.add(animations.fadeOut);
    setTimeout(() => {
      parent.classList.remove(styles.parent);
      parent.removeChild(container);
      footer?.classList.remove(styles.footer);
    }, delay);
  };

  SoundManager.playBackgroundMusic();
  return {
    clickOnButton,
    destroy,
  };
};
