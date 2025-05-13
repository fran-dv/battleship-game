import "./index.css";
import { DataClickAttrs, IDS, initViews } from "@/ui";
import { Header } from "@/ui";

const main = document.getElementById(IDS.Root);

if (!main) {
  throw new Error("Main element not found");
}

const Views = initViews(main);

const clickHandler = (e: MouseEvent) => {
  const elem: HTMLElement | null = (e.target as HTMLElement).closest(
    "[data-click]",
  );
  if (!elem) return;

  switch (elem.dataset.click) {
    case DataClickAttrs.LaunchGame:
      Views.loadHomeView();
      break;
    case DataClickAttrs.OnePlayer:
      Views.clickOnOnePlayerButton();
      break;
    case DataClickAttrs.TwoPlayers:
      Views.clickOnTwoPlayersButton();
      break;
    case DataClickAttrs.ToggleSoundEffects:
      Header?.clickOnMuteFx();
      break;
    case DataClickAttrs.ToggleBackgroundMusic:
      console.log("mute music");
      Header?.clickOnMuteMusic();
      break;
  }
};

document.body.addEventListener("click", clickHandler);
