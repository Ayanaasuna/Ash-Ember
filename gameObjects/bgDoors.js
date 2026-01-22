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
        "./assets/bgDoors2.png" // use later when door opens
      ]
    );

    this.name = "DoorPuzzleBG";
    this.isWorldObject = true;

    this.rightDoorOpen = false;
    this.setAnimation(0, 0);

    // text positions (adjust if needed)
    this.textY = 120;
    this.leftDoorX = 190;
    this.middleDoorX = 576;
    this.rightDoorX = 962;
  }

openRightDoor() {
  this.rightDoorOpen = true;
  this.setAnimation(1, 1);
}


draw = function () {
  let img = this.animationData.animationSprites[this.getNextSpriteIndex()];

  if (!img || !img.complete || img.naturalWidth === 0) {
    img = this.animationData.animationSprites[0];
  }
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const screenX = this.x + global.bgScrollX;
  global.ctx.drawImage(img, screenX, this.y, this.width, this.height);

  global.ctx.font = "bold 25px Georgia";
  global.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  global.ctx.shadowBlur = 4;
  global.ctx.textAlign = "center";

  global.ctx.fillText("The cursed door", screenX + this.leftDoorX, this.textY);
  global.ctx.fillText("speaks truth.",   screenX + this.leftDoorX, this.textY + 28);

  global.ctx.fillText("The true door", screenX + this.middleDoorX, this.textY);
  global.ctx.fillText("is cursed.",    screenX + this.middleDoorX, this.textY + 28);

  global.ctx.fillText("The true door",  screenX + this.rightDoorX, this.textY);
  global.ctx.fillText("is not cursed.", screenX + this.rightDoorX, this.textY + 28);

  global.ctx.textAlign = "left";
  global.ctx.shadowBlur = 0;
};
}

export { DoorPuzzleBG };
