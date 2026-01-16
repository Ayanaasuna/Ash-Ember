import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class BG extends BaseGameObject {
  constructor(imagePath) {
    super(0, 0, 0, 0, [imagePath]); // width/height not needed for a pattern
    this.name = "BG";
    this.pattern = null;

    // when image loads, build the repeating pattern once
    const img = this.animationData.animationSprites[0];
    img.onload = () => {
      this.pattern = global.ctx.createPattern(img, "repeat");
    };
  }

  update = function () {}

  draw = function () {
    if (!this.pattern) return;

    const ctx = global.ctx;
    const cw = global.canvas.width;
    const ch = global.canvas.height;

    // scroll offset (negative = move background left)
    const img = this.animationData.animationSprites[0];
    const iw = img.naturalWidth;

    // keep it bounded so numbers don't grow forever
    const ox = ((global.bgScrollX % iw) + iw) % iw;

    ctx.save();
    ctx.translate(-ox, 0);
    ctx.fillStyle = this.pattern;

    // draw a bit wider so translation never shows empty pixels
    ctx.fillRect(0, 0, cw + iw, ch);

    ctx.restore();
  }
}

export { BG };
