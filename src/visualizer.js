'use strict';

// Abstract class of visualizer
class Visualizer {
    constructor(param) {
        // Check if audio element exists
        if (typeof param === undefined || typeof param.audio === undefined) {
            throw 'Missing parameter.'
        }
        if (typeof param.audioAnalyser === 'undefined' || !param.audioAnalyser instanceof AnalyserNode) {
            throw 'audioAnalyser is required.'
        }

        this.domAudio = param.audio;
        this.audioAnalyser = param.audioAnalyser;
    }

    start() {
        // TODO:
    }

    pause() {
        // TODO:
    }

    dispose() {
        // TODO:
    }
}

module.exports = Visualizer;