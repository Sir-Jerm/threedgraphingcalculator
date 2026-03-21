//import math from 'https://cdn.jsdelivr.net/npm/mathjs@11/lib/browser/math.js'; 
import { Point } from "./js/points.js";
import { Line } from "./js/lines.js"
import { Triangle } from "./js/triangles.js";
import { Shape, Cube, Letter, Letter5, allLetters } from "./js/shapes.js";
import { rotateGraph, outputtedShapeZ, outputtedShapeX, outputtedShapeY, outputtedShape, vectorGraph, graphing, grapherParametricEqu, grapherEqu, vectorGraphing, setUniversalAdder, universalAdder, universalEquation } from "./js/calculator.js";


console.log(Point.all, Line.all, Triangle.all, Shape, Cube.all) //in

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let ch = canvas.height = innerHeight;
let cw = canvas.width = innerWidth;

let camera = {
    pos: [0, 0, -10],
}

let max = 3;
let factor = cw / (max * 2);

function changeCameraPos(pos) {
    camera.pos = pos
    for (let i in Point.all) {
        Point.all[i].changeRealPosNoAdding(Point.all[i].posReal)
    }
    for (let i in Line.all) {
        Line.all[i].updateLine();
    }
}

/*let hsphere = new HyperSphere([0, 0, 0], 5);
hsphere.makePoints(0);
let adder = 1 / 30;
setInterval(() => {
    hsphere.makePoints(adder-=1/30);
    hsphere.rotateByPointXYZ(-adder, adder, adder, hsphere.center)
}, 10)*/

addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'w':
            /*if (graphing) rotateGraph(1 / 30, 0, 0);
            if (vectorGraph) r.rotateByPointXYZ(1 / 30, 0, 0, r.center);
            if (graphing || vectorGraph) {
                for (let i in allLetters) {
                    if (r) {
                        if (allLetters[i].rotate) {
                            allLetters[i].rotateByPointXYZ(1 / 30, 0, 0, r.center);
                        }
                    }
                }
            };*/
            changeCameraPos([camera.pos[0], camera.pos[1], camera.pos[2] + 1])
            break;
        case 's':
            /*if (graphing) rotateGraph(-1 / 30, 0, 0);
            if (vectorGraph) r.rotateByPointXYZ(-1 / 30, 0, 0, r.center);
            if (graphing || vectorGraph) {
                for (let i in allLetters) {
                    if (r) {
                        if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(-1 / 30, 0, 0, r.center)
                    }
                }
            };*/
            changeCameraPos([camera.pos[0], camera.pos[1], camera.pos[2] - 1])
            break;
        case 'q':
            if (graphing) rotateGraph(0, 0, -1 / 30);
            if (vectorGraph) r.rotateByPointXYZ(0, 0, -1 / 30, r.center);
            if (graphing || vectorGraph) {
                for (let i in allLetters) {
                    if (r) {
                        if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(0, 0, -1 / 30, r.center)
                    }
                }
            };
            break;
        case 'e':
            if (graphing) rotateGraph(0, 0, 1 / 30);
            if (vectorGraph) r.rotateByPointXYZ(0, 0, 1 / 30, r.center);
            if (graphing || vectorGraph) {
                for (let i in allLetters) {
                    if (r) {
                        if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(0, 0, 1 / 30, r.center)
                    }
                }
            };
            break;
        case 'a':
            /*if (graphing) rotateGraph(0, -1 / 30, 0);
            if (vectorGraph) r.rotateByPointXYZ(0, -1 / 30, 0, r.center);
            if (graphing || vectorGraph) {
                for (let i in allLetters) {
                    if (r) {
                        if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(0, -1 / 30, 0, r.center)
                    }
                }
            };*/
            changeCameraPos([camera.pos[0] - 1, camera.pos[1], camera.pos[2]])
            break;
        case 'd':
            /*if (graphing) rotateGraph(0, 1 / 30, 0);
            if (vectorGraph) r.rotateByPointXYZ(0, 1 / 30, 0, r.center);
            if (graphing || vectorGraph) {
                for (let i in allLetters) {
                    if (r) {
                        if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(0, 1 / 30, 0, r.center)
                    }
                }
            };*/
            changeCameraPos([camera.pos[0] + 1, camera.pos[1], camera.pos[2]])
            break;
        case 'ArrowDown':
            changeCameraPos([camera.pos[0], camera.pos[1] + 1, camera.pos[2]])
            break;
        case 'ArrowUp':
            changeCameraPos([camera.pos[0], camera.pos[1] - 1, camera.pos[2]])
            break;
    }

});
let clickStarted = false;
let postition = [];
canvas.addEventListener('click', (e) => {
    if (!clickStarted) {
        postition = [e.x, e.y]
    }
    else {
        postition = [];
    }
    clickStarted = !clickStarted;
})
canvas.addEventListener('mousemove', (e) => {
    if (clickStarted) {
        if (graphing) rotateGraph(-(e.y - postition[1]) / 300, -(e.x - postition[0]) / 300, 0);
        if (vectorGraph) outputtedShape.rotateByPointXYZ(-(e.y - postition[1]) / 300, -(e.x - postition[0]) / 300, 0, outputtedShape.center)
        if (graphing || vectorGraph) {
            for (let i in allLetters) {
                if (r) {
                    if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(-(e.y - postition[1]) / 300, -(e.x - postition[0]) / 300, 0, outputtedShape.center)
                }
            }
        }
        postition = [e.x, e.y]
    }
})

function animate() {
    ctx.fillStyle = 'rgb(25, 28, 35)';
    ctx.fillRect(0, 0, cw, ch);
    for (let i in Point.all) {
            Point.all[i].draw();
    }
    for (let i in Line.all) {
        Line.all[i].draw();
    }
    for (let i in Triangle.all) {
        Triangle.all[i].draw();
    }
}

//sqrt(((x*x)+((x**2)**2))/((Math.tan(Math.atan((x**2)/x)+90)**2)+1)),y, -Math.tan(Math.atan((x**2)/x)+90)*sqrt(((x*x)+((x**2)**2))/((Math.tan(Math.atan((x**2)/x)+90)**2)+1))

let animation = setInterval(animate, 10);


function stopAnimate() {
    clearInterval(animation);
}

function setMax(value){max=value};

export {
    cw,
    ctx,
    max,
    setMax,
    camera,
    factor,
}
