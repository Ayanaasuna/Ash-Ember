import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class DoorPuzzleBG extends BaseGameObject {
  constructor(x) {
    super(
      x,
      0,
      global.canvas.width,
      global.canvas.height,
      ["../assets/bgDoors.png"]
    );
    this.name = "DoorPuzzleBG";
  }

  draw = function () {
    const img = this.animationData.animationSprites[0];
    if (!img.complete) return;

    const screenX = this.x + global.bgScrollX; // world -> screen
    const screenY = this.y;

    global.ctx.drawImage(img, screenX, screenY, this.width, this.height);
  };
}

export { DoorPuzzleBG };
