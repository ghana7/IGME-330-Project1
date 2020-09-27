"use strict";
//classes
class LetterBall {
    constructor(letter) {
        this.letter = letter;
        this.position = {};
        this.position.x = jehLIB.getRandomInt(0, canvasWidth);
        this.position.y = jehLIB.getRandomInt(0, canvasHeight);
        this.radius = ballSize;

        this.velocity = jehLIB.mult(jehLIB.getRandomUnitVector(), ballSpeed);
        this.color = jehLIB.getRandomColor();
        this.moving = true;
        this.isEndPiece = false;
        this.word = "";
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = `${this.radius * 1.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.letter, this.position.x, this.position.y);
        ctx.restore();
    }

    update(deltaTime) {
        if (this.moving) {
            this.position.x += this.velocity.x * deltaTime / 1000;
            this.position.y += this.velocity.y * deltaTime / 1000;

            if (this.position.x > canvasWidth - this.radius) {
                this.velocity.x = -this.velocity.x;
                this.position.x = canvasWidth - this.radius;
            }
            if (this.position.x < this.radius) {
                this.velocity.x = -this.velocity.x;
                this.position.x = this.radius;
            }
            if (this.position.y > canvasHeight - this.radius) {
                this.velocity.y = -this.velocity.y;
                this.position.y = canvasHeight - this.radius;
            }
            if (this.position.y < this.radius) {
                this.velocity.y = -this.velocity.y;
                this.position.y = this.radius;
            }
        }
    }

    collidesWith(otherBall) {
        let sqrDist = (otherBall.position.x - this.position.x) * (otherBall.position.x - this.position.x) + (otherBall.position.y - this.position.y) * (otherBall.position.y - this.position.y);
        return sqrDist < (this.radius + otherBall.radius) * (this.radius + otherBall.radius);
    }

    checkCollisions(ballList) {
        if (this.moving) {
            for (let ball of ballList) {
                if (ball != this && this.collidesWith(ball)) {
                    if (!ball.moving) {
                        let possibleNextWord = ball.word + this.letter;
                        if (jehLIB.canMakeWord(possibleNextWord)) {
                            this.moving = false;
                            if (!ball.isEndPiece) {
                                this.color = jehLIB.getRandomColor();
                            } else {
                                this.color = ball.color;

                            }
                            ball.isEndPiece = false;
                            this.isEndPiece = true;
                            this.word = ball.word + this.letter;
                            if (this.word.length >= 3 && RiTa.containsWord(this.word)) {
                                this.word = this.letter;

                                this.color = jehLIB.getRandomColor();
                            }
                            return true;
                        } else {
                            let displacement = jehLIB.normalized(jehLIB.subtract(this.position, ball.position));
                            this.velocity = jehLIB.mult(displacement, ballSpeed);
                        }


                    } else {
                        let displacement = jehLIB.normalized(jehLIB.subtract(this.position, ball.position));
                        this.velocity = jehLIB.mult(displacement, ballSpeed);
                    }
                }
            }
        }
        return false;
    }
}

//config variables
const canvasWidth = 640;
const canvasHeight = 480;
const numStartingLetterBalls = 15;
const fps = 60;

//DOM elements
const canvas = document.querySelector("#foregroundCanvas");
const backgroundCanvas = document.querySelector("#backgroundCanvas");
const ctx = canvas.getContext("2d");
const backgroundCtx = backgroundCanvas.getContext("2d");

const addBallButton = document.querySelector("#addBall");
const resetButton = document.querySelector("#reset");
const scatterButton = document.querySelector("#scatter");
const ballSpeedSlider = document.querySelector("#ballSpeed");
const ballSizeSlider = document.querySelector("#ballSize");
const repopulateBox = document.querySelector("#repopulate");

addBallButton.addEventListener("click", addBall);
resetButton.addEventListener("click", init);
scatterButton.addEventListener("click", scatter);
ballSpeedSlider.addEventListener("change", updateSettings);
 ballSizeSlider.addEventListener("change", updateSettings);
  repopulateBox.addEventListener("change", updateSettings);

//settings
let ballSize;
let ballSpeed;
let repopulate;

//initialization
canvas.width = canvasWidth;
canvas.height = canvasHeight;
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
let letterBalls = [];
let scatterTimer = 0;
let centerBall;


updateSettings();
init();
setInterval(tick, 1000 / fps);

//functions

function updateSettings() {
    ballSize = ballSizeSlider.valueAsNumber;
    ballSpeed = ballSpeedSlider.valueAsNumber;
    repopulate = repopulateBox.checked;
}
function tick() {
    update();
    draw();
}

function init() {
    letterBalls = [];
    scatterTimer = 0;

    centerBall = new LetterBall("");
    letterBalls.push(centerBall);
    centerBall.moving = false;
    centerBall.isEndPiece = true;
    centerBall.position.x = canvasWidth / 2;
    centerBall.position.y = canvasHeight / 2;
    centerBall.radius = 25;

    for (let i = 0; i < numStartingLetterBalls; i++) {
        addBall();
    }

    //draw background elements
    backgroundCtx.fillStyle = "white";
    backgroundCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    backgroundCtx.strokeStyle = "red";
    backgroundCtx.lineWidth = 3;
    backgroundCtx.globalAlpha = 0.2;
    backgroundCtx.beginPath();
    backgroundCtx.moveTo(100, 0);
    backgroundCtx.lineTo(100, canvasHeight);
    backgroundCtx.stroke();

    backgroundCtx.lineWidth = 2;
    backgroundCtx.strokeStyle = "blue";
    for (let i = 0; i < canvasHeight; i += 20) {
        backgroundCtx.beginPath();
        backgroundCtx.moveTo(0, i);
        backgroundCtx.lineTo(canvasWidth, i);
        backgroundCtx.stroke();
    }

    backgroundCtx.globalAlpha = 1;
    backgroundCtx.fillStyle = "#222";
    for (let i = 77; i < canvasHeight; i += 350) {
        backgroundCtx.beginPath();
        backgroundCtx.arc(50, i, 15, 0, 2 * Math.PI);
        backgroundCtx.fill();
    }
}
function update() {
    //i make this check outside of the for loop so that i don't have to make it for every letterball
    if (scatterTimer <= 0) {
        for (let lb of letterBalls) {
            lb.update(1000 / fps);
            if (lb.checkCollisions(letterBalls)) {
                if(repopulate) {
                    addBall(jehLIB.getRandomLetterOf(jehLIB.possibleNextLetters(lb.word)));
                }
            }
        }
    } else {
        scatterTimer -= 1000 / fps;
        for (let lb of letterBalls) {
            lb.update(1000 / fps);
        }
    }
}

function draw() {
    clear();
    for (let lb of letterBalls) {
        lb.draw(ctx);
    }
}

function clear() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.restore();
}

function addBall() {
    letterBalls.push(new LetterBall(jehLIB.getRandomWeightedLetter()));
}

function scatter() {
    scatterTimer = 3000;
    for(let ball of letterBalls) {
        if(ball != centerBall) {
            ball.moving = true;
            ball.isEndPiece = false;
            ball.word = "";
            ball.velocity = jehLIB.mult(jehLIB.getRandomUnitVector(), 200);
        }
    }
}