import * as math from 'https://cdn.jsdelivr.net'; 

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let ch = canvas.height = innerHeight;
let cw = canvas.width = innerWidth;

let camera = {
    pos: [0, 0, -10],
}

let max = 3;
let factor = cw / (max * 2);
let seebackwards = false;

function calculationForRealToPix(x, y, z) {
    if (seebackwards) {
        let rtz = z - camera.pos[2];
        let rte = [(factor * (x - camera.pos[0]) / Math.abs(z - camera.pos[2])) + (cw / 2),
        (factor * (y - camera.pos[1]) / Math.abs(z - camera.pos[2])) + (10 * cw / 45)];
        if (rtz < 0) {
            rte = [(cw / 2) - Math.sign((cw / 2) - rte[0]) * Math.abs(rte[0] - (cw / 2)),
            (ch / 2) - Math.sign((ch / 2) - rte[1]) * Math.abs(rte[1] - (ch / 2))]
        }
        return rte;
    }
    else return [(factor * (x - camera.pos[0]) / (z - camera.pos[2])) + (cw / 2),
    (factor * (y - camera.pos[1]) / (z - camera.pos[2])) + (10 * cw / 45)];
}
function realPointToPixPoint(x, y, z) {
    let p = 0//0.1 + camera.pos[2] - z;
    if (z > camera.pos[2]) return calculationForRealToPix(x, y, z)
    else return calculationForRealToPix(x, y, z + p);
}
function realPointToPixPoint(pos) {
    if (seebackwards) return calculationForRealToPix(pos[0], pos[1], pos[2]);
    else {
        let p = 0.1 + camera.pos[2] - pos[2];
        if (pos[2] > camera.pos[2]) return calculationForRealToPix(pos[0], pos[1], pos[2]);
        else return calculationForRealToPix(pos[0], pos[1], pos[2] + p);
    }
}
//--------
function distanceFunctionDistortion(pos) {
    pos[0] = (pos[0] / euclidNorm3d(0, 0, 0, pos[0], pos[1], pos[2])) * distanceFunction(0, 0, 0, pos[0], pos[1], pos[2])
    pos[1] = (pos[1] / euclidNorm3d(0, 0, 0, pos[0], pos[1], pos[2])) * distanceFunction(0, 0, 0, pos[0], pos[1], pos[2])
    pos[2] = (pos[2] / euclidNorm3d(0, 0, 0, pos[0], pos[1], pos[2])) * distanceFunction(0, 0, 0, pos[0], pos[1], pos[2])
    return realPointToPixPoint(pos);
}

function distanceFunction(x1, y1, z1, x2, y2, z2) {
    return manhattanDistance(x1, y1, z1, x2, y2, z2);
}

function manhattanDistance(x1, y1, z1, x2, y2, z2) {
    return Math.abs((x1 - x2)) + Math.abs((y1 - y2)) + Math.abs((z1 - z2));
}
function myParabolicDistance(x1, y1, x2, y2) {
    //xP and yP can be any value
    let xP = 9; let yP = 9;
    let a = ((yP * x2) - (xP * y2)) / ((xP * xP * x2) - (xP * x2 * x2));
    let b = (yP - x2 + (a * x2 * x2) - (a * xP * xP)) / (xP - x2);
    //let c = y2-b*x2-a*x2*x2;
    function mokt(x) {
        let lop = (2 * a * x) + b;
        let k = Math.sqrt(((lop) ** 2) + 1);
        return (Math.log(k + lop) / (4 * a)) + ((x / 2) + (b / (4 * a))) * k;
    }
    return Math.abs(mokt(x1) - mokt(x2));
}
function chebyshevDistance(x1, y1, x2, y2) {
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}
function cosineSimilarityDistance(x1, y1, x2, y2) {
    return 1 - (((x1 * x2) + (y1 * y2)) / (Math.sqrt((x1 * x1) + (y1 * y1)) * Math.sqrt((x2 * x2) + (y2 * y2))))
}
function angularDistance(x1, y1, x2, y2) {
    return Math.abs(Math.atan2(y2, x2) - Math.atan2(y1, x1))
}
function logarithmicDistance(x1, y1, x2, y2) {
    return Math.log10(1 + Math.abs(x2 - x1) + Math.abs(y2 - y1));
}
function expDistance(x1, y1, x2, y2) {
    return Math.exp(-Math.abs(x2 - x1) - Math.abs(y2 - y1));
}

