import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../global.js";

class Fire extends BaseGameObject {
  constructor(ayana, onGameOver) {
    super(0, 0, 993, 400, ["./assets/fire.png"]);

    this.name = "Fire";
    this.isWorldObject = true;

    this.ayana = ayana;
    this.onGameOver = onGameOver;

    this.sheet = this.animationData.animationSprites[0];

    this.frameW = 993;
    this.frameH = 400;
    this.totalFrames = 4;

    this.cropLeft = 0;
    this.cropRight = 0;

    this.meter = 0;

    this.fillIdle = 0.04;
    this.fillRight = 0.03;
    this.fillLeft = 0.04;

    this.chargeDrainRight = 0.06;
    this.chargeDrainIdle = 0.01;

    this.state = "CHARGING";

    this.fireSpeedBase = 50;
    this.fireSpeedCatch = 50;

    this.fireX = 0;

    this.frame = 0;
    this.frameTimer = 0;
    this.frameFps = 10;

    this.killInsetFromFront = 100;
    this.killWidth = 200;
    this.killTopInset = 80;
    this.killHeight = 320;

    this.lastWorldX = this.getAyanaWorldX();
    this.spawnedOnce = false;

    this.meterNearDist = 120;
    this.meterFarDist = 1400;

    this.meterRiseSpeed = 1.5;
    this.meterFallSpeed = 0.1;
  }

  getAyanaWorldX() {
    return this.ayana.x - global.bgScrollX;
  }

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
    return this.fireX + global.bgScrollX;
  }

  isOnScreen() {
    const sx = this.getScreenX();
    return (sx < global.canvas.width) && (sx + this.width > 0);
  }

  rectsOverlap(a, b) {
    return (
      a.right >= b.left &&
      a.left <= b.right &&
      a.bottom >= b.top &&
      a.top <= b.bottom
    );
  }

  getKillBox() {
    const frontX = this.fireX + this.width;
    const right = frontX - this.killInsetFromFront;
    const left = right - this.killWidth;
    const top = this.y + this.killTopInset;
    return { left, right, top, bottom: top + this.killHeight };
  }

  updateMeterFromDistance(ax) {
    if (this.isOnScreen()) {
      this.meter = 1;
      return;
    }

    const frontScreenX = (this.fireX + this.width) + global.bgScrollX;

    let target = (frontScreenX + this.meterFarDist) / this.meterFarDist;
    target = Math.max(0, Math.min(0.99, target));

    const speed = target > this.meter ? this.meterRiseSpeed : this.meterFallSpeed;
    this.meter += (target - this.meter) * speed * global.deltaTime;
  }

  activate(ax) {
    this.state = "ACTIVE";

    this.y = global.canvas.height - this.height;

    const leftScreenX = -this.width + 40;
    this.fireX = (leftScreenX - global.bgScrollX);

    this.frame = 0;
    this.frameTimer = 0;

    this.spawnedOnce = true;

    this.updateMeterFromDistance(ax);
  }

  reset() {
    this.state = "CHARGING";
    this.meter = 0;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update = function () {
    const ax = this.getAyanaWorldX();

    const dx = ax - this.lastWorldX;
    this.lastWorldX = ax;

    if (this.state === "CHARGING") {
      let delta = this.fillIdle;
      if (dx > 0.5) delta = this.fillRight;
      if (dx < -0.5) delta = this.fillLeft;

      this.meter += delta * global.deltaTime;

      if (dx > 0.5) this.meter -= this.chargeDrainRight * global.deltaTime;
      if (Math.abs(dx) <= 0.5) this.meter -= this.chargeDrainIdle * global.deltaTime;

      this.meter = Math.max(0, Math.min(1, this.meter));

      if (this.meter >= 1) this.activate(ax);
      return;
    }

    const playerSpeed = Math.abs(dx) / Math.max(global.deltaTime, 0.0001);
    const speed = this.fireSpeedBase + Math.max(0, this.fireSpeedCatch - playerSpeed);
    this.fireX += speed * global.deltaTime;

    this.frameTimer += global.deltaTime;
    const stepTime = 1 / this.frameFps;
    while (this.frameTimer >= stepTime) {
      this.frameTimer -= stepTime;
      this.frame = (this.frame + 1) % this.totalFrames;
    }

    this.updateMeterFromDistance(ax);

    const ayBox = this.getAyanaWorldBox();
    const killBox = this.getKillBox();
    if (this.rectsOverlap(ayBox, killBox)) {
      if (this.onGameOver) this.onGameOver();
    }

    const sx = this.getScreenX();
    if (this.spawnedOnce && sx > global.canvas.width + 50) {
      this.reset();
      return;
    }
  };

  draw = function () {
    if (this.state !== "ACTIVE") return;
    if (!this.sheet || !this.sheet.complete || this.sheet.naturalWidth === 0) return;

    const sx = this.getScreenX();
    const srcX = this.frame * this.frameW;

    const srcCropX = srcX + this.cropLeft;
    const srcCropW = this.frameW - this.cropLeft - this.cropRight;

    const dstX = sx + this.cropLeft;
    const dstW = this.width - this.cropLeft - this.cropRight;

    global.ctx.drawImage(
      this.sheet,
      srcCropX, 0, srcCropW, this.frameH,
      dstX, this.y, dstW, this.height
    );
  };

  drawHUD = function () {
    const ctx = global.ctx;

    const x = 20, y = 20, w = 170, h = 18;
    const r = 9;

    function roundRectPath(px, py, pw, ph, pr) {
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

    roundRectPath(x, y, w, h, r);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.stroke();

    const fillW = Math.max(0, Math.min(1, this.meter)) * (w - 6);
    roundRectPath(x + 3, y + 3, fillW, h - 6, r - 3);
    ctx.fillStyle = "rgba(140, 0, 0, 0.8)";
    ctx.fill();

    ctx.restore();
  };
}

export { Fire };
