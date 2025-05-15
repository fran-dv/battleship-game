import { SoundManager } from "../game-sound/game-sound";
import musicOn from "@/assets/image/music-on.svg";
import musicOff from "@/assets/image/music-off.svg";
import fxOn from "@/assets/image/fx-on.png";
import fxOff from "@/assets/image/fx-off.png";
import { DataClickAttrs, IDS } from "@/ui";

const footerElement = document.querySelector("footer");
const footerElementOrError = footerElement
  ? footerElement
  : new Error("Footer element was not found");

interface FooterHandler {
  clickOnMuteMusic: () => void;
  clickOnMuteFx: () => void;
  setMessage: (message: string) => void;
}

export const Footer = ((
  container: HTMLElement | Error,
): FooterHandler | null => {
  if (container instanceof Error) {
    console.error(container.message);
    return null;
  }

  let currentMusicState = true;
  let currentFxState = true;
  const musicButton = container.querySelector(
    `img[data-click="${DataClickAttrs.ToggleBackgroundMusic}"]`,
  ) as HTMLImageElement;
  const fxButton = container.querySelector(
    `img[data-click="${DataClickAttrs.ToggleSoundEffects}"]`,
  ) as HTMLImageElement;

  const clickOnMuteMusic = () => {
    SoundManager.toggleBackgroundMusic();
    currentMusicState = !currentMusicState;
    musicButton.src = currentMusicState ? musicOn : musicOff;
  };

  const clickOnMuteFx = () => {
    SoundManager.toggleSoundEffects();
    currentFxState = !currentFxState;
    fxButton.src = currentFxState ? fxOn : fxOff;
  };

  const setMessage = (message: string) => {
    const msgContainer = document.querySelector(`#${IDS.Messages}`);
    if (!msgContainer) {
      console.error("Messages display element was not found");
      return;
    }

    msgContainer.textContent = message;
  };

  return {
    clickOnMuteMusic,
    clickOnMuteFx,
    setMessage,
  };
})(footerElementOrError);
