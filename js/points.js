import { ctx, factor, camera, cw } from "./scene.js";
import { determineNewCoords } from "./metric.js";

function calculationForRealToPix(x, y, z) {
    return [(factor * (x - camera.pos[0]) / (z - camera.pos[2])) + (cw / 2),
    (factor * (y - camera.pos[1]) / (z - camera.pos[2])) + (10 * cw / 45)];
}
function realPointToPixPoint(pos) {
    let p = 0.1 + camera.pos[2] - pos[2];
    if (pos[2] > camera.pos[2]) return calculationForRealToPix(pos[0], pos[1], pos[2]);
    else return calculationForRealToPix(pos[0], pos[1], pos[2] + p);
}
function addCoords(coord1, coord2) {
    return [coord1[0] + coord2[0], coord1[1] + coord2[1], coord1[2] + coord2[2]]
}

/**
 * @param {number[]} pos1
 * @param {number[]} pos2
 */
function distance3D(pos1, pos2) {
    return Math.sqrt(((pos1[0] - pos2[0]) ** 2) + ((pos1[1] - pos2[1]) ** 2) + ((pos1[2] - pos2[2]) ** 2));
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
        this.posReal = determineNewCoords(posReal[0],posReal[1],posReal[2]);
        this.posPix = realPointToPixPoint(this.posReal);
        //this.posPix = distanceFunctionDistortion(posReal);
        this.radiusReal = 0.001;
        this.radiusPix = ((factor / 2) * (this.radiusReal) / (this.posReal[2] - camera.pos[2]));
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
    setRealPos(pos){
        this.posReal=pos;
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

export { Point }
