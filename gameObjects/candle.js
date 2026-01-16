import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class Candle extends BaseGameObject {
  constructor(x, y, value) {
    super(x, y, 19, 48, ["../assets/candleOff.png", "../assets/candleOn.png"]);
    this.name = "Candle";
    this.value = value;
    this.isOn = false;
  }

  draw = function () {
    const img = this.animationData.animationSprites[this.isOn ? 1 : 0];
    if (!img.complete) return;

    const screenX = this.x + global.bgScrollX;  // world -> screen
    const screenY = this.y;

    global.ctx.drawImage(img, screenX, screenY, this.width, this.height);
  };
}

export { Candle };
