interface SoundManagerType {
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  toggleBackgroundMusic: () => void;
  toggleSoundEffects: () => void;
  clickOnButton: () => void;
}

export const SoundManager = ((parent: HTMLElement): SoundManagerType => {
  const backgroundMusic = new Audio("/src/assets/audio/bg-music.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  backgroundMusic.preload = "auto";
  const clickSoundEffect = new Audio("/src/assets/audio/press-button.mp3");
  clickSoundEffect.preload = "auto";

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

  parent.appendChild(backgroundMusic);
  parent.appendChild(clickSoundEffect);

  return {
    playBackgroundMusic,
    pauseBackgroundMusic,
    toggleBackgroundMusic,
    toggleSoundEffects,
    clickOnButton,
  };
})(document.body);
