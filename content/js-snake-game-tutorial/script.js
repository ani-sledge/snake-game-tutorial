"use strict";
// Global Variables
var window;
var document;
var ctx;
var play;
var width = 800;
var height = 600;
var size = 50;
var snake = [[0, size, "RIGHT"]];
var apple = [200, 200];
// Icons
var appleImg = document.getElementById("apple");
var digImg = document.getElementById("pika");
var textImg = document.getElementById("textBox");

// Game Play Functions
// added calls to the ctx drawImage functions
var draw = function(snakeToDraw, apple) {
    var drawableSnake = { type: "snake", pixels: snakeToDraw };
    var drawableApple = { type: "apple", pixels: apple };
    var drawableObjects = [drawableSnake, drawableApple];
    drawableObjects.forEach(function(object) {
        if (object.type == "apple") {
            ctx.drawImage(appleImg, object.pixels[1], object.pixels[0], size, size);
        } else {
            object.pixels.forEach(function(pixel) {
                ctx.drawImage(digImg, 0, 0, size, size, pixel[1], pixel[0], size, size); 
            });
        }
    });
};
// Objects (snake and apple) changed to an array instead of a hash, easier to use with canvas
var moveSegment = function(segment) {
    if (segment[2] === "DOWN") {
        return [ segment[0] + size, segment[1], segment[2] ];
    } else if (segment[2] === "UP") {
        return [ segment[0] - size, segment[1], segment[2] ];
    } else if (segment[2] === "RIGHT") {
        return [ segment[0], segment[1] + size, segment[2] ];
    } else if (segment[2] === "LEFT") {
        return [ segment[0], segment[1] - size, segment[2] ];
    }
    return segment;
};
var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index - 1] === undefined) {
        return snake[index];
    } else {
        return snake[index - 1];
    }
};
var moveSnake = function(snake) {
    return snake.map(function(oldSegment, segmentIndex) {
        var newSegment = moveSegment(oldSegment);
        newSegment[2]= segmentFurtherForwardThan(segmentIndex, snake)[2];
        return newSegment;
    });
};
var growSnake = function(newSnake, oldSnake) {
    var indexOfLastSegment = oldSnake.length - 1;
    var lastSegment = oldSnake[indexOfLastSegment];
    newSnake.push(lastSegment);
    return newSnake;
};
// Added logic to check whether the snake's head was at the same position as the specified pixel
// Didn't seem to fit in with checking for wall collisions, so that is a separate if statment in the engine
var ate = function(snake, otherObject) {
    var head = snake[0];
    var boolian = false;
    otherObject.forEach(function(pixel) {
        if ((head[0] === pixel[0]) && (head[1] === pixel[1])) {
            boolian = true;
        }
    });
    return boolian;
};

// Displays a 'you lost' message in a custom style
var displayMessage = function(message) {
    var text = "Whoops! You hit " + message + "!";
    ctx.font = "30px Arial";
    ctx.drawImage(textImg, 0, 400, 800, 200);
    ctx.fillStyle = "black";
    ctx.fillText(text,60,500);
}
// used Math.random to set a new apple in a random location on the canvas
// quits the interval if a bad collision occurs

var gameEngine = function() {
    var newSnake = moveSnake(snake);
    var outcome = true;
    if (ate(newSnake, [apple])) {
        apple = [(Math.floor(Math.random() * (height/size))*size), (Math.floor(Math.random() * (width/size))*size)];
        newSnake = growSnake(newSnake, snake);
    } else if (ate(newSnake, snake)) {
        displayMessage("yourself");
        outcome = false;
    } else if ((newSnake[0][0] < 0) || (newSnake[0][0] >= height) || (newSnake[0][1] < 0) || (newSnake[0][1] >= width)) {
        displayMessage("a wall");
        outcome = false;
    }
    if (outcome) {
        snake = newSnake;
        ctx.clearRect(0,0,width,height);
        draw(snake, apple);
    } else {
        clearInterval(play);
    }
};

// changes the snake's head's direction if an arrow keypress occurs
var changeDirection = function(e) {
    e = e || window.event; // for IE ---- if (typeof(e) === "undefined") { e = window.event; }
    if (e.keyCode == '38') {
        snake[0][2] = "UP";
    } else if (e.keyCode == '40') {
        snake[0][2] = "DOWN";
    } else if (e.keyCode == '37') {
        snake[0][2] = "LEFT";
    } else if (e.keyCode == '39') {
        snake[0][2] = "RIGHT";
    }
};
// starts up the canvas; sets the interval; sets the event handler
window.onload = function () {
    var theCanvas = document.getElementById('Canvas1');
    if (theCanvas && theCanvas.getContext) {
        ctx = theCanvas.getContext("2d");
        if (ctx) {
            play = setInterval(gameEngine, 400);
            document.onkeydown = changeDirection;
        }
    }
};