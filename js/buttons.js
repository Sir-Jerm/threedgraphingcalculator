import { max } from "../main.js";
import { parametricLineGraphing, grapherParametricEqu, grapherEqu, vectorGraphing, setUniversalAdder, universalAdder, universalEquation } from "./calculator.js";
import { ctx } from "../main.js";

document.querySelector('#enterGPE').addEventListener('click', () => {
    grapherParametricEqu(document.getElementById('points').value, 5, 0.2)
})
document.querySelector('#enterVE').addEventListener('click', () => {
    let inputs = document.getElementById('vectors').value.split(',')

    vectorGraphing(inputs[0], inputs[1], inputs[2], 1)
})
document.querySelector('#enterGE').addEventListener('click', () => {
    grapherEqu(document.getElementById('equ').value, max, universalAdder)
})
document.querySelector('#enterPLE').addEventListener('click', () => {
    let inputs = document.getElementById('pointsPLE').value.split(',')
    parametricLineGraphing(inputs[0],inputs[1],inputs[2]);
})
document.querySelector('#enterBR').addEventListener('click', () => {
    max = Number(document.getElementById('boundradius').value);
    grapherEqu(`${universalEquation}`, max);
})
document.querySelector('#enterD').addEventListener('click', () => {
    setUniversalAdder(Number(document.querySelector('#adder').value));
    grapherEqu(`${universalEquation}`, max, universalAdder);
})