//dont change this one
function euclidNormP(p1, p2) {
    return Math.sqrt(((p1.x - p2.x) ** 2) + ((p1.y - p2.y) ** 2))
}
function euclidNorm(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2))
}
function euclidNorm3d(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2) + ((z1 - z2) ** 2))
}

//------------------
function sgn(num) {
    if (num <= 0) return 0;
    else return 1;
}

function wait(milli, func) {
    let p = setInterval(() => {
        func();
        clearInterval(p);
    }, milli);
}

function changeCameraPos(pos) {
    camera.pos = pos
    for (let i in Point.all) {
        Point.all[i].changeRealPosNoAdding(Point.all[i].posReal)
    }
    for (let i in Line.all) {
        Line.all[i].updateLine();
    }
}

/**
 * The following is adapted and substantially copied from https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion as of 21 Feb 2026.
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {string}           The RGB representation
 */
function hueToRgbOG(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function hslToRgb(color) {
    let parts = color.trim().split(',');

    let h = parseFloat(parts[0].replace('hsl(', '')) / 360;
    let s = parseFloat(parts[1]) / 100;
    let l = parseFloat(parts[2].replace('%)', '')) / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgbOG(p, q, h + 1 / 3);
        g = hueToRgbOG(p, q, h);
        b = hueToRgbOG(p, q, h - 1 / 3);
    }

    return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
}
class Point {
    static all = {};
    static allArray = [];
    /**
     * 
     * @param {number[]} posReal 
     * @param {boolean} display 
     * @param {string} color 
     * @param {string} extra 
     */
    constructor(posReal, display, color = `hsl(${distance3D(posReal, [0, 0, 0])}*10,100%,20%)`, extra = null) {
        this.posReal = posReal;
        this.posPix = realPointToPixPoint(posReal);
        //this.posPix = distanceFunctionDistortion(posReal);
        this.radiusReal = 0.001;
        this.radiusPix = ((factor / 2) * (this.radiusReal) / (posReal[2] - camera.pos[2]));
        this.color = color;
        this.display = display;
        if (extra) {
            this.extra = extra;
        }
        this.id = Math.random();
        Point.all[this.id] = this;
        Point.allArray.push(this);
    }
    changeRealPos(dcoords) {
        this.posReal = addCoords(this.posReal, dcoords);
        this.posPix = realPointToPixPoint(this.posReal);
        //this.posPix = distanceFunctionDistortion(this.posReal);
        this.radiusReal = 0.1;
        this.radiusPix = (factor / 2 * (this.radiusReal) / (this.posReal[2] - camera.pos[2]));
    }
    changeRealPosNoAdding(coords) {
        this.posReal = coords;
        this.posPix = realPointToPixPoint(this.posReal);
        //this.posPix = distanceFunctionDistortion(this.posReal);
        this.radiusReal = 0.1;
        this.radiusPix = (factor / 2 * (this.radiusReal) / (this.posReal[2] - camera.pos[2]));
    }
    draw() {
        if (this.posReal[2] < camera.pos[2]) return;
        if (this.radiusReal !== 0.1) this.radiusPix = ((factor / 2) * (this.radiusReal) / (this.posReal[2] - camera.pos[2]));
        if (this.display) {
            ctx.beginPath();
            ctx.arc(this.posPix[0], this.posPix[1], Math.abs(this.radiusPix), 0, 360, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function hueBasedOnheight(height) {
    return height * 30;
}

/**
 * @param {number[]} pos1
 * @param {number[]} pos2
 */
function distance3D(pos1, pos2) {
    return Math.sqrt(((pos1[0] - pos2[0]) ** 2) + ((pos1[1] - pos2[1]) ** 2) + ((pos1[2] - pos2[2]) ** 2));
}

/**@param {...number[]} pos  */
function averagePoint(...pos) {
    const avg = [0, 0, 0];
    for (let i = 0; i < pos.length; i++) {
        if (typeof pos[i] === 'number') {
            avg[0] += pos[i][0];
            avg[1] += pos[i][1];
            avg[2] += pos[i][2];
        }
        else {
            //console.log(pos[i]);
            avg[0] += pos[i].posReal[0];
            avg[1] += pos[i].posReal[1];
            avg[2] += pos[i].posReal[2];
        }
    }
    //console.log(avg);
    return [avg[0] / pos.length, avg[1] / pos.length, avg[2] / pos.length];

}

function averageOf3d(array) {
    return (array[0] + array[1] + array[2]) / 3
}

class Line {
    static all = {};
    //static hue=0;
    /**appects ONLY pixPoints */
    constructor(p1, p2, display, color = `hsl(${hueBasedOnheight((this.p1.posReal[1] + this.p2.posReal[1]) / 2)},100%,50%)`, linewidth = 1) {
        this.p1 = p1;
        this.p2 = p2;
        this.x1 = p1.posPix[0];
        this.y1 = p1.posPix[1];
        this.x2 = p2.posPix[0];
        this.y2 = p2.posPix[1];
        /*if(!(this.x1>0&&this.y1>0
            &&this.x1<innerWidth&&this.y1<innerHeight
            &&this.x2<innerWidth&&this.y2<innerHeight
            &&this.x2>0&&this.y2>0
        )) {display=false;}*/
        this.display = display;
        this.id = `${p1.id},${p2.id}`;
        //Line.hue+=10;
        let opacity;
        try { opacity = averageOf3d(averagePoint(averagePoint(p1, p2), camera.pos)) } catch { opacity = 1 };
        //let k = "rgba(23, 139, 255, 0.26)"
        this.color = `rgba(${hslToRgb(color)},${opacity}`;
        this.linewidth = linewidth;
        //this.linewidth1 = linewidth/10;
        Line.all[this.id] = this;
    }
    draw() {
        //let rrrr = (this.p1.posReal[2]+this.p2.posReal[2])/2
        //this.linewidth=((factor / 2) * (this.linewidth1) / (rrrr - camera.pos[2]))
        if (this.display) {
            ctx.beginPath();
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.linewidth;
            ctx.stroke();
            ctx.closePath();
        }
    }
    updateLine() {
        this.x1 = this.p1.posPix[0];
        this.y1 = this.p1.posPix[1];
        this.x2 = this.p2.posPix[0];
        this.y2 = this.p2.posPix[1];
    }
}

class Triangle {
    static all = {};
    /**
     * 
     * @param {Point[]} points 
     */
    constructor(points, id = Object.keys(Triangle.all).length + 1 /*`${distance3D(averagePoint(points[0],points[1],points[2]), camera.pos)}`*/) {
        this.points = points;
        this.id = id;
        this.color = `hsl(${hueBasedOnheight((this.points[0].posReal[1] + this.points[1].posReal[1] + this.points[2].posReal[1]) / 3)},100%,50%)`;
        Triangle.all[this.id] = this;
    }
    draw() {
        let region = new Path2D();
        let pointsOuttaBounds = 0;
        for (let i = 0; i < this.points.length; i++) {
            //if more than two points is outside bounds don't make triangle
            if (this.points[i].extra === 2 || this.points[i].posPix[2] < camera.pos[2]) {
                pointsOuttaBounds++;
                if (pointsOuttaBounds === 3) {
                    region.closePath();
                    return;
                }
            }
            region.lineTo(this.points[i].posPix[0], this.points[i].posPix[1]);
            //catch { stopAnimate(); console.log(this.points, i); break; }
        }
        region.closePath()
        ctx.fillStyle = this.color;
        ctx.fill(region);
    }
}

/**ONLY realPoints */
function rotateY(point, radians) {
    let x = point.posReal[0] * Math.cos(radians) + point.posReal[2] * Math.sin(radians);
    let z = point.posReal[2] * Math.cos(radians) - point.posReal[0] * Math.sin(radians);
    return [x, point.posReal[1], z];
}
function rotateY(x, y, z, radians) {
    let xl = x * Math.cos(radians) + z * Math.sin(radians);
    let zl = z * Math.cos(radians) - x * Math.sin(radians);
    return [xl, y, zl];
}
function rotateZ(x, y, z, radians) {
    let yl = y * Math.cos(radians) + x * Math.sin(radians);
    let xl = x * Math.cos(radians) - y * Math.sin(radians);
    return [xl, yl, z];
}
function rotateX(x, y, z, radians) {
    let zl = z * Math.cos(radians) + y * Math.sin(radians);
    let yl = y * Math.cos(radians) - z * Math.sin(radians);
    return [x, yl, zl];
}
/**ONLY realPoints */
function rotateYByPoint(point1, point2, radians) {
    let p = point1.posReal[0] - point2.posReal[0];
    let c = point1.posReal[2] - point2.posReal[2];

    let r = rotateY(p, point1.posReal[1], c, radians);

    return [r[0] + point2.posReal[0], point1.posReal[1], r[2] + point2.posReal[2]]
}
function rotateXByPoint(point1, point2, radians) {
    let p = point1.posReal[1] - point2.posReal[1];
    let c = point1.posReal[2] - point2.posReal[2];

    let r = rotateX(point1.posReal[0], p, c, radians);

    return [point1.posReal[0], r[1] + point2.posReal[1], r[2] + point2.posReal[2]]
}
function rotateZByPoint(point1, point2, radians) {
    let p = point1.posReal[1] - point2.posReal[1];
    let c = point1.posReal[0] - point2.posReal[0];

    let r = rotateZ(c, p, point1.posReal[2], radians);

    return [r[0] + point2.posReal[0], r[1] + point2.posReal[1], point1.posReal[2]]
}
function subtractCoords(coord1, coord2) {
    return [coord1[0] - coord2[0], coord1[1] - coord2[1], coord1[2] - coord2[2]]
}
function addCoords(coord1, coord2) {
    return [coord1[0] + coord2[0], coord1[1] + coord2[1], coord1[2] + coord2[2]]
}
function rotatePointbyPoint(x, y, z, u, v, w, theta) {
    let newx = (u * ((u * x) + (v * y) + (w * z)) * (1 - Math.cos(theta)) + ((u * u) + (v * v) + (w * w)) * (x * Math.cos(theta)) + Math.sqrt((u * u) + (v * v) + (w * w)) * ((v * z) - (w * y)) * Math.sin(theta)) / ((u * u) + (v * v) + (w * w));
    let newy = (v * ((u * x) + (v * y) + (w * z)) * (1 - Math.cos(theta)) + ((u * u) + (v * v) + (w * w)) * (y * Math.cos(theta)) + Math.sqrt((u * u) + (v * v) + (w * w)) * (-(u * z) + (w * x)) * Math.sin(theta)) / ((u * u) + (v * v) + (w * w));
    let newz = (w * ((u * x) + (v * y) + (w * z)) * (1 - Math.cos(theta)) + ((u * u) + (v * v) + (w * w)) * (z * Math.cos(theta)) + Math.sqrt((u * u) + (v * v) + (w * w)) * ((v * x) - (u * y)) * Math.sin(theta)) / ((u * u) + (v * v) + (w * w));
    return [newx, newy, newz];
}
function findCenter() {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < arguments.length; i++) {
        x += arguments[i].posReal[0];
        y += arguments[i].posReal[1];
        z += arguments[i].posReal[2];
    }
    //console.log(x, y, z, arguments.length);
    return [x / arguments.length, y / arguments.length, z / arguments.length]
}
function findCenter(points) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < points.length; i++) {
        x += points[i].posReal[0];
        y += points[i].posReal[1];
        z += points[i].posReal[2];
    }
    return [x / points.length, y / points.length, z / points.length]
}

function derivative(func, x, h = 0.0001) {
    return Number(((func(x + h) - func(x)) / h).toPrecision(5));
}
function partialDerivative2d(func, x, y, vari, h = 0.0001) {
    if (vari === 'x') {
        return Number(((func(x + h, y) - func(x, y)) / h).toPrecision(5));
    } else if (vari === 'y') {
        return Number(((func(x, y + h) - func(x, y)) / h).toPrecision(5));
    } else {
        throw new Error("Invalid variable: " + vari + ". Use 'x' or 'y'.");
    }
}

class Shape {
    constructor(points, display, lines = undefined, triangles = undefined, particles=null) {
        this.points = points;
        this.display = display;
        this.lines = lines;
        this.triangles = triangles;
        if (points) this.center = new Point(findCenter(this.points), false);
    }

