import { CellState, type CellStateType } from "@/core";

interface SoundManagerType {
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  toggleBackgroundMusic: () => void;
  toggleSoundEffects: () => void;
  clickOnButton: () => void;
  playCellSound: (cellState: CellStateType) => void;
}

export const SoundManager = ((parent: HTMLElement): SoundManagerType => {
  const backgroundMusic = new Audio("/src/assets/audio/bg-music.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  backgroundMusic.preload = "auto";
  const clickSoundEffect = new Audio("/src/assets/audio/press-button.mp3");
  clickSoundEffect.preload = "auto";

  const soundPaths = {
    hit: "/src/assets/audio/hit.mp3",
    miss: "/src/assets/audio/miss.mp3",
    sunk: "/src/assets/audio/sunk.mp3",
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
