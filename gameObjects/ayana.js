import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class Ayana extends BaseGameObject {
  constructor(x, y) {
    super(x, y, 110, 215, [
      "./assets/ayanaR.png",
      "./assets/ayanaL.png",
      "./assets/ayanabackW.png",
      "./assets/ayanafrontW.png"
    ]);

    this.name = "Ayana";

    this.idleImage = new Image();
    this.idleImage.src = "./assets/ayana.png";

    this.useImagesAsSpritesheet(4, 1);

    this.setAnimation(0, 3);
  }

  update = function () {
    // movement logic
    this.x += this.xVelocity * global.deltaTime;
    this.y += this.yVelocity * global.deltaTime;
  };

  faceRight = function () {
    this.setAnimation(0, 3);
  };

  faceLeft = function () {
    this.setAnimation(4, 7);
  };

  faceBack = function () {
    this.setAnimation(8, 11);
  };

  faceFront = function () {
    this.setAnimation(12, 15);
  };

  draw = function () {
    // idle logic
    if (this.xVelocity === 0 && this.yVelocity === 0) {
      global.ctx.drawImage(this.idleImage, this.x, this.y, this.width, this.height);
      return;
    }

    // walking logic
    const nextSpriteIndex = this.getNextSpriteIndex();
    global.ctx.drawImage(
      this.animationData.animationSprites[nextSpriteIndex],
      this.x,
      this.y,
      this.width,
      this.height
    );
  };
}

export { Ayana };
