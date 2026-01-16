import { BaseGameObject } from "./baseGameObject.js";
import { global } from "./global.js";

class Umbra extends BaseGameObject {
  constructor(ayana) {
    super(0, 0, 180, 53, ["./assets/umbra.png"]);

    this.name = "Umbra";
    this.ayana = ayana;

    this.useImagesAsSpritesheet(4, 1);
    this.setAnimation(0, 3);
    this.animationData.timePerSprite = 0.08;

    this.time = 0;
    this.side = -1; // start on right side of Ayana
  }

    update = function () {
    this.time += global.deltaTime;

    // switch side based on Ayana movement
    if (this.ayana.xVelocity > 0) this.side = -1;
    if (this.ayana.xVelocity < 0) this.side = 1;

    // weird math i dont understand but it makes umbra move up and down yay
    const party = Math.sin(this.time * 8) * 20;

    // umbra above Ayana
    const targetX = this.ayana.x + this.side * 70;
    const targetY = this.ayana.y - 70 + party;

    // delayed follow
    const delay = 1.5;
    this.x += (targetX - this.x) * delay * global.deltaTime;
    this.y += (targetY - this.y) * delay * global.deltaTime;
  };
}

export { Umbra };
