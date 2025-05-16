import battleshipImage from "@/assets/image/ships/battleship-ship-horizontal.png";
import carrierImage from "@/assets/image/ships/carrier-ship-horizontal.png";
import cruiserImage from "@/assets/image/ships/cruiser-ship-horizontal.png";
import destroyerImage from "@/assets/image/ships/destroyer-ship-horizontal.png";
import patrolBoatImage from "@/assets/image/ships/patrol-boat-ship-horizontal.png";

export type ShipType =
  | "carrier"
  | "battleship"
  | "cruiser"
  | "destroyer"
  | "patrol-boat";
type GameMode = "single-player" | "multiplayer";

interface ShipData {
  size: number;
  name: string;
  imageUrl: string;
  type: ShipType;
}

interface Rules {
  boardSize: number;
  numberOfPlayers: number;
  gameModes: {
    singlePlayer: GameMode;
    multiPlayer: GameMode;
  };
  numberOfShips: number;
  ships: Array<ShipData>;
}

export const GameRules: Rules = {
  boardSize: 10,
  numberOfPlayers: 2,
  gameModes: {
    singlePlayer: "single-player",
    multiPlayer: "multiplayer",
  } as const,
  numberOfShips: 5,
  ships: [
    {
      size: 5,
      name: "Carrier",
      imageUrl: carrierImage,
      type: "carrier",
    },
    {
      size: 4,
      name: "Battleship",
      imageUrl: battleshipImage,
      type: "battleship",
    },
    {
      size: 3,
      name: "Cruiser",
      imageUrl: cruiserImage,
      type: "cruiser",
    },
    {
      size: 3,
      name: "Destroyer",
      imageUrl: destroyerImage,
      type: "destroyer",
    },
    {
      size: 2,
      name: "Patrol Boat",
      imageUrl: patrolBoatImage,
      type: "patrol-boat",
    },
  ],
} as const;
