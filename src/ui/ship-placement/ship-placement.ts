import type { Player } from "@/core";
import { DataClickAttrs, renderGameboard, type GameboardHandlers } from "@/ui";
import styles from "./ship-placement.module.css";
import animations from "@/ui/animations/animations.module.css";
import { doWithDelay } from "@/utilities";

export interface ShipPlacementView {
  destroy: () => void;
}

const createTitle = (player: Player) => {
  const title = document.createElement("h2");
  title.classList.add(styles.title);
  title.textContent = `${player.getName()} Place your ships!`;
  return title;
};

const createNextButton = (text: string): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(styles.nextButton);
  return button;
};

export const renderShipPlacementView = (
  parent: HTMLElement,
  player1: Player,
  player2: Player | null = null,
  delay: number = 0,
): ShipPlacementView => {
  const title = createTitle(player1);
  parent.classList.add(styles.parent);

  let boardPlayer1: GameboardHandlers;

  doWithDelay(() => {
    parent.appendChild(title);
    parent.classList.add(animations.fadeIn);
    boardPlayer1 = renderGameboard(player1, parent, true);
  }, delay);

  const destroy = () => {
    parent.classList.add(animations.fadeOut);
    doWithDelay(() => {
      parent.classList.remove(
        styles.parent,
        animations.fadeIn,
        animations.fadeOut,
      );
      while (parent.firstChild) parent.firstChild.remove();
    }, delay);
  };

  if (player2 === null) {
    doWithDelay(() => {
      const startButton = createNextButton("Start Game");
      startButton.classList.add(styles.nextButton);
      startButton.dataset.click = DataClickAttrs.StartGame;
      parent.appendChild(startButton);
    }, delay);
    return {
      destroy,
    };
  }

  const nextButton = createNextButton("Next player");
  nextButton.classList.add(animations.fadeIn);

  doWithDelay(() => {
    parent.appendChild(nextButton);
  }, delay);

  const handleClick = () => {
    boardPlayer1.destroy();
    nextButton.remove();
    const title = createTitle(player2);
    parent.appendChild(title);
    renderGameboard(player2, parent, true);
    const startButton = createNextButton("Start Game");
    startButton.classList.add(styles.nextButton);
    startButton.dataset.click = DataClickAttrs.StartGame;
    parent.appendChild(startButton);
  };

  const handler = () => handleClick();
  nextButton.addEventListener("click", handler);

  return {
    destroy: () => {
      destroy();
      nextButton.removeEventListener("click", handler);
    },
  };
};
