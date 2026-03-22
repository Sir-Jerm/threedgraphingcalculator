import { ctx } from "./scene.js";

function hueBasedOnheight(height) {
    return height * 30;
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

function averageOf3d(array) {
    return (array[0] + array[1] + array[2]) / 3
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

export {Line}
