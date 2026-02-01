import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class DoorPuzzleBG extends BaseGameObject {
  constructor(x) {
    super(
      x,
      0,
      global.canvas.width,
      global.canvas.height,
      [
        "./assets/bgDoors.png",
        "./assets/bgDoors2.png" // right door open
      ]
    );

    this.name = "DoorPuzzleBG";
    this.isWorldObject = true;

    this.rightDoorOpen = false;
    this.setAnimation(0, 0);

    // text positions
    this.textY = 120;
    this.leftDoorX = 190;
    this.middleDoorX = 576;
    this.rightDoorX = 962;
  }

  // function to open right door
  openRightDoor() {
    this.rightDoorOpen = true;
    this.setAnimation(1, 1);
  }

// Draw the current door background image and draw text above doors
draw = function () {
  const ctx = global.ctx;

  const img = this.animationData.animationSprites[this.getNextSpriteIndex()];
  if (!img || !img.complete) return;

  const screenX = this.x + global.bgScrollX;
  ctx.drawImage(img, screenX, this.y, this.width, this.height);

  // draw text
  ctx.font = "bold 25px Georgia";
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = 4;
  ctx.textAlign = "center";

  ctx.fillText("The cursed door", screenX + this.leftDoorX, this.textY);
  ctx.fillText("speaks truth.",   screenX + this.leftDoorX, this.textY + 28);

  ctx.fillText("The true door", screenX + this.middleDoorX, this.textY);
  ctx.fillText("is cursed.",    screenX + this.middleDoorX, this.textY + 28);

  ctx.fillText("The true door",  screenX + this.rightDoorX, this.textY);
  ctx.fillText("is not cursed.", screenX + this.rightDoorX, this.textY + 28);

  ctx.textAlign = "left";
  ctx.shadowBlur = 0;
};
}

export { DoorPuzzleBG };
