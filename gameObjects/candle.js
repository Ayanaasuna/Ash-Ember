import { BaseGameObject } from "./baseGameObject.js";

class Candle extends BaseGameObject {
  constructor(x, y, value) {
    super(x, y, 19, 48, ["./assets/candleOff.png", "./assets/candleOn.png"]);
    this.name = "Candle";
    this.value = value;
    this.isOn = false;
    this.isWorldObject = true;
    this.collisionTime = 0;
    this.setAnimation(0, 0);
  }

  update = function () {
    if (this.isOn) this.setAnimation(1, 1);
    else this.setAnimation(0, 0);
  }
}

export { Candle };
