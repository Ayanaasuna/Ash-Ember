import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

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

     // bubble
    this.bubbleImg = new Image();
    this.bubbleImg.src = "./assets/bubble.png";

    this.sayText = "";
    this.sayTimer = 0;
  }

  // call this to make Umbra talk
  say(text, seconds = 3) {
    this.sayText = text;
    this.sayTimer = seconds;
  }

  update = function () {
    this.time += global.deltaTime;

    if (this.ayana.xVelocity > 0) this.side = -1;
    if (this.ayana.xVelocity < 0) this.side = 1;

    const party = Math.sin(this.time * 8) * 20;

    const targetX = this.ayana.x + this.side * 70;
    const targetY = this.ayana.y - 70 + party;

    const delay = 1.5;
    this.x += (targetX - this.x) * delay * global.deltaTime;
    this.y += (targetY - this.y) * delay * global.deltaTime;

    if (this.sayTimer > 0) {
      this.sayTimer -= global.deltaTime;
      if (this.sayTimer <= 0) {
        this.sayTimer = 0;
        this.sayText = "";
      }
    }
  };

draw = function () {
  const img = this.animationData.animationSprites[this.getNextSpriteIndex()];
  if (!img || !img.complete || !this.bubbleImg.complete) return;

  const x = this.isWorldObject ? this.x + global.bgScrollX : this.x;
  global.ctx.drawImage(img, x, this.y, this.width, this.height);

  if (!this.sayText) return;

  const bx = x + 90;
  const by = this.y - 95;

  global.ctx.drawImage(this.bubbleImg, bx, by, 220, 90);
  global.ctx.fillStyle = "black";
  global.ctx.font = "16px Arial";

  const lines = Array.isArray(this.sayText)
    ? this.sayText
    : String(this.sayText).split("\n");

  for (let i = 0; i < lines.length; i++) {
    global.ctx.fillText(lines[i], bx + 20, by + 25 + i * 18);
  }

};


}

export { Umbra };