    changeDisplay() {
        this.display = !this.display;

        this.p1.display = this.display;
        this.p2.display = this.display;
        this.p3.display = this.display;
        this.p4.display = this.display;

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].display = this.display;
        }
    }
    /**
     * @param {number} angle radians
     * @param {Point} point 
     */
    rotateByYPoint(angle, point) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].changeRealPos(subtractCoords(rotateYByPoint(this.points[i], point, angle), this.points[i].posReal));
        }
        if (this.lines) {
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i].updateLine();
            }
        }
    }
    /**
    * @param {number} angle radians
     * @param {Point} point 
    */
    rotateByXPoint(angle, point) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].changeRealPos(subtractCoords(rotateXByPoint(this.points[i], point, angle), this.points[i].posReal));
        }
        if (this.lines) {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines) this.lines[i].updateLine();
            }
        }
    }
    /**
     * @param {number} angle radians
     * @param {Point} point 
     */
    rotateByZPoint(angle, point) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].changeRealPos(subtractCoords(rotateZByPoint(this.points[i], point, angle), this.points[i].posReal));
        }
        if (this.lines) {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines) this.lines[i].updateLine();
            }
        }
    }
    /**
     * @param {number} angleX radians
     * @param {number} angleY radians
     * @param {number} angleZ radians
     * @param {Point} point 
     */
    rotateByPointXYZ(angleX, angleY, angleZ, point) {
        this.rotateByXPoint(angleX, point);
        this.rotateByYPoint(angleY, point);
        this.rotateByZPoint(angleZ, point);
    }

    deleteAllPoints() {
        for (let i = 0; i < this.points.length; i++) {
            delete Point.all[this.points[i].id];
        }
        this.points = [];
    }
    deleteAllLines() {
        for (let i = 0; i < this.lines.length; i++) {
            delete Line.all[this.lines[i].id];
        }
        this.lines = [];
    }
    deleteAllTriangles() {
        for (let i = 0; i < this.triangles.length; i++) {
            delete Triangle.all[this.triangles[i].id];
        }
        this.triangles = [];
    }
    deleteAllParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            delete Particle.all[this.particles[i].id];
        }
        this.particles = [];
    }
}

