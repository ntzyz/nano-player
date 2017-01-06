'use strict';

const Visualizer = require('./visualizer');

class Spectral extends Visualizer {
    constructor(param) {
        super(param);

        // Check if HTMLElement exist
        if (typeof param.canvas === 'string') {
            this.canvas = document.querySelector(param.el);
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
        try {
            // AudioSource and AudioAnalyser
            this.audioContext = new AudioContext();
            this.audioSource = this.audioContext.createMediaElementSource(this.domAudio);
            this.audioAnalyser = this.audioContext.createAnalyser();
            this.audioAnalyser.fftSize = param.fftSize || this.audioAnalyser.fftSize;
            this.audioSource.connect(this.audioAnalyser);
            this.audioSource.connect(this.audioContext.destination);
            this.freq = new Uint8Array(this.audioAnalyser.frequencyBinCount);

            // Fix HiDPI support
            let rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio * 2;
            this.canvas.height = rect.height * window.devicePixelRatio * 2;

            // Canvas
            this.canvasContext = this.canvas.getContext('2d');
            this.canvasFillStyle = param.fillStyle || 'rgba(255, 255, 255, 0.3)';

            // Some other options
            this.logarithmic = param.logarithmic || false;
            this.bandCount = param.bandCount || 32;
            this.linearRegion = param.linearRegion || [0, 0.75];
            this.fps = param.fps || 50;
            this.showBuoy = param.showBuoy || false;
            this.intervalId = null;
            this.showingBuoy = new Array(this.bandCount).fill(this.canvas.height);

            // Modern browser!
            this.initialized = true;
        } catch(ex) {
            console.log('Unable to finish initialization due to this ancient browser.' + ex);
            this.initialized = false;
        }
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
        // TODO:
    }

    renderFrame() {
        if (!this.initialized)
            return;

        this.audioAnalyser.getByteFrequencyData(this.freq);

        let tempValue = []; // FIXME: rename this variable.
        let canvasContext = this.canvasContext;
        canvasContext.fillStyle = this.canvasFillStyle;
        canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        canvasContext.beginPath();
        canvasContext.moveTo(0, this.canvas.height);

        if (this.logarithmic) {
            for (let i = 0; i != this.bandCount; ++i) {
                let sum = 0, cnt = 0;
                let width = Math.log(this.audioAnalyser.frequencyBinCount) / this.bandCount;

                for (let j = Math.exp((i - 1) * width); j <= Math.exp((i) * width); ++j) {
                    sum += this.freq[Math.ceil(j)];
                    cnt++;
                }
                let value = sum / cnt;
                tempValue[i] = value;
                this.updateBand(i, value);
            }
        }
        else {
            let width = (this.linearRegion[1] - this.linearRegion[0]) * this.audioAnalyser.frequencyBinCount;
            for (let i = 0; i < this.bandCount; ++i) {
                let sum = 0;
                for (let j = 0; j < width / this.bandCount; ++j) {
                    let offset = i * (width / this.bandCount) + j + this.audioAnalyser.frequencyBinCount * this.linearRegion[0];
                    sum += this.freq[Math.ceil(offset)];
                }
                let value = sum / Math.ceil(width / this.bandCount);
                tempValue[i] = value;
                this.updateBand(i, value);
            }
        }
        canvasContext.lineTo(this.canvas.width, this.canvas.height);
        canvasContext.lineTo(0, this.canvas.height);
        canvasContext.fill();

        if (this.showBuoy) {
            this.canvasContext.strokeStyle ='rgba(255, 255, 255, 1)';
            this.canvasContext.beginPath();
            for (let i = 0; i < this.bandCount; ++i) {
                this.updateBuoy(i, tempValue[i]);
            }
            this.canvasContext.stroke();
        }

    }

    updateBand(offset, value) {
        let width = this.canvas.width / this.bandCount;
        value /= 256;
        this.canvasContext.lineTo(Math.ceil(offset * width), Math.ceil((1 - value) * this.canvas.height));
        this.canvasContext.lineTo(Math.ceil((offset + 1) * width), Math.ceil((1 - value) * this.canvas.height));
    }

    updateBuoy(offset, value) {
        let width = this.canvas.width / this.bandCount;
        value /= 256;
        let height = Math.ceil((1 - value) * this.canvas.height);
        if (this.showingBuoy[offset] > height)
            this.showingBuoy[offset] = height;
        else {
            let dt = height - this.showingBuoy[offset];
            this.showingBuoy[offset] += dt/10;            
        }
        this.canvasContext.moveTo(Math.ceil(offset * width), Math.ceil(this.showingBuoy[offset]) - 1);
        this.canvasContext.lineTo(Math.ceil((offset + 1) * width), Math.ceil(this.showingBuoy[offset]) - 1);
    }

}

module.exports = Spectral;