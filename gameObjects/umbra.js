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
    this.side = -1; // start left side

     // bubble
    this.bubbleImg = new Image();
    this.bubbleImg.src = "./assets/bubble.png";

    this.sayText = "";
    this.sayTimer = 0;
  }

  // function to make umbra talk
  say(text, seconds = 3) {
    this.sayText = text;
    this.sayTimer = seconds;
  }

  update = function () {
    this.time += global.deltaTime;

    if (this.ayana.xVelocity > 0) this.side = -1; // left side
    if (this.ayana.xVelocity < 0) this.side = 1;  // right side

    const party = Math.sin(this.time * 8) * 20; // weird math that i dont understand but it makes umbra go up and down yay

    const targetX = this.ayana.x + this.side * 70; // side offset
    const targetY = this.ayana.y - 70 + party; // above offset + party

    // delayed flying 
    const delay = 1.5;
    this.x += (targetX - this.x) * delay * global.deltaTime;
    this.y += (targetY - this.y) * delay * global.deltaTime;

    if (this.sayTimer > 0) {
      this.sayTimer -= global.deltaTime;
      if (this.sayTimer <= 0) {
        this.sayText = "";
        this.sayTimer = 0;
      }
    }
  };

draw = function () {
  const ctx = global.ctx;

  const img = this.animationData.animationSprites[this.getNextSpriteIndex()];
  if (!img || !img.complete) return; //stop if image not loaded

  let x = this.x;

  if (this.isWorldObject) {
    x += global.bgScrollX;
  }

  ctx.drawImage(img, x, this.y, this.width, this.height);


  if (!this.sayText) return;
  if (!this.bubbleImg.complete) return;

  // bubble position
  const bx = x + 90;
  const by = this.y - 95;

  ctx.drawImage(this.bubbleImg, bx, by, 220, 90);
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";

  const lines = this.sayText.split("\n");

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], bx + 20, by + 25 + i * 18);
  }

};

}

export { Umbra };