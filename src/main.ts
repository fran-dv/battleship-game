import "./index.css";
import { DataClickAttrs, IDS, initViews } from "@/ui";
import { Footer } from "@/ui";
import { initGameSession, newPlayer, type GameSession } from "@/core";
import { generateDiv } from "@fran-dv/ui-components";
import styles from "./main.module.css";

const main = document.getElementById(IDS.Root);
const parent = generateDiv({ classes: [styles.parent] });

if (!main) {
  throw new Error("Main element not found");
}
main.appendChild(parent);

const Views = initViews(parent);
let CurrentGameSession: GameSession | null = null;

const errorAndReturnHome = (msg: string) => {
  console.error(msg);
  Views.loadHomeView();
};

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
      CurrentGameSession = initGameSession(newPlayer("Player one"));
      Views.clickOnOnePlayerButton(CurrentGameSession);
      break;
    case DataClickAttrs.TwoPlayers:
      CurrentGameSession = initGameSession(
        newPlayer("Player one"),
        newPlayer("Player two"),
      );
      Views.clickOnTwoPlayersButton(CurrentGameSession);
      break;
    case DataClickAttrs.ToggleSoundEffects:
      Footer?.clickOnMuteFx();
      break;
    case DataClickAttrs.ToggleBackgroundMusic:
      Footer?.clickOnMuteMusic();
      break;
    case DataClickAttrs.StartGame:
      if (!CurrentGameSession) {
        errorAndReturnHome("Active game session not found");
        return;
      }
      Views.loadGameSessionView(parent, CurrentGameSession);
      break;
    case DataClickAttrs.Cell:
      if (!CurrentGameSession) {
        errorAndReturnHome("Active game session not found");
        return;
      }
      Views.executeAttack(elem as HTMLDivElement, CurrentGameSession);
      break;
  }
};

document.body.addEventListener("click", clickHandler);
