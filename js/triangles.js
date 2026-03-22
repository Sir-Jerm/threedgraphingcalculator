import { ctx, camera } from "./scene.js";
import { Point } from "./points.js";

function hueBasedOnheight(height) {
    return height * 30;
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

export {Triangle}
