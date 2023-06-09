

const canvas = document.getElementsByTagName("canvas")[0];
canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // const pos = new Vector(x / canvas.width, y / canvas.height);
    // mouseObstacle.pos = pos;
});

const context = canvas.getContext("2d");

let collatzNumbers = [
    new CollatzNumber(1),
];


let paused = false;


function resize() {
    if (canvas) {
        let maxWidth = (window.innerWidth - 34) * (3 / 4);
        let maxHeight = window.innerHeight - 34;

        // let width = Math.min(maxWidth, maxHeight);
        // let height = Math.min(maxHeight, maxWidth);

        canvas.width = maxWidth;
        canvas.height = maxHeight;
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
  

const MAX_Y = 50;
const MAX_X = 50;
const SPACER_PERCENT = 0.02;
const RANDOM_COLORS = false;
const SPEED = 30; // 'next' calls per second

let speedTimer = 0;

function valToY(val) {
    // -1 because the conjecture is that all numbers will eventually reach 1

    const spacer = canvas.height * SPACER_PERCENT;
    const height = canvas.height - (spacer * 2);

    return canvas.height - (spacer + ((val - 1) / MAX_Y * height));
}
function valToX(val) {
    const spacer = canvas.width * SPACER_PERCENT;
    const width = canvas.width - (spacer * 2);

    return spacer + (val / MAX_X * width);

}

function render() {
    context.fillStyle = "#3B4252";
    context.fillRect(0, 0, canvas.width, canvas.height);

    
    if (!paused) {
        speedTimer += delta;
        if (speedTimer > 1 / SPEED) {

            if (speedTimer > 2 / SPEED) { // likely from switching tabs
                speedTimer = 0;
            } else {
                speedTimer -= 1 / SPEED;
            }

            const lastNumber = collatzNumbers[collatzNumbers.length - 1];
            if (!lastNumber.finished()) {
                lastNumber.next();
            }
            else {
                collatzNumbers.push(new CollatzNumber(lastNumber.start + 1));
            }
        }
    }

    for (let i = 0; i < collatzNumbers.length; i++) {
        const collatzNumber = collatzNumbers[i];
        const history = collatzNumber.history;

        context.beginPath();
        context.strokeStyle = RANDOM_COLORS ? collatzNumber.color : "#ECEFF4";
        context.moveTo(valToX(0), valToY(history[0]));
        for (let j = 1; j < history.length; j++) {
            const val = history[j];

            const y = valToY(val);
            const x = valToX(j);

            context.lineTo(x, y);

        }
        context.stroke();
    }

    // context.strokeStyle = "#EBCB8B";
    // context.strokeRect(
    //     canvas.width * SPACER_PERCENT,
    //     canvas.height * SPACER_PERCENT,
    //     canvas.width * (1 - SPACER_PERCENT * 2),
    //     canvas.height * (1 - SPACER_PERCENT * 2)
    // );



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
