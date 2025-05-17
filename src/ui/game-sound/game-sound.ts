import { CellState, type CellStateType } from "@/core";
import bgMusic from "@/assets/audio/bg-music.mp3";
import clickSound from "@/assets/audio/press-button.mp3";
import hitSound from "@/assets/audio/hit.mp3";
import missSound from "@/assets/audio/miss.mp3";
import sunkSound from "@/assets/audio/sunk.mp3";

interface SoundManagerType {
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  toggleBackgroundMusic: () => void;
  toggleSoundEffects: () => void;
  clickOnButton: () => void;
  playCellSound: (cellState: CellStateType) => void;
}

export const SoundManager = ((parent: HTMLElement): SoundManagerType => {
  const backgroundMusic = new Audio(bgMusic);
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  backgroundMusic.preload = "auto";
  const clickSoundEffect = new Audio(clickSound);
  clickSoundEffect.preload = "auto";

  const soundPaths = {
    hit: hitSound,
    miss: missSound,
    sunk: sunkSound,
  };

  const playSound = (path: string, volume = 0.5) => {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.preload = "auto";
    audio.play();
  };

  let fxActive = true;

  const playBackgroundMusic = () => {
    backgroundMusic.play();
  };
  const pauseBackgroundMusic = () => {
    backgroundMusic.pause();
  };
  const toggleBackgroundMusic = () => {
    backgroundMusic.muted = !backgroundMusic.muted;
  };
  const toggleSoundEffects = () => {
    fxActive = !fxActive;
  };
  const clickOnButton = () => {
    if (!fxActive) {
      return;
    }
    clickSoundEffect.play();
  };

  const playCellSound = (cellState: CellStateType) => {
    if (!fxActive) {
      return;
    }

    switch (cellState) {
      case CellState.hit:
        playSound(soundPaths.hit);
        break;
      case CellState.miss:
        playSound(soundPaths.miss);
        break;
      case CellState.sunk:
        playSound(soundPaths.sunk);
        break;
    }
  };

  parent.appendChild(backgroundMusic);
  parent.appendChild(clickSoundEffect);

  return {
    playBackgroundMusic,
    pauseBackgroundMusic,
    toggleBackgroundMusic,
    toggleSoundEffects,
    clickOnButton,
    playCellSound,
  };
})(document.body);
