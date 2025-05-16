import type { ShipType } from "@/core";
import carrierHorizontal from "@/assets/image/ships/carrier-ship-horizontal.png";
import battleshipHorizontal from "@/assets/image/ships/battleship-ship-horizontal.png";
import cruiserHorizontal from "@/assets/image/ships/cruiser-ship-horizontal.png";
import destroyerHorizontal from "@/assets/image/ships/destroyer-ship-horizontal.png";
import patrolBoatHorizontal from "@/assets/image/ships/patrol-boat-ship-horizontal.png";
import carrierVertical from "@/assets/image/ships/carrier-ship-vertical.png";
import battleshipVertical from "@/assets/image/ships/battleship-ship-vertical.png";
import cruiserVertical from "@/assets/image/ships/cruiser-ship-vertical.png";
import destroyerVertical from "@/assets/image/ships/destroyer-ship-vertical.png";
import patrolBoatVertical from "@/assets/image/ships/patrol-boat-ship-vertical.png";

export const getShipImage = (type: ShipType, isVertical: boolean): string => {
  let image: string | null = null;
  if (!isVertical) {
    switch (type) {
      case "carrier":
        image = carrierHorizontal;
        break;
      case "battleship":
        image = battleshipHorizontal;
        break;
      case "cruiser":
        image = cruiserHorizontal;
        break;
      case "destroyer":
        image = destroyerHorizontal;
        break;
      case "patrol-boat":
        image = patrolBoatHorizontal;
        break;
      default:
        image = carrierHorizontal;
    }
  } else {
    switch (type) {
      case "carrier":
        image = carrierVertical;
        break;
      case "battleship":
        image = battleshipVertical;
        break;
      case "cruiser":
        image = cruiserVertical;
        break;
      case "destroyer":
        image = destroyerVertical;
        break;
      case "patrol-boat":
        image = patrolBoatVertical;
        break;
      default:
        image = carrierVertical;
    }
  }

  if (!image) {
    console.error(`Invalid ship type: ${type}`);
    image = carrierHorizontal;
  }

  return image;
};
