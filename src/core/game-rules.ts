import battleshipImage from "@/assets/image/ships/battleship-ship-horizontal.png";
import carrierImage from "@/assets/image/ships/carrier-ship-horizontal.png";
import cruiserImage from "@/assets/image/ships/cruiser-ship-horizontal.png";
import destroyerImage from "@/assets/image/ships/destroyer-ship-horizontal.png";
import patrolBoatImage from "@/assets/image/ships/patrol-boat-ship-horizontal.png";

export const GameRules = {
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
      className: "carrier",
    },
    {
      size: 4,
      name: "Battleship",
      imageUrl: battleshipImage,
      className: "battleship",
    },
    {
      size: 3,
      name: "Cruiser",
      imageUrl: cruiserImage,
      className: "cruiser",
    },
    {
      size: 3,
      name: "Destroyer",
      imageUrl: destroyerImage,
      className: "destroyer",
    },
    {
      size: 2,
      name: "Patrol Boat",
      imageUrl: patrolBoatImage,
      className: "patrol-boat",
    },
  ],
} as const;
