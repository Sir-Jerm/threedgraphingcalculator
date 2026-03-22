import { Cube, Shape } from "./shapes.js";
import { max , setMax } from "./scene.js";
import { Point } from "./points.js";
import { Line } from "./lines.js";
import { Triangle } from "./triangles.js";
import { determineNewCoords } from "./metric.js";

/** converts user-input equations into usable js */
function usableEquation(expression) {
    return math.parse(expression).compile()
}

/**
 * @param {number[]} pos1
 * @param {number[]} pos2
 */
function distance3D(pos1, pos2) {
    return Math.sqrt(((pos1[0] - pos2[0]) ** 2) + ((pos1[1] - pos2[1]) ** 2) + ((pos1[2] - pos2[2]) ** 2));
}

function cubePoints(center, radius) {
    let frd = new Point([center[0] + radius, center[1] - radius, center[2] - radius], false);
    let fld = new Point([center[0] - radius, center[1] - radius, center[2] - radius], false);
    let fru = new Point([center[0] + radius, center[1] - radius, center[2] + radius], false);
    let flu = new Point([center[0] - radius, center[1] - radius, center[2] + radius], false);
    let brd = new Point([center[0] + radius, center[1] + radius, center[2] - radius], false);
    let bld = new Point([center[0] - radius, center[1] + radius, center[2] - radius], false);
    let bru = new Point([center[0] + radius, center[1] + radius, center[2] + radius], false);
    let blu = new Point([center[0] - radius, center[1] + radius, center[2] + radius], false);
    return [frd, fld, fru, flu, brd, bld, bru, blu];
}

function distance(pos1, pos2) {
    return Math.sqrt(((pos1[0] - pos2[0]) ** 2) + ((pos1[1] - pos2[1]) ** 2) + ((pos1[2] - pos2[2]) ** 2))
}

/**@type {Shape} */
let outputtedShape;
/**@type {Cube} */
let cube;
/**@type {Shape} */
let triangles;
let noiserArray = [];
let universalEquation = '';
let universalAdder = 0.2;
function noiser() {
    if (noiserArray.length === 0) {
        noiserArray.push(Math.random() * 0.3);
    }
    else noiserArray.push(randomArthemic(Math.random() * 0.05, noiserArray[noiserArray.length - 1]));
    return noiserArray[noiserArray.length - 1];
}
function newCube(boundradius) {
    if (cube) {
        cube.deleteAllLines();
        cube.deleteAllPoints();
    }
    let cubep = cubePoints([0, 0, 0], boundradius);
    cube = new Cube(cubep[0], cubep[1], cubep[2], cubep[3], cubep[4], cubep[5]
        , cubep[6], cubep[7], true, false, 'rgb(255,255,255)', 0.5
    );
}
let graphing = true;
let vectorGraph = false;
/**@param {string} equation ex:"x+y" */



