import { expect, test } from "vitest";
import {
  newComputerPlayer,
  newPlayer,
  initGameSession,
  type Player,
} from "@/core";

test("get remaining ship of a player is correct", () => {
  const player1 = newPlayer("Player");
  const gameSession = initGameSession(
    player1,
    newComputerPlayer(player1, "Computer"),
  );

  expect(gameSession.getRemainingShips(player1)).toBe(5);
});

test("get winner is working", () => {
  const player1 = newPlayer("Player one");
  const player2 = newPlayer("Player two");
  const gameSession = initGameSession(player1, player2);
  let winner: Player | null = null;
  const length = gameSession.getPlayers()[0].getGameboard().getSize();
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      gameSession.makeAttack({ x: i, y: j });
      if (gameSession.getWinner()) {
        winner = gameSession.getWinner();
        break;
      }
    }

    if (winner) {
      break;
    }
  }

  expect(gameSession.getWinner()).toEqual(winner);
});
