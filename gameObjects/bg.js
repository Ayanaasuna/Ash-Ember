import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class BG extends BaseGameObject {
  constructor(imagePath) {
    super(0, 0, 0, 0, [imagePath]);
    this.name = "BG";
    };
  

draw = function () {
  const ctx = global.ctx;
  const img = this.animationData.animationSprites[0];

  if (!img || !img.complete) return; // Ensure image is loaded

  const iw = img.naturalWidth;    
  const ch = global.canvas.height;   

  let x = global.bgScrollX;

  // Wrap background so it scrolls infinitely
  while (x > 0) x -= iw;
  while (x < -iw) x += iw;

  // Draw two bgs beside with offset 0.5
  ctx.drawImage(img, x, 0, iw + 0.5, ch);
  ctx.drawImage(img, x + iw, 0, iw + 0.5, ch);
};
}

export { BG };
