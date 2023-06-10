const SPACER_PERCENT = 0.025;
let SPACER_PX = 0;
const SLIDE_START = 20;

let speedTimer = 0;

GraphSize.init();

const canvas = document.getElementsByTagName("canvas")[0];
const context = canvas.getContext("2d");

let collatzNumbers = [new CollatzNumber(1)];

let paused = false;

function resize() {
    if (canvas) {
        let maxWidth = (window.innerWidth - 34) * (3 / 4);
        let maxHeight = window.innerHeight - 34;

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        SPACER_PX = Math.max(canvas.width, canvas.height) * SPACER_PERCENT;
    }
}

function togglePause() {
    paused = !paused;
    let text = paused ? "Resume" : "Pause";
    document.getElementById("pauseButton").innerHTML = text;
}
function reset() {
    collatzNumbers = [new CollatzNumber(1)];

    GraphSize.init();
}

function setupUI() {
    const rangeElements = document.querySelectorAll("input[type=range]");
    for (let i = 0; i < rangeElements.length; i++) {
        const element = rangeElements[i];
        element.addEventListener("input", function (event) {
            let value = parseFloat(event.target.value);
            const name = event.target.name;

            if (name == "angle") {
                value *= Math.PI / 180;
            }

            Settings[name] = value;
        });
    }

    const checkboxElements = document.querySelectorAll("input[type=checkbox]");
    for (let i = 0; i < checkboxElements.length; i++) {
        const element = checkboxElements[i];
        element.addEventListener("change", function (event) {
            const value = event.target.checked;
            const name = event.target.name;

            Settings[name] = value;

            if (name == "showDot") {
                if (value) {
                    document
                        .getElementById("dotSize")
                        .removeAttribute("hidden");
                } else {
                    document
                        .getElementById("dotSize")
                        .setAttribute("hidden", "");
                }
            }
        });
    }
}

function rgbToFillStyle(r, g, b) {
    // Range: 0 to 1.0
    let scaledR = Math.floor(r * 255);
    let scaledG = Math.floor(g * 255);
    let scaledB = Math.floor(b * 255);

    return "rgb(" + scaledR + "," + scaledG + "," + scaledB + ")";
}
function randomColor() {
    let r = Math.random() * 0.8 + 0.2;
    let g = Math.random() * 0.8 + 0.2;
    let b = Math.random() * 0.8 + 0.2;

    return rgbToFillStyle(r, g, b);
}

function valToX(val) {
    const minX = GraphSize.getMinX();
    const maxX = GraphSize.getMaxX();

    const width = canvas.width - SPACER_PX * 2;

    const percent = (val - minX) / (maxX - minX);

    return SPACER_PX + percent * width;
}
function valToY(val) {
    const minY = GraphSize.getMinY();
    const maxY = GraphSize.getMaxY();

    const height = canvas.height - SPACER_PX * 2;

    const percent = (val - minY) / (maxY - minY);

    return SPACER_PX + percent * height;
}

function render() {
    context.fillStyle = "#3B4252";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const lastNumber = collatzNumbers[collatzNumbers.length - 1];

    if (!paused) {
        speedTimer += delta;
        if (speedTimer > 1 / Settings.speed) {
            if (speedTimer > 2 / Settings.speed) {
                // likely from switching tabs or falling too far behind
                speedTimer = 0;
            } else {
                speedTimer -= 1 / Settings.speed;
            }

            if (!lastNumber.finished()) {
                lastNumber.next();
            } else {
                const newNumber = lastNumber.start + 1;
                collatzNumbers.push(new CollatzNumber(newNumber));
            }
        }

        GraphSize.update(delta);
    }

    context.lineWidth = Settings.lineWidth;
    context.globalAlpha = Settings.lineOpacity;

    const points = [];

    let lowestX = 0;
    let highestX = 0;
    let lowestY = 0;
    let highestY = 0;

    let lastPos = Vector.zero();

    for (let i = 0; i < collatzNumbers.length; i++) {
        const collatzNumber = collatzNumbers[i];
        const history = collatzNumber.history;

        const chain = [];

        let pos = Vector.zero();
        let move = Vector.unitYNeg();

        chain.push(pos.clone());

        for (let j = 0; j < history.length; j++) {
            const val = history[j];

            if (val % 2 == 0) {
                move.rotateTo(Settings.angle);
            } else {
                move.rotateTo(-Settings.angle);
            }

            pos.addTo(move);

            if (pos.x < lowestX) {
                lowestX = pos.x;
            } else if (pos.x > highestX) {
                highestX = pos.x;
            }

            if (pos.y < lowestY) {
                lowestY = pos.y;
            } else if (pos.y > highestY) {
                highestY = pos.y;
            }

            chain.push(pos.clone());
        }
        points.push(chain);
        lastPos = pos;
    }

    GraphSize.setMinX(lowestX);
    GraphSize.setMaxX(highestX);
    GraphSize.setMinY(lowestY);
    GraphSize.setMaxY(highestY);

    for (let i = 0; i < points.length; i++) {
        const chain = points[i];

        context.beginPath();
        context.strokeStyle = Settings.randomColors
            ? collatzNumbers[i].color
            : "#ECEFF4";

        const startX = valToX(chain[0].x);
        const startY = valToY(chain[0].y);

        context.moveTo(startX, startY);

        for (let j = 0; j < chain.length; j++) {
            const pos = chain[j];

            const x = valToX(pos.x);
            const y = valToY(pos.y);

            context.lineTo(x, y);
        }
        context.stroke();
    }

    context.globalAlpha = 1;

    if (Settings.showDot) {
        const lastX = valToX(lastPos.x, lowestX, highestX);
        const lastY = valToY(lastPos.y, lowestY, highestY);

        context.fillStyle = "#A3BE8C";
        context.beginPath();
        context.arc(lastX, lastY, Settings.dotSize * SPACER_PX, 0, 2 * Math.PI);
        context.fill();
    }

    t1 = performance.now();
    delta = (t1 - t0) / 1000;
    t0 = performance.now();

    document.getElementById("fpsText").innerHTML =
        "FPS: " + Math.round(1 / delta);
    document.getElementById("numbersText").innerHTML =
        "Current Number: " + lastNumber.start;

    window.requestAnimationFrame(render);
}

var t0 = performance.now();
var t1 = performance.now();
var delta = 1 / 60;

setupUI();

window.requestAnimationFrame(render);