function grapherEqu(equation = 'Math.cos(x)-Math.sin(y)', boundradius = 5, adder=universalAdder) {

    if (!graphing) return;
    //setUniversalAdder(equation);
    let equationJS = usableEquation(equation);
    //console.log(equationJS, equation, universalAdder)
    //equation=replaceAlll(equation,'tan','Math.tan');

    //new Numbers(`${boundradius}`, [boundradius, 0, 0], 0.5, 0);
    //new Numbers(`${boundradius}`, [0, boundradius, 0], 0.5, 0);
    //new Numbers(`${boundradius}`, [0, 0, boundradius], 0.5, 0);
    setMax(boundradius);
    console.log(boundradius, adder)

    let points = [];
    let matrixPoints = [];
    //equation = equation.padStart(equation.length + 1, '-');

    if (outputtedShape) {
        outputtedShape.deleteAllLines();
        outputtedShape.deleteAllPoints();
    }
    if (triangles) {
        triangles.deleteAllPoints();
        triangles.deleteAllTriangles();
    }

    for (let i = 0; i < (boundradius * 2) / adder; i++) {
        matrixPoints.push([]);
    }

    let liness = [];
    let trianglest = [];

    for (let x = -boundradius; x <= boundradius; x += adder) {
        for (let y = -boundradius; y <= boundradius; y += adder) {

            /**@type {Point} */
            let c;
            let linedisplay = true;
            /**@type {Number} */
            let output = equationJS.evaluate({ x: x, y: y });
            //if(typeof output !== "number") continue; NaN is a number for some reason
            if (!Number.isFinite(output)) continue;

            let rx = Math.floor((x + boundradius) / adder);
            let ry = Math.floor((y + boundradius) / adder);

            //console.log(equation, points)
            if (output <= boundradius && output >= -boundradius) {
                c = new Point([x, -output, y], false, 'rgb(0,0,0)', 1);

            }
            else if (output >= boundradius) {

                c = new Point([x, -boundradius, y], false, 'rgb(0,0,0)', 2);
                linedisplay = false;
            }
            else if (output <= -boundradius) {

                c = new Point([x, boundradius, y], false, 'rgb(0,0,0)', 2);
                linedisplay = false;
            }

            points.push(c);
            if(!ry)console.log(c,x,y,rx,ry);

            if (rx === Math.floor((boundradius * 2) / adder)) break;
            //matrixPoints[rx].push(c);
            matrixPoints[rx][ry] = c;

            if (rx === 0) break;
            let p1 = matrixPoints[rx - 1]?.[ry + 1];
            let p2 = matrixPoints[rx - 1]?.[ry];
            let p3 = matrixPoints[rx]?.[ry - 1];

            if (p1 && p2 && c) trianglest.push(new Triangle([p2, p1, c]));
            if (p3 && p2 && c) {
                trianglest.push(new Triangle([p3, p2, c]));
            }

            //if this is not the first point graphed make a line
            /*if (matrixPoints[rx].length > 1) {

                if (!matrixPoints[rx][matrixPoints[rx].length - 2]?.extra) {
                    console.log(matrixPoints[rx][matrixPoints[rx].length - 2], rx, matrixPoints[rx].length - 2);
                    break;
                }

                //if the point is in boundary add a line to it
                if (matrixPoints[rx][matrixPoints[rx].length - 2].extra === 1) {

                    liness.push(new Line(
                        matrixPoints[rx][matrixPoints[rx].length - 1],
                        matrixPoints[rx][matrixPoints[rx].length - 2],
                        linedisplay, 'hsl(100,100%,50%)',
                    ));

                }
            }


            //if this is not the first array add a line to a point
            if (matrixPoints[rx - 1]) {
                //and if the point exists add a line to it
                if (matrixPoints[rx - 1][matrixPoints[rx].length - 1]) {
                    //and if the point is in the boundary add a line to it
                    if (matrixPoints[rx - 1][matrixPoints[rx].length - 1].extra === 1) {

                        liness.push(new Line(
                            matrixPoints[rx - 1][matrixPoints[rx].length - 1],
                            matrixPoints[rx][matrixPoints[rx].length - 1],
                            linedisplay, 'hsl(100,100%,50%)',
                        ));

                    }
                }
            }*/

        }
    }

    //console.log(matrixPoints);

    outputtedShape = new Shape(points, true, liness);

    triangles = new Shape(points, true, undefined, trianglest);

    newCube(boundradius);

    //r.rotateByPointXYZ(Math.PI*2-rX,Math.PI*2-rY,Math.PI*2-rZ,cube.center);
    //cube.rotateByPointXYZ(-rX,-rY,-rZ,cube.center)
}
function grapherParametricEqu(pointsEq, boundradius = 5, adder = 0.1) {

    if (!graphing) return
    //universalEquation = pointsEq;
    //pointsEq=replaceAlll(pointsEq,'tan','Math.tan');

    pointsEq = pointsEq.split(',')
    //console.log(usableEquation(pointsEq[2]));
    let equationJS = [
        usableEquation(pointsEq[0]),
        usableEquation(pointsEq[1]),
        usableEquation(pointsEq[2])
    ];
    //console.log(pointsEq)

    if (outputtedShape) {
        outputtedShape.deleteAllLines();
        outputtedShape.deleteAllPoints();
    }
    if (triangles) {
        triangles.deleteAllPoints();
        triangles.deleteAllTriangles();
    }

    let points = [];
    let matrixPoints = [];

    for (let i = 0; i < (boundradius * 2) / adder; i++) {
        matrixPoints.push([]);
    }

    let liness = [];
    let trianglest = [];

    for (let x = -boundradius; x <= boundradius; x += adder) {
        for (let y = -boundradius; y <= boundradius; y += adder) {

            let c;
            let linedisplay = true;

            let outputs = [
                equationJS[0].evaluate({ x: x, y: y }),
                equationJS[1].evaluate({ x: x, y: y }),
                equationJS[2].evaluate({ x: x, y: y })
            ]
            //prevents from rendering if outside the box
            if (
                (Math.abs(outputs[0]) > boundradius ||
                Math.abs(outputs[1]) > boundradius ||
                Math.abs(outputs[2]) > boundradius) && 
                (
                    Number.isFinite(outputs[0])&&
                    Number.isFinite(outputs[1])&&
                    Number.isFinite(outputs[2])
                ) 
            ) c = new Point(outputs, false, 'rgb(150, 45, 45)', 2);
            else c = new Point(outputs, false, 'rgb(201, 76, 76)', 1);

            points.push(c);

            let rx = Math.floor((x + boundradius) / adder);
            let ry = Math.floor((y + boundradius) / adder);

            if (rx === Math.floor((boundradius * 2) / adder)) break;
            matrixPoints[rx].push(c);

            //if (rx === Math.floor((boundradius * 2) / adder)) break;
            //matrixPoints[rx].push(c);

            if (rx === 0) break;
            //let p1 = matrixPoints[rx - 1][ry + 1];
            //let p2 = matrixPoints[rx - 1][ry];
            //let p3 = matrixPoints[rx][ry - 1];

            //if (p1) trianglest.push(new Triangle([p2, p1, c]));
            //if (p3 && p2) {
            //   trianglest.push(new Triangle([p3, p2, c]));
            //}


            //if this is not the first point graphed make a line
            if (matrixPoints[rx].length > 1) {

                if (!matrixPoints[rx][matrixPoints[rx].length - 2]?.extra) {
                    console.log(matrixPoints[rx][matrixPoints[rx].length - 2], rx, matrixPoints[rx].length - 2);
                    break;
                }

                //if the point is in boundary add a line to it
                if (matrixPoints[rx][matrixPoints[rx].length - 2].extra === 1) {

                    liness.push(new Line(
                        matrixPoints[rx][matrixPoints[rx].length - 1],
                        matrixPoints[rx][matrixPoints[rx].length - 2],
                        linedisplay, 'hsl(100,100%,50%)',
                    ));

                }
            }

            //if this is not the first array add a line to a point
            if (matrixPoints[rx - 1]) {
                //console.log('wah')
                //and if the point exists add a line to it
                if (matrixPoints[rx - 1][matrixPoints[rx].length - 1]) {
                    //console.log('tah')
                    //and if the point is in the boundary add a line to it
                    if (matrixPoints[rx - 1][matrixPoints[rx].length - 1].extra === 1) {
                        //console.log('bah')
                        //if(!matrixPoints[rx - 1][matrixPoints[rx].length - 1] || !matrixPoints[rx][matrixPoints[rx].length - 2])
                        //    console.log(matrixPoints[rx - 1][matrixPoints[rx].length - 1], matrixPoints[rx][matrixPoints[rx].length - 2]);
                        liness.push(new Line(
                            matrixPoints[rx - 1][matrixPoints[rx].length - 1],
                            matrixPoints[rx][matrixPoints[rx].length - 1],
                            linedisplay, 'hsl(100,100%,50%)',
                        ));

                    }
                }
            }

        }
    }
    //console.log(matrixPoints);
    outputtedShape = new Shape(points, true, liness);

    triangles = new Shape(points, true, undefined, trianglest);

    newCube(boundradius);
}
function rotateGraph(x, y, z) {
    if(!(outputtedShape&&cube)) return //if they do not exist there is not point in trying to rotate them
    outputtedShapeX += x; outputtedShapeY += y; outputtedShapeZ += z;
    outputtedShape.rotateByPointXYZ(x, y, z, cube.center);

    cube.rotateByPointXYZ(x, y, z, cube.center);
}