class Cube extends Shape {
    static all = {};
    /**
     * front (f), right (r) down (d), back (b), left(l), up (u)
     * @param {Point} p1 frd
     * @param {Point} p2 fld
     * @param {Point} p3 fru
     * @param {Point} p4 flu
     * @param {Point} p5 brd
     * @param {Point} p6 bld
     * @param {Point} p7 bru
     * @param {Point} p8 blu
     * @param {boolean} display 
     * @param {boolean} pointdisplay 
     * @param {string} color 
     */
    constructor(p1, p2, p3, p4, p5, p6, p7, p8, display = true, pointdisplay = false, color = `hsl(270,100%,50%)`, linewidth = 1) {
        super();
        this.points = [p1, p2, p3, p4, p5, p6, p7, p8];
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.p5 = p5;
        this.p6 = p6;
        this.p7 = p7;
        this.p8 = p8;
        this.display = display;
        this.pointdisplay = pointdisplay;
        this.color = color;
        this.linewidth = linewidth;
        let k = 0;
        let l = 0;
        let m = 0;
        for (let i = 0; i < this.points.length; i++) {
            k += this.points[i].posReal[0];
            l += this.points[i].posReal[1];
            m += this.points[i].posReal[2];
            this.points[i].display = pointdisplay;
        };
        this.center = new Point([k / 8, l / 8, m / 8], pointdisplay, color);

        this.lines = [
            new Line(p8, p7, display, color, linewidth),
            new Line(p8, p6, display, color, linewidth),
            new Line(p8, p4, display, color, linewidth),
            new Line(p7, p3, display, color, linewidth),
            new Line(p7, p5, display, color, linewidth),
            new Line(p1, p5, display, color, linewidth),
            new Line(p1, p3, display, color, linewidth),
            new Line(p1, p2, display, color, linewidth),
            new Line(p2, p6, display, color, linewidth),
            new Line(p2, p4, display, color, linewidth),
            new Line(p3, p4, display, color, linewidth),
            new Line(p6, p5, display, color, linewidth)
        ];

        this.id = Math.random();
        Cube.all[this.id] = this;
    }
}


