import { global } from "../../global.js";

class CandlePuzzle {
  constructor(ayana, candles) {
    this.ayana = ayana;
    this.candles = candles;

    this.toggleDelay = 0.5; // toggles candle after 0.5s collision
    this.nearX = 70; //horizontal distance for collision
    this.nearY = 10; // vertical distance for collision

    this.correctOrder = [0, 2, 3]; //candle array that should be on
    this.solved = false;
  }

  isNear(candle) {
  // Ayana center in world X
  const ayanaX = this.ayana.x - global.bgScrollX + this.ayana.width / 2;
  const ayanaY = this.ayana.y + 80;

  // small interaction box around Ayana
  const boxSize = 14;
  const boxLeft   = ayanaX - boxSize / 2;
  const boxRight  = boxLeft + boxSize;
  const boxTop    = ayanaY;
  const boxBottom = boxTop + boxSize;

  // candle bounds
  const candleLeft   = candle.x;
  const candleRight  = candle.x + candle.width;
  const candleTop    = candle.y;
  const candleBottom = candle.y + candle.height;

  return (
    boxLeft < candleRight &&
    boxRight > candleLeft &&
    boxTop < candleBottom &&
    boxBottom > candleTop
  );
}

  // check if puzzle is solved
  isSolved() {
    for (let i = 0; i < this.candles.length; i++) {
      const shouldBeOn = this.correctOrder.includes(i);
      if (this.candles[i].isOn !== shouldBeOn) return false;
    }
    return true;
  }

  update() {
    if (this.solved) return;

    // check each candle for collision
    for (const candle of this.candles) {
      const near = this.isNear(candle);

      if (!near) {
        candle.collisionTime = 0;
        continue;
      }

      // already toggled when near
      if (candle.collisionTime < 0) continue;

      candle.collisionTime += global.deltaTime;

      if (candle.collisionTime >= this.toggleDelay) {
        candle.isOn = !candle.isOn;
        candle.collisionTime = -1; // prevent further toggling until Ayana moves away 
      }
    }

    if (this.isSolved()) {
      this.solved = true;
    }
  }


  draw() {
    if (!this.candles?.length) return;

    // get all candles to determine center position
    const first = this.candles[0];
    const last = this.candles[this.candles.length - 1];

    const centerWorldX = (first.x + (last.x + last.width)) / 2;
    const screenX = centerWorldX + global.bgScrollX;
    const y = first.y - 220; //text height

    // draw text above candles
    const ctx = global.ctx;
    ctx.font = "bold 25px Georgia";
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.textAlign = "center";
    ctx.fillText("XI", screenX, y);
    ctx.textAlign = "left";
  }
}

export { CandlePuzzle };