function makeShorterTheMagnitude(pos1, pos2, shortener) {
    let dxPos=[(pos1[0] - pos2[0]) / shortener + pos2[0],
    (pos1[1] - pos2[1]) / shortener + pos2[1],
    (pos1[2] - pos2[2]) / shortener + pos2[2]
    ]
    return determineNewCoords(dxPos[0],dxPos[1],dxPos[2]);
}


let outputtedShapeX = 0; let outputtedShapeY = 0; let outputtedShapeZ = 0;

function vectorGraphing(equationX, equationY, equationZ, adder = 1) {
    //if (!vectorGraph) return;

    if (outputtedShape) {
        outputtedShape.deleteAllLines();
        outputtedShape.deleteAllPoints();
    }
    if (triangles) {
        triangles.deleteAllPoints();
        triangles.deleteAllTriangles();
    }

    let equationJSX = usableEquation(equationX);
    let equationJSY = usableEquation(equationY);
    let equationJSZ = usableEquation(equationZ);

    setMax(3);
    let points = [];
    let lines = [];
    let vector = {};
    for (let x = -max; x <= max; x += adder) {
        for (let y = -max; y <= max; y += adder) {
            for (let z = -max; z <= max; z += adder) {
                if (x == 0 && y == 0 && z == 0) continue;
                let solvedX = equationJSX.evaluate({ x: x, y: y, z: z });
                let solvedY = equationJSY.evaluate({ x: x, y: y, z: z });
                let solvedZ = equationJSZ.evaluate({ x: x, y: y, z: z });
                points.push(new Point([x, y, z], false));
                points.push(new Point(makeShorterTheMagnitude([x, y, z], [solvedX, solvedY, solvedZ], 1.1), true, 'rgba(0, 255, 242, 0.54)'));
                lines.push(new Line(points[points.length - 1], points[points.length - 2], true,
                    `hsl(${distance3D([x, y, z], [solvedX, solvedY, solvedZ]) * 10},100%,50%)`));

                /*vector[`${x},${y},${z}`] = [
                    Number((points[points.length - 1].posReal[0] - points[points.length - 2].posReal[0]).toPrecision(3)),
                    Number((points[points.length - 1].posReal[1] - points[points.length - 2].posReal[1]).toPrecision(3)),
                    Number((points[points.length - 1].posReal[2] - points[points.length - 2].posReal[2]).toPrecision(3)),
                ]*/

            }
        }
    }
    //console.log(vector)
    /*points.push(new Particle([0.1,0.1,0.1],[0,0,0],[
        equationJSX,
        equationJSY,
        equationJSZ
    ],3,true,"hsl(222, 100%, 77%)"));*/
    outputtedShape = new Shape(points, true, lines, null);
    newCube(5);
}