let allLetters = {};

class Letter extends Shape {
    constructor(center, radius, rotate = true, display = true, color = 'hsl(100,100%,50%)', pointdisplay = false, id = `${Math.random() * 100}`) {
        super();
        this.center = new Point(center, pointdisplay, color);
        this.radius = -radius;
        this.display = display;
        this.color = color;
        this.points = [this.center];
        this.lines = [];
        this.pointdisplay = pointdisplay;
        this.doPixAndLines();
        this.id = id;
        this.rotate = rotate;
        allLetters[this.id] = this;
    }
    doPixAndLines() { }
}

//new Letter2([0, 0, -5], 1)

class Letter5 extends Letter {
    constructor(center, radius, rotate = true, display = true, color = 'hsl(100,100%,50%)', pointdisplay = false, id = `${Math.random() * 100}`) {
        super(center, radius, rotate, display, color, pointdisplay, id);
    }
    doPixAndLines() {
        this.points.push(new Point([this.center.posReal[0] + this.radius, this.center.posReal[1] + this.radius, this.center.posReal[2]], this.pointdisplay, this.color));
        this.points.push(new Point([this.center.posReal[0] - this.radius, this.center.posReal[1] + this.radius, this.center.posReal[2]], this.pointdisplay, this.color));
        this.points.push(new Point([this.center.posReal[0] + this.radius, this.center.posReal[1], this.center.posReal[2]], this.pointdisplay, this.color));
        this.points.push(new Point([this.center.posReal[0] - this.radius, this.center.posReal[1], this.center.posReal[2]], this.pointdisplay, this.color));
        this.points.push(new Point([this.center.posReal[0] - this.radius, this.center.posReal[1] - this.radius, this.center.posReal[2]], this.pointdisplay, this.color));
        this.points.push(new Point([this.center.posReal[0] + this.radius, this.center.posReal[1] - this.radius, this.center.posReal[2]], this.pointdisplay, this.color));

        this.lines.push(new Line(this.points[2], this.points[1], this.display, this.color, 2));
        this.lines.push(new Line(this.points[1], this.points[3], this.display, this.color, 2));
        this.lines.push(new Line(this.points[3], this.points[4], this.display, this.color, 2));
        this.lines.push(new Line(this.points[4], this.points[5], this.display, this.color, 2));
        this.lines.push(new Line(this.points[5], this.points[6], this.display, this.color, 2));

    }
}



