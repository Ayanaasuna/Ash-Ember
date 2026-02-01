import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class Fire extends BaseGameObject {
  constructor(ayana, onGameOver) {
    super(0, 0, 993, 400, ["./assets/fire.png"]);

    this.name = "Fire";
    this.isWorldObject = true;

    this.ayana = ayana;
    this.onGameOver = onGameOver;

    this.spriteSheet = this.animationData.animationSprites[0];

    this.frameW = 993;
    this.frameH = 400;
    this.totalFrames = 4;

    this.cropLeft = 0;
    this.cropRight = 0;

    this.meter = 0;

    // charging parameters of progress bar
    this.fillIdle = 0.04;
    this.fillRight = 0.03;
    this.fillLeft = 0.04;

    this.chargeDrainRight = 0.06; // moving away from fire, farther away
    this.chargeDrainIdle = 0.01;

    this.state = "charging"; // "charging" or "active"

    this.fireSpeedBase = this.fireSpeedCatch = 50; // pixels per second speed

    this.fireX = 0; // world X position of fire

    this.frame = 0;
    this.frameTimer = 0;
    this.frameFps = 10;

    // kill box parameters for collision with Ayana
    this.killFront = 100;
    this.killWidth = 200;
    this.killTop = 80;
    this.killHeight = 320;

    this.lastWorldX = this.getAyanaWorldX(); // to track Ayana movement
    this.spawnedOnce = false;

    this.meterDistance = 1400; // distance of the fire from the screen to start filling meter 

    this.meterRiseSpeed = 1.5; 
    this.meterFallSpeed = 0.1; 
  }

  getAyanaWorldX() {
    return this.ayana.x - global.bgScrollX; // convert screen X to world X
  }

  // Get Ayana's bounding box in world coordinates
  getAyanaWorldBox() {
    const ax = this.getAyanaWorldX();
    return {
      left: ax,
      right: ax + this.ayana.width,
      top: this.ayana.y,
      bottom: this.ayana.y + this.ayana.height
    };
  }

  getScreenX() {
    return this.fireX + global.bgScrollX; // convert world X to screen X
  }

  // Check if fire is on screen
  isOnScreen() {
    const left = this.getScreenX();
    const right = left + this.width;
    return right > 0 && left < global.canvas.width;
  }

  // Check if two boxes overlap (Ayana and kill box)
  collisionDetect(a, b) {
    const overlapX = a.left <= b.right && a.right >= b.left;
    const overlapY = a.top <= b.bottom && a.bottom >= b.top;
    return overlapX && overlapY;
  }

  // makes the kill box for the fire
  getKillBox() {
    const right = this.fireX + this.width - this.killFront;
    const left = right - this.killWidth;
    const top = this.y + this.killTop;
    return { left, right, top, bottom: top + this.killHeight };
  }

  // If fire on screen, fill meter full 
  updateMeterFromDistance() {
    if (this.isOnScreen()) {
      this.meter = 1;
      return;
    }

    const frontScreenX = (this.fireX + this.width) + global.bgScrollX;

    let target = (frontScreenX + this.meterDistance) / this.meterDistance;
    target = Math.max(0, Math.min(0.99, target));

    const speed = target > this.meter ? this.meterRiseSpeed : this.meterFallSpeed;
    this.meter += (target - this.meter) * speed * global.deltaTime;
  }

  // When meter is full, activate fire
  activate() {
    this.state = "active";

    this.y = global.canvas.height - this.height;

    const leftScreenX = -this.width + 40; // slightly off screen to left fire spawn
    this.fireX = (leftScreenX - global.bgScrollX);

    this.frame = 0;
    this.frameTimer = 0;

    this.spawnedOnce = true;

    this.updateMeterFromDistance();
  }

  // If fire goes off screen, reset it
  reset() {
    this.state = "charging";
    this.meter = 0;
    this.frame = 0;
    this.frameTimer = 0;
  }

  // Uses Ayana's movement to charge the meter. When active, moves/animates fire and checks collision/reset
  update = function () {
    const ax = this.getAyanaWorldX();
    const dx = ax - this.lastWorldX;
    this.lastWorldX = ax;

    if (this.state === "charging") {
      let delta = this.fillIdle;

      if (dx > 0.5) delta = this.fillRight;
      if (dx < -0.5) delta = this.fillLeft;

      this.meter += delta * global.deltaTime;

      if (dx > 0.5) this.meter -= this.chargeDrainRight * global.deltaTime;
      if (Math.abs(dx) <= 0.5) this.meter -= this.chargeDrainIdle * global.deltaTime;

      if (this.meter < 0) this.meter = 0;
      if (this.meter > 1) this.meter = 1;

      if (this.meter >= 1) this.activate();
      return;
    }

    let dt = global.deltaTime;
    if (dt <= 0) dt = 0.0001;

    const playerSpeed = Math.abs(dx) / dt;

    let bonus = this.fireSpeedCatch - playerSpeed;
    if (bonus < 0) bonus = 0;

    this.fireX += (this.fireSpeedBase + bonus) * global.deltaTime;

    this.frameTimer += global.deltaTime;
    const stepTime = 1 / this.frameFps;

    while (this.frameTimer >= stepTime) {
      this.frameTimer -= stepTime;
      this.frame = (this.frame + 1) % this.totalFrames;
    }

    this.updateMeterFromDistance();

    if (this.collisionDetect(this.getAyanaWorldBox(), this.getKillBox())) {
      if (this.onGameOver) this.onGameOver();
    }

    if (this.spawnedOnce && this.getScreenX() > global.canvas.width + 50) {
      this.reset();
      return;
    }
  };

  //draw fire sprite 
  draw = function () {
    if (this.state !== "active") return;
    if (!this.spriteSheet || !this.spriteSheet.complete || this.spriteSheet.naturalWidth === 0) return;

    const sx = this.getScreenX();
    const srcX = this.frame * this.frameW + this.cropLeft;
    const srcW = this.frameW - this.cropLeft - this.cropRight;

    const dstX = sx + this.cropLeft;
    const dstW = this.width - this.cropLeft - this.cropRight;

    global.ctx.drawImage(
      this.spriteSheet,
      srcX, 0, srcW, this.frameH,
      dstX, this.y, dstW, this.height
    );
  };

  // draw fire meter
  drawFireMeter = function () {
    const ctx = global.ctx;
    const x = 20, y = 20, w = 170, h = 18, r = 9;

    function rr(px, py, pw, ph, pr) {
      ctx.beginPath();
      ctx.moveTo(px + pr, py);
      ctx.lineTo(px + pw - pr, py);
      ctx.quadraticCurveTo(px + pw, py, px + pw, py + pr);
      ctx.lineTo(px + pw, py + ph - pr);
      ctx.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
      ctx.lineTo(px + pr, py + ph);
      ctx.quadraticCurveTo(px, py + ph, px, py + ph - pr);
      ctx.lineTo(px, py + pr);
      ctx.quadraticCurveTo(px, py, px + pr, py);
      ctx.closePath();
    }

    ctx.save();

    rr(x, y, w, h, r);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.stroke();

    const fillW = this.meter * (w - 6);
    rr(x + 3, y + 3, fillW, h - 6, r - 3);
    ctx.fillStyle = "rgba(140,0,0,0.8)";
    ctx.fill();

    ctx.restore();
  };
}

export { Fire };
