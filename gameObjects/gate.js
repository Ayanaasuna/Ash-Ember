import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class Gate extends BaseGameObject {
  constructor(worldX, y, w = 44, h = 640, canOpen = true) {
    super(worldX, y, w, h, ["./assets/gate.png"]);
    this.name = "Gate";
    this.isWorldObject = true;

    this.canOpen = canOpen;
    this.isOpen = false;
    this.openSpeed = 1000;
  }

  open() {
    if (!this.canOpen) return; // permanent gate ignores open()
    this.isOpen = true;
  }

  update = function () {
    if (!this.isOpen) return;

    this.y -= this.openSpeed * global.deltaTime;

    if (this.y + this.height < 0) {
      this.active = false; // disappears only for opening gates
    }
  }
}

export { Gate };
