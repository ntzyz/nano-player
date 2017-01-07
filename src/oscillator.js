'use strict';

let Visualizer = require('./visualizer');

class Oscillator extends Visualizer {
    constructor(param) {
        super(param);

        // Check if HTMLElement exist
        if (typeof param.canvas === 'string') {
            this.canvas = document.querySelector(param.canvas);
            if (!this.canvas instanceof HTMLElement) {
                throw 'Unable to get HTMLElement';
            }
        }
        else if (param.canvas instanceof HTMLElement) {
            this.canvas = param.canvas;
        }
        else {
            throw 'Unknown type of element';
        }

        // Check if canvas is really a <canvas>
        if (!this.canvas.tagName === 'CANVAS') {
            throw 'Element must be a canvas';
        }

        // Initialize
        this.dataArray = new Uint8Array(this.audioAnalyser.fftSize);

        // Fix HiDPI support
        let rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;

        // Canvas
        this.canvasContext = this.canvas.getContext('2d');
        this.canvasFillStyle = param.fillStyle || 'rgba(255, 255, 255, 0.3)';

        // Some other options
        this.fps = param.fps || 50;
        this.intervalId = null;

        // Modern browser!
        this.initialized = true;
    }

    start() {
        if (this.intervalId !== null)
            return;
        this.intervalId = setInterval(() => {
            this.renderFrame();
        }, 1000 / this.fps);
    }

    pause() {
         clearInterval(this.intervalId);
         this.intervalId = null;
    }

    dispose() {
        this.pause();
    }

    renderFrame() {
        if (!this.initialized)
            return;

        this.audioAnalyser.getByteTimeDomainData(this.dataArray);

        let tempValue = []; // FIXME: rename this variable.
        let canvasContext = this.canvasContext;
        this.canvasContext.strokeStyle ='rgb(255, 255, 255)';
        canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        canvasContext.beginPath();

        this.dataArray.forEach((data, offset) => {
            if (offset === 0) 
                canvasContext.moveTo(offset * this.canvas.width / this.dataArray.length, this.canvas.height / 2 - (data / 192 - 1) * (this.canvas.height / 2));
            else
                canvasContext.lineTo(offset * this.canvas.width / this.dataArray.length, this.canvas.height / 2 - (data / 192 - 1) * (this.canvas.height / 2));
        }) 

        canvasContext.stroke();
    }
}

module.exports = Oscillator;
