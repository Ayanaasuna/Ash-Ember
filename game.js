import { global } from "./global.js";
import { BG } from "./gameObjects/bg.js";
import { Ayana } from "./gameObjects/ayana.js";
import { Umbra } from "./gameObjects/umbra.js";
import { Candle } from "./gameObjects/candle.js";
import { DoorPuzzleBG } from "./gameObjects/bgDoors.js";

let ayana;
let umbra;
let candles = [];

function gameLoop(totalTime) {
  global.deltaTime = (totalTime - global.previousTotalTime) / 1000;
  global.previousTotalTime = totalTime;

  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);

  for (let i = 0; i < global.allGameObjects.length; i++) {
    const obj = global.allGameObjects[i];
    if (!obj.active) continue;
    obj.update();
    obj.draw();
  }

  const leftEdge  = 200;
  const rightEdge = global.canvas.width - 200 - ayana.width;
  const topEdge = 300;
  const bottomEdge = global.canvas.height - 20 - ayana.height;

  if (ayana.x > rightEdge) {
    const dx = ayana.x - rightEdge;
    ayana.x = rightEdge;
    global.bgScrollX -= dx;
  }

  if (ayana.x < leftEdge) {
    const dx = ayana.x - leftEdge;
    ayana.x = leftEdge;
    global.bgScrollX -= dx;
  }

  if (ayana.y > bottomEdge) ayana.y = bottomEdge;
  if (ayana.y < topEdge) ayana.y = topEdge;

  requestAnimationFrame(gameLoop);
}

function setVelocity(e) {
  switch (e.key) {
    case "d":
      if (ayana.xVelocity !== 300) ayana.faceRight();
      ayana.xVelocity = 300;
      ayana.yVelocity = 0;
      break;
    case "a":
      if (ayana.xVelocity !== -300) ayana.faceLeft();
      ayana.xVelocity = -300;
      ayana.yVelocity = 0;
      break;
    case "w":
      if (ayana.yVelocity !== -300) ayana.faceBack();
      ayana.xVelocity = 0;
      ayana.yVelocity = -300;
      break;
    case "s":
      if (ayana.yVelocity !== 300) ayana.faceFront();
      ayana.xVelocity = 0;
      ayana.yVelocity = 300;
      break;
  }
}

function clearVelocity(e) {
  if (["a","w","s","d"].includes(e.key)) {
    ayana.xVelocity = 0;
    ayana.yVelocity = 0;
  }
}

function intializeGame() {
  global.bgScrollX = 0;

  new BG("./assets/bg.png");
  new DoorPuzzleBG(3640);

    candles = [
    new Candle(2190, 370, 8),
    new Candle(2260, 370, 4),
    new Candle(2330, 370, 2),
    new Candle(2400, 370, 1),
  ];

  ayana = new Ayana(300, 350);
  umbra = new Umbra(ayana);



}

intializeGame();
requestAnimationFrame(gameLoop);

document.addEventListener("keydown", setVelocity);
document.addEventListener("keyup", clearVelocity);