function parametricLineGraphing(equationX, equationY, equationZ, adder = 0.01) {

    let equationJSX = usableEquation(equationX);
    let equationJSY = usableEquation(equationY);
    let equationJSZ = usableEquation(equationZ);

    if (outputtedShape) {
        outputtedShape.deleteAllLines();
        outputtedShape.deleteAllPoints();
    }
    if (triangles) {
        triangles.deleteAllPoints();
        triangles.deleteAllTriangles();
    }

    //boundary = 5;
    //to put all the points and lines into one shape
    let points = [];
    let lines = [];
    //let vector = {};
    for (let im = 0; im < 10; im++) {
        let x, y, z, t = 0;
        let startX = x = equationJSX.evaluate({ t: t });
        let startY = y = equationJSY.evaluate({ t: t });
        let startZ = z = equationJSZ.evaluate({ t: t });

        points.push(new Point([x, y, z], false));
        //let startX,startY,startZ
        for (let t = 0.1; t < 3.141592 * 2; t += adder) {
            startX = equationJSX.evaluate({ t: t });
            startY = equationJSY.evaluate({ t: t });
            startZ = equationJSZ.evaluate({ t: t });

            points.push(new Point([startX, startY, startZ]))

            //since eval is a function we have to change the x,y,z because eval uses them
            x = startX
            y = startY
            z = startZ

            lines.push(new Line(points[points.length - 2], points[points.length - 1], true,
                `hsl(${distance3D(points[points.length - 2].posReal, points[points.length - 1].posReal) * 10},100%,50%)`
            ));
            //console.log(points[i*im + i].posReal, points[i*im + 1 + i].posReal);

        }
    }


    //console.log(vector)
    outputtedShape = new Shape(points, true, lines);
    newCube(5);
}

