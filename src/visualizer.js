'use strict';

// Abstract class of visualizer
class Visualizer {
    constructor(param) {
        // Check if audio element exists
        if (typeof param === undefined || typeof param.audio === undefined) {
            throw 'Missing parameter.'
        }

        this.domAudio = param.audio;
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