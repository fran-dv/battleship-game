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
      imageUrl: "",
      className: "carrier",
    },
    {
      size: 4,
      name: "Battleship",
      imageUrl: "",
      className: "battleship",
    },
    {
      size: 3,
      name: "Cruiser",
      imageUrl: "",
      className: "cruiser",
    },
    {
      size: 3,
      name: "Submarine",
      imageUrl: "",
      className: "submarine",
    },
    {
      size: 2,
      name: "Patrol Boat",
      imageUrl: "",
      className: "patrol-boat",
    },
  ],
} as const;