//vectorGraphing('cos(x)','0','sin(x)');
//grapherParametricEqu("(3+2*sin(x))*cos(y),(3+2*sin(x))*sin(y),2*cos(x)", 5, 0.2);
//grapherEqu('(sqrt((x^2)+(y^2)))-5');
//grapherEqu('x^2 + y^2 - 5')
// for vectors (x)/( (x*x + y*y + (z-1)*(z-1) + 0.1)**1.5 )  - (x)/( (x*x + y*y + (z+1)*(z+1) + 0.1)**1.5 ), (y)/( (x*x + y*y + (z-1)*(z-1) + 0.1)**1.5 )  - (y)/( (x*x + y*y + (z+1)*(z+1) + 0.1)**1.5 ), ((z-1))/( (x*x + y*y + (z-1)*(z-1) + 0.1)**1.5 )  - ((z+1))/( (x*x + y*y + (z+1)*(z+1) + 0.1)**1.5 )
//universalEquation = '(sqrt((x**2)+(y**2)))-5';*/
/*parametricLineGraphing(
    '(x)/( (x*x + y*y + (z-1)*(z-1) + 0.1)**1.5 )  - (x)/( (x*x + y*y + (z+1)*(z+1) + 0.1)**1.5 )',
    '(y)/( (x*x + y*y + (z-1)*(z-1) + 0.1)**1.5 )  - (y)/( (x*x + y*y + (z+1)*(z+1) + 0.1)**1.5 )',
    '((z-1))/( (x*x + y*y + (z-1)*(z-1) + 0.1)**1.5 )  - ((z+1))/( (x*x + y*y + (z+1)*(z+1) + 0.1)**1.5 )',
    0.25
)*/
//parametricLineGraphing('sin(t)+2*sin(2*t)','cos(t)-2*cos(2*t)','-sin(3*t)') // Trinity knot
//parametricLineGraphing('cos(t)','sin(t)','t/2') //helix
//parametricLineGraphing('(4+cos(15*t))*cos(t)', 'sin(15*t)', '(4+cos(15*t))*sin(t)') // helix torus


function randomArthemic(a, b) {
    return Math.random() < 0.5 ? a + b : a - b;
}

function setUniversalAdder(value){universalAdder=value};

export {
    parametricLineGraphing,
    grapherEqu,
    grapherParametricEqu,
    rotateGraph,
    vectorGraph,
    vectorGraphing,
    outputtedShape,
    outputtedShapeX,
    outputtedShapeY,
    outputtedShapeZ,
    triangles,
    graphing,
    universalAdder,
    setUniversalAdder,
    universalEquation
}