class Particle extends Point {
    static all={}
    /**
     * 
     * @param {number[]} posReal 
     * @param {boolean} display 
     * @param {string} color 
     * @param {number} extra 
     * @param {number[]} velocity 
     * @param {number} typeOfEqu - 1 is Regular 3D equation: x+y; 2 is Parametric Surface has x&y; 3 is Vector Field; 4 is Parametric Curve
     * @param {string} equ - Parsed and split by dimensions (Use usableEquation(equation) if not parsed)
     */
    constructor(posReal, velocity = [0, 0, 0], equ, typeOfEqu, display, color = `hsl(${distance3D(posReal, [0, 0, 0])}*10,100%,20%)`, extra = null,) {
        super(posReal, display, color, extra);
        this.velocity = velocity;
        this.equ = equ
        this.radiusReal=1;
        this.radiusPix=((factor / 2) * (this.radiusReal) / (posReal[2] - camera.pos[2]));
        this.typeOfEqu = typeOfEqu;
        this.counter=0;
        Particle.all[this.id]=this;
    }
    update(dt){
        if (this.typeOfEqu === 3) { //vector field
            this.velocity = [
                this.equ[0].evaluate({ x: this.posReal[0], y: this.posReal[1], z: this.posReal[2] })*dt,
                this.equ[1].evaluate({ x: this.posReal[0], y: this.posReal[1], z: this.posReal[2] })*dt,
                this.equ[2].evaluate({ x: this.posReal[0], y: this.posReal[1], z: this.posReal[2] })*dt
            ]
        }
        else {
            throw new Error(`Particle:${this} has wrong typeOfEqu: ${this.typeOfEqu}.`);
        }
        super.changeRealPos(this.velocity);
    }
    draw() {
        this.update(0.005);
        super.draw();
    }
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

/*let hsphere = new HyperSphere([0, 0, 0], 5);
hsphere.makePoints(0);
let adder = 1 / 30;
setInterval(() => {
    hsphere.makePoints(adder-=1/30);
    hsphere.rotateByPointXYZ(-adder, adder, adder, hsphere.center)
}, 10)*/

/**@param {string} string */
function replaceAlll(string, replacer, replacewith) {
    let s = "";
    for (let i = 0; i < string.length; i++) {
        if (string.substring(i, i + replacer.length) == replacer) {
            s += replacewith;
            i += replacer.length - 1;
        }
        else s += string[i];
        //console.log(string.substring(i,i+replacer.length))
    }
    return s
}
/** converts user-input equations into usable js */
function usableEquation(expression) {
    return math.parse(expression).compile()
}

let r;
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
function grapherEqu(equation = 'Math.cos(x)-Math.sin(y)', boundradius = 5, adder = universalAdder) {

    if (!graphing) return;
    let equationJS = universalEquation = usableEquation(equation);
    //equation=replaceAlll(equation,'tan','Math.tan');

    //new Numbers(`${boundradius}`, [boundradius, 0, 0], 0.5, 0);
    //new Numbers(`${boundradius}`, [0, boundradius, 0], 0.5, 0);
    //new Numbers(`${boundradius}`, [0, 0, boundradius], 0.5, 0);
    max = boundradius;

    let points = [];
    let matrixPoints = [];
    //equation = equation.padStart(equation.length + 1, '-');

    if (r) {
        r.deleteAllLines();
        r.deleteAllPoints();
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

            if (rx === Math.floor((boundradius * 2) / adder)) break;
            matrixPoints[rx].push(c);

            if (rx === 0) break;
            let p1 = matrixPoints[rx - 1][ry + 1];
            let p2 = matrixPoints[rx - 1][ry];
            let p3 = matrixPoints[rx][ry - 1];

            if (p1) trianglest.push(new Triangle([p2, p1, c]));
            if (p3 && p2) {
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

    r = new Shape(points, true, liness);

    triangles = new Shape(points, true, undefined, trianglest);

    newCube(boundradius);

    //r.rotateByPointXYZ(Math.PI*2-rX,Math.PI*2-rY,Math.PI*2-rZ,cube.center);
    //cube.rotateByPointXYZ(-rX,-rY,-rZ,cube.center)
}
function grapherParametricEqu(pointsEq, boundradius = 5, adder = 0.1) {

    if (!graphing) return
    universalEquation = pointsEq;
    //pointsEq=replaceAlll(pointsEq,'tan','Math.tan');

    pointsEq = pointsEq.split(',')
    console.log(usableEquation(pointsEq[2]));
    let equationJS = [
        usableEquation(pointsEq[0]),
        usableEquation(pointsEq[1]),
        usableEquation(pointsEq[2])
    ];
    console.log(equationJS)
    //console.log(pointsEq)

    if (r) {
        r.deleteAllLines();
        r.deleteAllPoints();
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
                Math.abs(outputs[0]) > boundradius ||
                Math.abs(outputs[1]) > boundradius ||
                Math.abs(outputs[2]) > boundradius
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
    r = new Shape(points, true, liness);

    triangles = new Shape(points, true, undefined, trianglest);

    newCube(boundradius);
}
function rotateGraph(x, y, z) {
    rX += x; rY += y; rZ += z;
    r.rotateByPointXYZ(x, y, z, cube.center);

    cube.rotateByPointXYZ(x, y, z, cube.center);
}

function makeShorterTheMagnitude(pos1, pos2, shortener) {
    return [(pos1[0] - pos2[0]) / shortener + pos2[0],
    (pos1[1] - pos2[1]) / shortener + pos2[1],
    (pos1[2] - pos2[2]) / shortener + pos2[2]
    ]
}


let rX = 0; let rY = 0; let rZ = 0;

function vectorGraphing(equationX, equationY, equationZ, adder = 1) {
    //if (!vectorGraph) return;

    if (r) {
        r.deleteAllLines();
        r.deleteAllPoints();
    }
    if (triangles) {
        triangles.deleteAllPoints();
        triangles.deleteAllTriangles();
    }

    let equationJSX = usableEquation(equationX);
    let equationJSY = usableEquation(equationY);
    let equationJSZ = usableEquation(equationZ);

    max = 3;
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
                points.push(new Point(makeShorterTheMagnitude([x, y, z], [solvedX, solvedY, solvedZ], 1.1), true, 'rgba(255, 255, 255, 0.13)'));
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
    points.push(new Particle([0.1,0.1,0.1],[0,0,0],[
        equationJSX,
        equationJSY,
        equationJSZ
    ],3,true,"hsl(222, 100%, 77%)"));
    r = new Shape(points, true, lines, null);
    newCube(5);
}

function parametricLineGraphing(equationX, equationY, equationZ, adder = 0.01) {

    let equationJSX = usableEquation(equationX);
    let equationJSY = usableEquation(equationY);
    let equationJSZ = usableEquation(equationZ);

    if (r) {
        r.deleteAllLines();
        r.deleteAllPoints();
    }
    if (triangles) {
        triangles.deleteAllPoints();
        triangles.deleteAllTriangles();
    }

    boundary = 5;
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
    r = new Shape(points, true, lines);
    newCube(5);
}

//vectorGraphing('cos(x)','0','sin(x)');
grapherParametricEqu("(3+2*sin(x))*cos(y),(3+2*sin(x))*sin(y),2*cos(x)", 5, 0.2);
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
        if (vectorGraph) r.rotateByPointXYZ(-(e.y - postition[1]) / 300, -(e.x - postition[0]) / 300, 0, r.center)
        if (graphing || vectorGraph) {
            for (let i in allLetters) {
                if (r) {
                    if (allLetters[i].rotate) allLetters[i].rotateByPointXYZ(-(e.y - postition[1]) / 300, -(e.x - postition[0]) / 300, 0, r.center)
                }
            }
        }
        postition = [e.x, e.y]
    }
})


function rndmFlr(num) {
    return Math.floor(Math.random() * num);
}

function xroot(x, y) {
    return Math.pow(y, 1 / x);
}
function trueRandom() {
    return Math.random() < 0.5 ? Math.random() : -Math.random()
}
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
