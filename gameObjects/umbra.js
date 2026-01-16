import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class Umbra extends BaseGameObject {
  constructor(ayana) {
    // IMPORTANT: set width/height to ONE FRAME size of your umbra spritesheet
    // Example: if your spritesheet is 256x64 with 4 frames -> frame is 64x64
    super(0, 0, 180, 53, ["./assets/umbra.png"]);

    this.name = "Umbra";
    this.ayana = ayana;

    // spritesheet: change these to match your sheet
    this.useImagesAsSpritesheet(4, 1);
    this.setAnimation(0, 3);
    this.animationData.timePerSprite = 0.08;

    // floating motion
    this.time = 0;

    // where to sit relative to Ayana
    this.sideDistance = 50;   // left/right offset
    this.heightOffset = -60;  // above Ayana
    this.flutterAmp = 20;     // how much it bobs up/down
    this.flutterSpeed = 8;    // how fast it bobs
  }

  update = function () {
    this.time += global.deltaTime;

    // decide side based on Ayana's horizontal velocity (last direction)
    // if she's moving right -> Umbra on left, moving left -> Umbra on right
    const goingRight = this.ayana.xVelocity > 0;
    const goingLeft  = this.ayana.xVelocity < 0;

    // keep last side when standing still
    if (goingRight) this._side = -1;
    if (goingLeft)  this._side = 1;
    if (this._side === undefined) this._side = -1; // default (left)

    const flutterY = Math.sin(this.time * this.flutterSpeed) * this.flutterAmp;

    // target position
    const targetX = this.ayana.x + this.ayana.width / 2 + (this._side * this.sideDistance) - this.width / 2;
    const targetY = this.ayana.y + this.heightOffset + flutterY;

    // smooth follow (so it feels alive, not glued)
    const followStrength = 1.5; // bigger = snappier
    this.x += (targetX - this.x) * followStrength * global.deltaTime;
    this.y += (targetY - this.y) * followStrength * global.deltaTime;
  };
}

export { Umbra };
