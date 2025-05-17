import {
  computerPlayerId,
  newComputerPlayer,
  type ComputerPlayer,
  type Coordinates,
  type Player,
  GameRules,
  type AttackInfo,
  type CellStateType,
} from "@/core";
import { doWithDelay } from "@/utilities";

type PlayerOrNull = Player | ComputerPlayer | null;
type PlayersArray = Array<Player | ComputerPlayer>;
type AttackCoordsOrNull = Coordinates | null;

export interface GameSession {
  getPlayerInTurn: () => Player | ComputerPlayer;
  getWinner: () => PlayerOrNull;
  getGameMode: () => string;
  getRemainingShips: (player: Player | ComputerPlayer) => number | null;
  makeAttack: (
    coords: AttackCoordsOrNull,
    callSwitchTurn?: () => void,
    reRenderCallback?: (coords: Coordinates, playerId: number) => void,
    playSoundCallback?: (cellState: CellStateType) => void,
  ) => AttackCoordsOrNull;
  getPlayers: () => PlayersArray;
  getPlayerById: (id: number) => PlayerOrNull;
}

export const initGameSession = (
  player1: Player,
  player2: Player | null = null,
): GameSession => {
  const gameMode = !player2
    ? GameRules.gameModes.singlePlayer
    : GameRules.gameModes.multiPlayer;

  if (!player2) {
    player2 = newComputerPlayer(player1, "Captain Ironskulls");
  }

  let playerInTurn: Player | ComputerPlayer = player1;
  let winner: PlayerOrNull = null;

  const getPlayerNotInTurn = () =>
    playerInTurn === player1 ? player2 : player1;

  const switchTurn = () => {
    playerInTurn = getPlayerNotInTurn();
  };

  const checkIfGameIsOver = () => {
    if (playerInTurn.areAllShipsSunk()) {
      winner = getPlayerNotInTurn();
      return true;
    }
    if (getPlayerNotInTurn().areAllShipsSunk()) {
      winner = playerInTurn;
      return true;
    }
    return false;
  };

  const getPlayerInTurn = () => playerInTurn;

  const getWinner = (): PlayerOrNull => winner;

  const getGameMode = () => gameMode;

  const getRemainingShips = (
    player: Player | ComputerPlayer,
  ): number | null => {
    if (player.getId() === player1.getId()) {
      return player1.getGameboard().getRemainingShips();
    }
    if (player.getId() === player2.getId()) {
      return player2.getGameboard().getRemainingShips();
    }
    console.error(
      `Player with id '${player.getId()}' and name '${player.getName()}' not found`,
    );
    return null;
  };

  // makeAttack calls automatically to the attack of the computer player in single mode
  // It returns null if the attack have been made by a real player
  // and if the attack have been made by the computer it returns the coords of the attack
  const defaultCallback = () => {};
  const makeAttack = (
    coords: AttackCoordsOrNull = null,
    callSwitchTurn: () => void = () => {},
    reRenderCallback: (
      coords: Coordinates,
      playerId: number,
    ) => void = defaultCallback,
    playSoundCallback: (cellState: CellStateType) => void = defaultCallback,
  ): AttackCoordsOrNull => {
    if (getWinner()) {
      console.error("Game is over");
      return null;
    }
    const attackedPlayer = playerInTurn === player1 ? player2 : player1;

    const postAttackSteps = (
      valueToReturn: AttackCoordsOrNull,
      coordsToRerender: Coordinates,
    ) => {
      const gameOver = checkIfGameIsOver();
      playSoundCallback(
        attackedPlayer.getGameboard().getCellState(coordsToRerender),
      );
      reRenderCallback(coordsToRerender, attackedPlayer.getId());
      switchTurn();
      callSwitchTurn();
      if (!gameOver && playerInTurn.getId() === computerPlayerId) {
        makeAttack(null, callSwitchTurn, reRenderCallback, playSoundCallback);
      }
      return valueToReturn;
    };

    if (
      gameMode === GameRules.gameModes.singlePlayer &&
      "attackToEnemy" in playerInTurn
    ) {
      // if attacker is computer
      doWithDelay(() => {
        const result = (playerInTurn as ComputerPlayer).attackToEnemy();
        return postAttackSteps(
          (result as AttackInfo).coords,
          (result as AttackInfo).coords,
        );
      }, 2000);
      return null;
    }
    if (!coords && gameMode === GameRules.gameModes.multiPlayer) {
      console.error("Coordinates to attack are required in two players mode");
      return null;
    }

    attackedPlayer.receiveAttack(coords as Coordinates);
    return postAttackSteps(null, coords as Coordinates);
  };

  const getPlayers = (): PlayersArray => [player1, player2];

  const getPlayerById = (id: number): Player | ComputerPlayer | null => {
    if (player1.getId() === id) return player1;
    if (player2.getId() === id) return player2;
    return null;
  };

  return {
    getPlayerInTurn,
    getWinner,
    getGameMode,
    getRemainingShips,
    makeAttack,
    getPlayers,
    getPlayerById,
  };
};
