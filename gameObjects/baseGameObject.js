import { global } from "../global.js"

class BaseGameObject {
    name = "";
    active = true;
    x = 0;
    y = 0;
    xVelocity = 0;
    yVelocity = 0;
    previousX = 0;
    previousY = 0;
    width = 0;
    height = 0;
    index = -1;

    animationData = {
        animationSprites: [],
        timePerSprite: 0.13,
        currentSpriteElapsedTime: 0,
        currentSpriteIndex: 0,
        firstSpriteIndex: 0,
        lastSpriteIndex: 0
    };

    getBoxBounds = function () {
        let bounds = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
        return bounds;
    }

    reactToCollision = function (collidingObject) {
    }

    update = function () {
    }

    draw = function () {
        let nextSpriteIndex = this.getNextSpriteIndex();
        const img = this.animationData.animationSprites[nextSpriteIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const screenX = this.x + global.bgScrollX;
        global.ctx.drawImage(img, screenX, this.y, this.width, this.height);
}


    getNextSpriteIndex = function () {
        let nextSpriteIndex = this.animationData.currentSpriteIndex;
        
        this.animationData.currentSpriteElapsedTime += global.deltaTime;
        
        if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
            this.animationData.currentSpriteIndex++;
            if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex;
            }
            this.animationData.currentSpriteElapsedTime = 0;
        }

        return nextSpriteIndex;
    }

    loadImages = function (imagePaths) {
        for (let i = 0; i < imagePaths.length; i++) {
            let image = new Image();
            image.src = imagePaths[i];
            this.animationData.animationSprites.push(image);
        }
    }

    setAnimation = function (firstSpriteIndex, lastSpriteIndex) {
        this.animationData.firstSpriteIndex = firstSpriteIndex;
        this.animationData.lastSpriteIndex = lastSpriteIndex;
        this.animationData.currentSpriteIndex = firstSpriteIndex;
    }

    useImagesAsSpritesheet = function (cols, rows) {
        const that = this;
        const totalSprites = cols * rows;
        const allSprites = this.animationData.animationSprites.length * totalSprites;
        const originalSprites = this.animationData.animationSprites.slice();
        this.animationData.animationSprites = Array.from({ length: allSprites }, () => new Image());

        for (var i = 0; i < originalSprites.length; i++){
            let currentImage = originalSprites[i];
            if (currentImage.complete && currentImage.naturalWidth !== 0) {
            // already loaded
                loaded.call(currentImage, totalSprites * i );
            } else {
                currentImage.onload = function () {
                    let spriteIndex = totalSprites * i;
                    return function () {
                        loaded.call(this, spriteIndex);
                    };
                }();
            }
        }
        
        let loaded = function (spriteIndexOffset) {
            const spritesheetWidth = this.width;
            const spritesheetHeight = this.height;
            const singleSpriteWidth = Math.floor(spritesheetWidth / cols);
            const singleSpriteHeight = Math.floor(spritesheetHeight / rows);

            // Create a temporary canvas to extract sprites from the spritesheet
            const tempSpritesheetCanvas = document.createElement("canvas");
            const tempSpritesheetCtx = tempSpritesheetCanvas.getContext("2d");
            tempSpritesheetCanvas.width = singleSpriteWidth;
            tempSpritesheetCanvas.height = singleSpriteHeight;

            // Loop through each sprite's row and column position
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    // Clear the temporary canvas and draw the specific sprite region from the spritesheet
                    tempSpritesheetCtx.clearRect(0, 0, singleSpriteWidth, singleSpriteHeight);
                    tempSpritesheetCtx.drawImage(
                        this,
                        col * singleSpriteWidth,
                        row * singleSpriteHeight,
                        singleSpriteWidth,
                        singleSpriteHeight,
                        0,
                        0,
                        singleSpriteWidth,
                        singleSpriteHeight
                    );

                    // assign it to the corresponding Image object
                    const index = row * cols + col;
                    that.animationData.animationSprites[index + spriteIndexOffset].src = tempSpritesheetCanvas.toDataURL();
                }
            }
        };
    }

    constructor (x, y, width, height, imagePaths) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImages(imagePaths);
        global.allGameObjects.push(this);
        this.index = global.allGameObjects.length - 1;
    }

}

export {BaseGameObject}