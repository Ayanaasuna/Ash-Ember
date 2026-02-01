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

    this.doorCenterX = doorsBG.x + doorsBG.rightDoorX; // center of right door

    this.triggerW = 90; // trigger width of door

    this.triggerY = 370; // trigger door position vertically
    this.triggerH = 120; // trigger height of door
  }

  update() {
    if (this.solved) return;

    // Ayanas center position in world
    const ax = this.ayana.x - global.bgScrollX;
    const centerX = ax + this.ayana.width / 2;
    const centerY = this.ayana.y + this.ayana.height / 2;

    // door trigger bounds
    const triggerLeft   = this.doorCenterX - this.triggerW / 2;
    const triggerRight  = this.doorCenterX + this.triggerW / 2;
    const triggerTop    = this.triggerY - this.triggerH / 2;
    const triggerBottom = this.triggerY + this.triggerH / 2;

    // check if in trigger
    const inTrigger =
        centerX >= triggerLeft && centerX <= triggerRight &&
        centerY >= triggerTop  && centerY <= triggerBottom;

    const wDown = global.keys["w"] === true;
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

    // if the door is opened, start vanish timer
    this.vanishTimer -= global.deltaTime;
    if (this.vanishTimer <= 0) {
      this.ayana.active = false; // make Ayana vanish
      this.ayana.xVelocity = 0;
      this.ayana.yVelocity = 0;

      if (this.umbra) this.umbra.active = false; // make Umbra vanish

      this.solved = true;

      if (this.onEnter) this.onEnter();
    }
  }
}

export { DoorPuzzle };
