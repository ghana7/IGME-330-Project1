//classes
class LetterBall {
    constructor(letter) {
        this.letter = letter;
        this.x = jehLIB.getRandomInt(0, canvasWidth);
        this.y = jehLIB.getRandomInt(0, canvasHeight);
        this.radius = 10;
        let vel = jehLIB.getRandomUnitVector()
        this.velocity = jehLIB.mult(jehLIB.getRandomUnitVector(), 200);
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
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = `${this.radius * 1.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.letter, this.x, this.y);
        ctx.restore();
    }

    update(deltaTime) {
        if (this.moving) {
            this.x += this.velocity.x * deltaTime / 1000;
            this.y += this.velocity.y * deltaTime / 1000;

            if (this.x > canvasWidth - this.radius) {
                this.velocity.x = -this.velocity.x;
                this.x = canvasWidth - this.radius;
            } 
            if(this.x < this.radius) {
                this.velocity.x = -this.velocity.x;
                this.x = this.radius;
            }
            if (this.y > canvasHeight - this.radius){
                this.velocity.y = -this.velocity.y;
                this.y = canvasHeight - this.radius;
            }
            if(this.y < this.radius) {
                this.velocity.y = -this.velocity.y;
                this.y = this.radius;
            }
        }
    }

    collidesWith(otherBall) {
        let sqrDist = (otherBall.x - this.x) * (otherBall.x - this.x) + (otherBall.y - this.y) * (otherBall.y - this.y);
        return sqrDist < (this.radius + otherBall.radius) * (this.radius + otherBall.radius);
    }

    checkCollisions(ballList) {
        if(this.moving){
            for (let ball of ballList) {
                if (ball.isEndPiece && this.collidesWith(ball)) {
                    this.moving = false;
                    this.color = ball.color;
                    ball.isEndPiece = false;
                    this.isEndPiece = true;
                    this.word = ball.word + this.letter;
                    return true;
                }
            }
        }
        return false;
    }
}

//config variables
const canvasWidth = 640;
const canvasHeight = 480;
const letterBalls = [];
const centerBall = new LetterBall(" ");
letterBalls.push(centerBall);
const numStartingLetterBalls = 10;
const fps = 60;

//DOM elements
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const addBallButton = document.querySelector("#addBall");

addBallButton.addEventListener("click", addBall);

//initialization
canvas.width = canvasWidth;
canvas.height = canvasHeight;
for (let i = 0; i < numStartingLetterBalls; i++) {
    addBall();
}

centerBall.moving = false;
centerBall.isEndPiece = true;
centerBall.x = canvasWidth / 2;
centerBall.y = canvasHeight / 2;
setInterval(tick, 1000 / fps);

//functions
function tick() {
    update();
    draw();
}

function update() {
    for (let lb of letterBalls) {
        lb.update(1000 / fps);
        if(lb.checkCollisions(letterBalls)) {
            addBall();
        }
    }
}

function draw() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.restore();
    for (let lb of letterBalls) {
        lb.draw(ctx);
    }
}

function addBall() {
    letterBalls.push(new LetterBall(jehLIB.getRandomLetter()));
}