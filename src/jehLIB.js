"use strict";
(function () {
    let jehLIB = {
        getRandomColor() {
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            return `rgba(${getByte()}, ${getByte()}, ${getByte()},1)`;

        },

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getRandomFloat(min, max) {
            return Math.random() * (max - min) + min;
        },

        getRandomLetter() {
            return "abcdefghijklmnopqrstuvwxyz"[this.getRandomInt(0, 25)];
        },

        getRandomWeightedLetter() {
            return "eeeeeeeeeeeetttttttttaaaaaaaaooooooooiiiiiiinnnnnnnssssssrrrrrrhhhhhhddddlllluuucccmmmfffyywwggppbbvkxqjz"[this.getRandomInt(0, 104)];
        },

        getRandomLetterOf(str) {
            return str[this.getRandomInt(0, str.length - 1)];
        },

        canMakeWord(str) {
            let superstrings = RiTa.superstrings(str);
            for(let ss of superstrings) {
                if(ss.startsWith(str)) {
                    return true;
                }
            }
            return false;
        },

        possibleNextLetters(str) {
            let possible = [];
            let superstrings = RiTa.superstrings(str);
            for(let ss of superstrings) {
                if(ss.startsWith(str)) {
                    possible.push(ss[str.length]);
                }
            }
            return possible;
        },

        getRandomUnitVector() {
            let angle = this.getRandomFloat(0, Math.PI * 2);
            return {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
        },

        drawRectangle(ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
            ctx.save();
            ctx.fillStyle = fillStyle;

            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.fill();

            if (lineWidth > 0) {
                ctx.strokeStyle = strokeStyle;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }

            ctx.restore();
        },

        magnitude(vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        },

        dotProduct(v1, v2) {
            return v1.x * v2.x + v1.y + v2.y;
        },

        normalized(vector) {
            return {
                x: vector.x / this.magnitude(vector),
                y: vector.y / this.magnitude(vector)
            }
        },

        add(v1, v2) {
            return {
                x: v1.x + v2.x,
                y: v1.y + v2.y
            }
        },

        subtract(v1, v2) {
            return {
                x: v1.x - v2.x,
                y: v1.y - v2.y
            }
        },

        mult(vector, number) {
            return {
                x: vector.x * number,
                y: vector.y * number
            }
        },
        zero() {
            return {
                x: 0,
                y:0
            }
        }
    }

    if(window) {
        window["jehLIB"] = jehLIB;
    } else {
        throw "'window' is not defined!";
    }
})();