import { global } from "../../global.js";

class DoorPuzzle {
  constructor(ayana, umbra, doorsBG, onEnter) {
    this.ayana = ayana;
    this.umbra = umbra;
    this.doorsBG = doorsBG;
    this.onEnter = onEnter;

    this.solved = false;
    this.doorOpened = false;
    this.vanishTimer = 0;
    this.wWasDown = false;

    this.doorCenterX = doorsBG.x + doorsBG.rightDoorX;

    this.triggerW = 90;

    this.triggerY = 370;
    this.triggerH = 120;
  }

  update() {
    if (this.solved) return;

    const ax = this.ayana.x - global.bgScrollX;

    const centerX = ax + this.ayana.width * 0.5;
    const centerY = this.ayana.y + this.ayana.height * 0.5;

    const left = this.doorCenterX - this.triggerW * 0.5;
    const right = this.doorCenterX + this.triggerW * 0.5;

    const top = this.triggerY - this.triggerH * 0.5;
    const bottom = this.triggerY + this.triggerH * 0.5;

    const inTrigger = (centerX >= left && centerX <= right && centerY >= top && centerY <= bottom);

    const wDown = !!global.keys["w"];
    if (!wDown) this.wWasDown = false;

    if (!this.doorOpened) {
      if (inTrigger && wDown && !this.wWasDown) {
        this.wWasDown = true;

        this.ayana.xVelocity = 0;
        this.ayana.yVelocity = 0;

        this.doorsBG.openRightDoor();
        this.doorOpened = true;
        this.vanishTimer = 0.3;
      }
      return;
    }

    this.vanishTimer -= global.deltaTime;
    if (this.vanishTimer <= 0) {
      this.ayana.active = false;
      this.ayana.xVelocity = 0;
      this.ayana.yVelocity = 0;

      if (this.umbra) this.umbra.active = false;

      this.solved = true;

      if (this.onEnter) this.onEnter();
    }
  }
}

export { DoorPuzzle };
