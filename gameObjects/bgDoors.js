import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class DoorPuzzleBG extends BaseGameObject {
  constructor(x) {
    super(x, 0, global.canvas.width, global.canvas.height, ["./assets/bgDoors.png"]);
    this.name = "DoorPuzzleBG";
    this.setAnimation(0, 0);
    this.isWorldObject = true;

  }
}

export { DoorPuzzleBG };
