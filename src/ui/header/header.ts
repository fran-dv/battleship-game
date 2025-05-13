import { SoundManager } from "../game-sound/game-sound";
import musicOn from "@/assets/image/music-on.svg";
import musicOff from "@/assets/image/music-off.svg";
import fxOn from "@/assets/image/fx-on.png";
import fxOff from "@/assets/image/fx-off.png";
import { DataClickAttrs } from "@/ui";

const headerElement = document.querySelector("header");
const headerElementOrError = headerElement
  ? headerElement
  : new Error("Header element was not found");

interface HeaderHandler {
  clickOnMuteMusic: () => void;
  clickOnMuteFx: () => void;
}

export const Header = ((
  container: HTMLElement | Error,
): HeaderHandler | null => {
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

  return {
    clickOnMuteMusic,
    clickOnMuteFx,
  };
})(headerElementOrError);
