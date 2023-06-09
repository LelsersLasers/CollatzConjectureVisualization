const SPACER_PERCENT = 0.05;
let SPACER_PX = 0;
const SLIDE_START = 20;

let speedTimer = 0;

GraphSize.init();

const canvas = document.getElementsByTagName("canvas")[0];
// canvas.addEventListener("mousemove", function (event) {
//     const rect = canvas.getBoundingClientRect();

//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     // const pos = new Vector(x / canvas.width, y / canvas.height);
//     // mouseObstacle.pos = pos;
// });

const context = canvas.getContext("2d");

let collatzNumbers = [new CollatzNumber(1)];
let allValues = [1];
let allFinishCounts = [];


let paused = false;


function resize() {
    if (canvas) {
        let maxWidth = (window.innerWidth - 34) * (3 / 4);
        let maxHeight = window.innerHeight - 34;

        // let width = Math.min(maxWidth, maxHeight);
        // let height = Math.min(maxHeight, maxWidth);

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
    const width = canvas.width - (SPACER_PX * 2);
    return SPACER_PX + (val / GraphSize.getX() * width);
}
function valToY(val) {
    // -1 because the conjecture is that all numbers will eventually reach 1
    const height = canvas.height - (SPACER_PX * 2);

    return canvas.height - (SPACER_PX + ((val - 1) / GraphSize.getY() * height));
}

function maxNonOutlier(arr) {
    arr.sort((a, b) => a - b);
    const q1 = arr[Math.floor(arr.length / 4)];
    const q3 = arr[Math.floor(arr.length * 3 / 4)];
    const iqr = q3 - q1;
    const upperBound = q3 + (iqr * 1.5);

    return upperBound;
}


function render() {
    context.fillStyle = "#3B4252";
    context.fillRect(0, 0, canvas.width, canvas.height);

    
    if (!paused) {
        speedTimer += delta;
        if (speedTimer > 1 / Settings.speed) {

            if (speedTimer > 2 / Settings.speed) {
                // likely from switching tabs or falling too far behind
                speedTimer = 0;
            } else {
                speedTimer -= 1 / Settings.speed;
            }

            const lastNumber = collatzNumbers[collatzNumbers.length - 1];
            if (!lastNumber.finished()) {
                const val = lastNumber.next();
                allValues.push(val);
            }
            else {
                const finishCount = lastNumber.history.length;
                allFinishCounts.push(finishCount);

                if (allFinishCounts.length > 20) {
                    if (Settings.showAllNumbers) {
                        const upper = Math.max(...allFinishCounts);
                        GraphSize.setX(upper);
                    } else {
                        const upperBound = maxNonOutlier(allFinishCounts);
                        GraphSize.setX(upperBound);
                    }
                }

                const newNumber = lastNumber.start + 1;
                collatzNumbers.push(new CollatzNumber(newNumber));
                allValues.push(newNumber);
            }

            if (allValues.length > 20) {
                if (Settings.showAllNumbers) {
                    const upper = Math.max(...allValues);
                    GraphSize.setY(upper);
                } else {
                    const upperBound = maxNonOutlier(allValues);
                    GraphSize.setY(upperBound);
                }
            }
        }
    }

    GraphSize.update(delta);

    for (let i = 0; i < collatzNumbers.length; i++) {
        const collatzNumber = collatzNumbers[i];
        const history = collatzNumber.history;

        context.beginPath();
        context.strokeStyle = Settings.randomColors ? collatzNumber.color : "#ECEFF4";
        context.moveTo(valToX(0), valToY(history[0]));
        for (let j = 1; j < history.length; j++) {
            const val = history[j];

            const y = valToY(val);
            const x = valToX(j);

            context.lineTo(x, y);

        }
        context.stroke();
    }



    context.strokeStyle = "#EBCB8B";
    context.beginPath();
    context.moveTo(SPACER_PX, SPACER_PX);
    context.lineTo(SPACER_PX, canvas.height - SPACER_PX);
    context.lineTo(canvas.width - SPACER_PX, canvas.height - SPACER_PX);
    context.stroke();

    // Draw the axis number labels
    context.font = (SPACER_PX / 3) + "px serif";
    context.fillStyle = "#D8DEE9";

    const spacerDif = SPACER_PX * 0.9;
    
    // X axis
    context.textAlign = "right";
    context.textBaseline = "top";

    context.fillText(GraphSize.getX().toFixed(0), canvas.width - SPACER_PX, canvas.height - spacerDif);

    // Y axis
    context.textAlign = "right";
    context.textBaseline = "right";

    context.fillText(GraphSize.getY().toFixed(0), spacerDif, SPACER_PX);



    t1 = performance.now();
    delta = (t1 - t0) / 1000;
    t0 = performance.now();


    // document.getElementById("fpsText").innerHTML = "FPS: " + Math.round(1 / delta);

    window.requestAnimationFrame(render);
}


var t0 = performance.now();
var t1 = performance.now();
var delta = 1 / 60;


window.requestAnimationFrame(render);
