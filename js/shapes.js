import { Point } from "./points.js";
import { Line } from "./lines.js";
import { Triangle } from "./triangles.js";

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

class Shape {
    /**
     * 
     * @param {Point[]} points 
     * @param {boolean} display 
     * @param {Line[]} lines 
     * @param {Triangle} triangles 
     * @param {null} particles - dont use
     */
    constructor(points, display, lines = undefined, triangles = undefined, particles=null) {
        this.points = points;
        this.display = display;
        this.lines = lines;
        this.triangles = triangles;
        if (Array.isArray(points)) this.center = new Point(findCenter(this.points), false);
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
            // if(this.points[i]) this.points[i].changeRealPos(
            //     subtractCoords(
            //         rotateYByPoint(
            //             this.points[i], point, angle
            //         ), this.points[i].posReal
            //     )
            // );
            if(this.points[i]) this.points[i].setRealPos(rotateYByPoint(this.points[i],point,angle));
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
            // if(this.points[i]) this.points[i].changeRealPos(
            //     subtractCoords(
            //         rotateYByPoint(
            //             this.points[i], point, angle
            //         ), this.points[i].posReal
            //     )
            // );
            if(this.points[i]) this.points[i].setRealPos(rotateXByPoint(this.points[i],point,angle));
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
            if(this.points[i]) this.points[i].setRealPos(rotateZByPoint(this.points[i],point,angle));
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
        //console.log(this.points);
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
    /**deleteAllParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            delete Particle.all[this.particles[i].id];
        }
        this.particles = [];
    }*/
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
        this.center = new Point([k / 8 || 0, l / 8 || 0, m / 8 || 0], pointdisplay, color);
        //console.log(this.center, k/8, l/8, m/8);

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

export {Shape, Cube, Letter, Letter5, allLetters}
