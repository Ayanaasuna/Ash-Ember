import { global } from "../../global.js";

class CandlePuzzle {
  constructor(ayana, candles) {
    this.ayana = ayana;
    this.candles = candles;

    this.toggleDelay = 0.5;
    this.nearX = 70;
    this.nearY = 10;

    this.correctOrder = [0, 2, 3];
    this.solved = false;
  }

  isNear(c) {
    const ax = this.ayana.x - global.bgScrollX;

    const tw = 14, th = 14;
    const tx = ax + this.ayana.width * 0.5 - tw / 2;
    const ty = this.ayana.y + 80;

    const cx = c.x, cy = c.y, cw = c.width, ch = c.height;

    return (tx < cx + cw && tx + tw > cx && ty < cy + ch && ty + th > cy);
  }

  isSolved() {
    for (let i = 0; i < this.candles.length; i++) {
      const shouldBeOn = this.correctOrder.includes(i);
      if (this.candles[i].isOn !== shouldBeOn) return false;
    }
    return true;
  }

  update() {
    if (this.solved) return;

    for (const c of this.candles) {
      if (this.isNear(c)) {
        if (c.collisionTime >= 0) c.collisionTime += global.deltaTime;

        if (c.collisionTime >= this.toggleDelay) {
          c.isOn = !c.isOn;
          c.collisionTime = -1;
        }
      } else {
        c.collisionTime = 0;
      }
    }

    if (this.isSolved()) {
      this.solved = true;
      console.log("SOLVED!");
    }
  }

  draw() {
    if (!this.candles || this.candles.length === 0) return;

    const left = this.candles[0].x;
    const right = this.candles[this.candles.length - 1].x + this.candles[this.candles.length - 1].width;
    const centerWorldX = (left + right) / 2;

    const topY = this.candles[0].y - 220;

    const screenX = centerWorldX + global.bgScrollX;

    global.ctx.font = "bold 25px Georgia";
    global.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    global.ctx.textAlign = "center";
    global.ctx.fillText("XI", screenX, topY);

    global.ctx.textAlign = "left";
  }
}

export { CandlePuzzle };
