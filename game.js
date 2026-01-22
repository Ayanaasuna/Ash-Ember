import { global } from "./global.js";
import { BG } from "./gameObjects/bg.js";
import { Ayana } from "./gameObjects/ayana.js";
import { Umbra } from "./gameObjects/umbra.js";
import { Candle } from "./gameObjects/candle.js";
import { DoorPuzzleBG } from "./gameObjects/bgDoors.js";
import { CandlePuzzle } from "./gameObjects/puzzles/candlePuzzle.js";
import { Gate } from "./gameObjects/gate.js";
import { Fire } from "./gameObjects/fire.js";
import { DoorPuzzle } from "./gameObjects/puzzles/doorPuzzle.js";

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const endScreen = document.getElementById("endScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

function hide(el) { el.classList.add("hidden"); }
function show(el) { el.classList.remove("hidden"); }

let ayana;
let umbra;
let candles = [];
let playingCutscene = false;
let text1 = false;
let textCandles = false;
let text2 = false;
let textDoor = false;
let doorsBG;
let doorPuzzle;
let candlePuzzle;
let gate1;
let gate2;
let fire;

let showNarration = false;
let narrationTimer = 0;
let narrationDuration = 0;
let narrationLines = [];
let narrationOnDone = null;

let gameOver = false;
let gameStarted = false;

function triggerGameOver() {
  if (!gameStarted) return;
  if (gameOver) return;
  gameOver = true;
  show(gameOverScreen);
}

let playingEnd = false;
let endChoice = null;

const endA = new Image();
endA.src = "./assets/ending_cutscene.png";

const endB = new Image();
endB.src = "./assets/ending_cutscene2.png";

let endFrame = 0;
let endTimer = 0;

const endLoopFrom = 5;
const endLoopTo = 29;

const endHoldFrame = 30;
const endBubbleFrom = 5;
const endBubbleTo = 30;

const endBranchFrame = 31;

const endFrameTime = 1 / 6;

function startEnding() {
  startNarration(
    [
      "The fire was never the enemy.",
      "It was the question."
    ],
    8,
    () => {
      playingEnd = true;
      endChoice = null;
      endFrame = 0;
      endTimer = 0;

      if (fire) fire.active = false;

      if (ayana) {
        ayana.active = false;
        ayana.xVelocity = 0;
        ayana.yVelocity = 0;
      }
      if (umbra) umbra.active = false;
    }
  );
}

function endEnding() {
  playingEnd = false;
  music.pause();

  const lines =
    (endChoice === "FIRE") ? endingTextFire :
    (endChoice === "SLEEP") ? endingTextSleep :
    null;

  if (lines) {
    startNarration(lines, 8, () => show(endScreen));
    return;
  }

  show(endScreen);
}

function drawNarration(lines, yOffset = 0) {
  global.ctx.fillStyle = "black";
  global.ctx.fillRect(0, 0, global.canvas.width, global.canvas.height);

  global.ctx.fillStyle = "rgba(255,255,255,0.9)";
  global.ctx.font = "20px Georgia";
  global.ctx.textAlign = "center";

  const startY = global.canvas.height / 2 + yOffset;

  for (let i = 0; i < lines.length; i++) {
    global.ctx.fillText(
      lines[i],
      global.canvas.width / 2,
      startY + i * 26
    );
  }

  global.ctx.textAlign = "left";
}

function startNarration(lines, time, onDone = null) {
  showNarration = true;
  narrationLines = lines;
  narrationDuration = time;
  narrationTimer = 0;
  narrationOnDone = onDone;
}

const cutNarrations = [
  {
    frame: 30,
    time: 6,
    lines: [
      "Ayana, keeper of forgotten graves,",
      "again she begins the old ritual.",
      "The flame slips its bounds",
      "and from it, her shadow is born."
    ]
  },
  {
    frame: 45,
    time: 5,
    lines: [
      "She flees into the forest,",
      "where freedom has no shape.",
      "The fire keeps the pace."
    ]
  },
  {
    frame: 70,
    time: 5,
    lines: [
      "Even stone and order cannot stop it.",
      "The fire remembers her."
    ]
  }
];

const endingTextFire = [
  "The flame accepts your offering.",
  "It changes you as it grows.",
  "What remains is light and ash."
];

const endingTextSleep = [
  "You let the fire rest.",
  "Umbra thins with the last ember,",
  "and the chaos falls silent in the dark."
];

const music = new Audio("./assets/organ.mp3");
music.loop = true;
music.volume = 0.1;

startBtn.addEventListener("click", () => {
  hide(startScreen);
  gameStarted = true;
  global.previousTotalTime = performance.now();
  playingCutscene = true;
  cutFrame = 0;
  cutTimer = 0;
});

restartBtn.addEventListener("click", () => { music.pause(); window.location.reload(); });
playAgainBtn.addEventListener("click", () => { music.pause(); window.location.reload(); });

const cutImg = new Image();
cutImg.src = "./assets/cutScene.png";

let cutFrame = 0;
let cutTimer = 0;

const cutFrames = 71;
const cutFrameTime = 1 / 5;
const frameW = 1152;
const frameH = 640;

function endCutscene() {
  playingCutscene = false;
  cutFrame = 0;
  cutTimer = 0;
  music.play();
}

function gameLoop(totalTime) {
  global.deltaTime = (totalTime - global.previousTotalTime) / 1000;
  global.previousTotalTime = totalTime;

  if (!gameStarted) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (showNarration) {
    narrationTimer += global.deltaTime;
    drawNarration(narrationLines);

    if (narrationTimer >= narrationDuration) {
      showNarration = false;
      const cb = narrationOnDone;
      narrationOnDone = null;
      if (cb) cb();
    }

    requestAnimationFrame(gameLoop);
    return;
  }

  if (playingCutscene) {
    if (!cutImg.complete || cutImg.naturalWidth === 0) {
      requestAnimationFrame(gameLoop);
      return;
    }

    cutTimer += global.deltaTime;
    if (cutTimer >= cutFrameTime) {
      cutTimer = 0;
      cutFrame++;

      for (const n of cutNarrations) {
        if (cutFrame === n.frame) {
          startNarration(n.lines, n.time);
          break;
        }
      }

      if (cutFrame >= cutFrames) {
        endCutscene();
      }
    }

    const sx = cutFrame * frameW;
    global.ctx.drawImage(
      cutImg,
      sx, 0, frameW, frameH,
      0, 0, frameW, frameH
    );

    global.ctx.font = "16px Arial";
    global.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    global.ctx.textAlign = "right";
    global.ctx.fillText(
      "Press SPACE to skip",
      global.canvas.width - 20,
      global.canvas.height - 20
    );

    requestAnimationFrame(gameLoop);
    return;
  }

  if (playingEnd) {
    global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);
    global.ctx.fillStyle = "black";
    global.ctx.fillRect(0, 0, global.canvas.width, global.canvas.height);

    if (!endA.complete || endA.naturalWidth === 0) {
      requestAnimationFrame(gameLoop);
      return;
    }

    endTimer += global.deltaTime;
    if (endTimer >= endFrameTime) {
      endTimer = 0;

      if (endChoice === null) {
        if (endFrame < endLoopFrom) endFrame++;
        else if (endFrame < endLoopTo) endFrame++;
        else endFrame = endLoopFrom;
      } else {
        endFrame++;
      }
    }

    const framesA = Math.max(1, Math.floor(endA.naturalWidth / frameW));
    const framesB = (endB.complete && endB.naturalWidth > 0) ? Math.max(1, Math.floor(endB.naturalWidth / frameW)) : 0;

    let img = endA;
    let maxFrames = framesA;

    if (endChoice === "SLEEP" && endFrame >= endBranchFrame && framesB > 0) {
      img = endB;
      maxFrames = framesB;
    }

    if (endFrame >= maxFrames) {
      endEnding();
      requestAnimationFrame(gameLoop);
      return;
    }

    const sx = endFrame * frameW;
    global.ctx.drawImage(img, sx, 0, frameW, frameH, 0, 0, frameW, frameH);

    if (endFrame >= endBubbleFrom && endFrame <= endBubbleTo) {
      global.ctx.fillStyle = "black";
      global.ctx.font = "16px Arial";
      global.ctx.textAlign = "left";
      global.ctx.fillText("Will you keep the fire", global.canvas.width / 2 + 140, 240);
      global.ctx.fillText("alive or let it rest?", global.canvas.width / 2 + 140, 260);
    }

    if (endChoice === null) {
      global.ctx.font = "bold 25px Georgia";
      global.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      global.ctx.textAlign = "center";
      global.ctx.fillText(
        "1: Feed the flame   |   2: Let it fade",
        global.canvas.width / 2,
        global.canvas.height - 24
      );
      global.ctx.textAlign = "left";
    }

    requestAnimationFrame(gameLoop);
    return;
  }

  if (gameOver) {
    return;
  }

  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);

  if (candlePuzzle) candlePuzzle.update();
  if (doorPuzzle) doorPuzzle.update();

  if (candlePuzzle && candlePuzzle.solved && gate1 && !gate1.isOpen) {
    gate1.open();
  }

  for (let i = 0; i < global.allGameObjects.length; i++) {
    const obj = global.allGameObjects[i];
    if (!obj.active) continue;
    obj.update();
    obj.draw();
  }

  const leftEdge  = 250;
  const rightEdge = global.canvas.width - 250 - ayana.width;
  const topEdge = 300;
  const bottomEdge = global.canvas.height - 20 - ayana.height;
  const ayanaWorldX = ayana.x - global.bgScrollX;

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



  if (!text1 && ayanaWorldX > 600) {
    umbra.say("Do you follow order,\nor hide inside it?", 2);
    text1 = true;
}

  if (!textCandles && ayanaWorldX > 2300) {
    umbra.say("Candles speak in binary.", 2);
    textCandles = true;
  }

  if (!text2 && ayanaWorldX > 3300) {
    umbra.say("Truth isn’t hidden.\nIt’s filtered.", 2);
    text2 = true;
  }

  if (!textDoor && ayanaWorldX > 5300) {
    umbra.say("Confusion is easier\nthan thinking.", 2);
    textDoor = true;
  }

  const ax = ayanaWorldX;

  function blockGate(g) {
    if (!g || !g.active) return;
    if (g.isOpen) return;
    if (ax + ayana.width > g.x) {
      ayana.x = g.x - ayana.width + global.bgScrollX;
    }
  }

  blockGate(gate1);
  blockGate(gate2);

  if (fire) fire.drawHUD();
  if (candlePuzzle) candlePuzzle.draw();

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

document.addEventListener("keydown", (e) => {
  if (!playingCutscene) return;
  if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
    endCutscene();
  }
});

document.addEventListener("keydown", (e) => {
  global.keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  global.keys[e.key.toLowerCase()] = false;
});

document.addEventListener("keydown", (e) => {
  if (!playingEnd) return;
  if (endChoice !== null) return;

  if (e.key === "1") endChoice = "FIRE";
  if (e.key === "2") endChoice = "SLEEP";

  if (endChoice !== null && endFrame < endHoldFrame) {
    endFrame = endHoldFrame;
    endTimer = 0;
  }
});

function clearVelocity(e) {
  if (["a","w","s","d"].includes(e.key)) {
    ayana.xVelocity = 0;
    ayana.yVelocity = 0;
  }
}

function intializeGame() {
  global.bgScrollX = 0;

  new BG("./assets/bg.png");

  doorsBG = new DoorPuzzleBG(4400);

  candles = [
    new Candle(2190, 370, 8),
    new Candle(2260, 370, 4),
    new Candle(2330, 370, 2),
    new Candle(2400, 370, 1),
  ];

  ayana = new Ayana(300, 350);
  umbra = new Umbra(ayana);

  doorPuzzle = new DoorPuzzle(ayana, umbra, doorsBG, startEnding);
  candlePuzzle = new CandlePuzzle(ayana, candles);

  gate1 = new Gate(2600, 0);
  gate2 = new Gate(5700, 0, 44, 640, false);

  fire = new Fire(ayana, triggerGameOver);
}

intializeGame();
requestAnimationFrame(gameLoop);

document.addEventListener("keydown", setVelocity);
document.addEventListener("keyup", clearVelocity);
