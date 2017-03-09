'use strict';

require('classlist-polyfill');
require('./style.css');

const createElement = require('./element-helper');
const layout = require('./layout.html');
const nextButton = require('./svgs/next.svg');
const prevButton = require('./svgs/prev.svg');
const playButton = require('./svgs/play.svg');
const listButton = require('./svgs/play-list.svg');
const Spectral = require('./spectral');
const Oscillator = require('./oscillator');

class Player {
    get nowPlaying() {
        return this.playList[this.currentTrack];
    }

    initUI() {
        let $ = (selector) => document.querySelector(selector);
        let $$ = (selector) => Array.from(document.querySelectorAll(selector));
        this.element.innerHTML = layout;

        let progress = $('.progress-container');

        $('.prev-button').innerHTML = prevButton;
        $('.prev-button').addEventListener('click', e => { this.prevTrack(); })
        $('.next-button').innerHTML = nextButton;
        $('.next-button').addEventListener('click', e => { this.nextTrack(); })
        $('.play-button').innerHTML = playButton;
        $('.play-button').addEventListener('click', e => { this.domAudio.paused ? this.play() : this.pause() })
        $('.list-button').innerHTML = listButton;
        progress.addEventListener('click', event => {
            event.stopPropagation();
            let { left } = progress.getBoundingClientRect();
            this.domAudio.currentTime = this.domAudio.duration * (event.clientX - left) / progress.clientWidth;
            this.updateProgress();
        })
        $$('.nano-player .album-face, .nano-player .blurbg').forEach(el => {
            el.style.backgroundImage = `url(${this.nowPlaying.cover})`;
        });
        this.uiCollection = {
            songTitle: $('.nano-player .title'),
            songArtist: $('.nano-player .artist'),
            cover: $('.nano-player .album-face'),
            bg: $('.nano-player .blurbg'),
            progressBar: $('.progress-indicater')
        }
        this.lrcNode = $('.lyrics');
        this.visualNode = $('.visualizer');
        this.progressBar = $('.progress-indicater');
    }

    initAudio() {
        // The <audio> element.
        this.domAudio = document.createElement('AUDIO');
        this.domAudio.crossOrigin = 'anonymous';
        this.element.appendChild(this.domAudio);

        try {
            // AudioSource and AudioAnalyser
            this.audioContext = new AudioContext();
            this.audioSource = this.audioContext.createMediaElementSource(this.domAudio);
            this.audioAnalyser = this.audioContext.createAnalyser();
            this.audioAnalyser.fftSize = this.fftSize || this.audioAnalyser.fftSize;
            this.audioSource.connect(this.audioAnalyser);
            this.audioSource.connect(this.audioContext.destination);
        }
        catch(ex) {
            this.audioContext = null;
        }

        this.domAudio.addEventListener('ended', () => {
            this.nextTrack();
        });
    }

    initLyrics() {
        if (!this.showLyrics) {
            return;
        }

        // We need this function to be an arrow function, as we need this pointing to 
        // the whole class but not the HTMLAudioElement.
        // Also, the reason for not using anonymous lambda function is that 
        // cleatInterval would treat them as different event handler.
        this.updateLyrics = (immediateUpdate = true) => {
            try {
                let currentOffset = this.domAudio.currentTime * 1000;
                let lastLines = this.lyrics.lines;

                if (this.lyrics.table.length == this.lyrics.lines) clearInterval(this.intervals.lyrics);
                while (this.lyrics.table[this.lyrics.lines - 1] && this.lyrics.table[this.lyrics.lines - 1].offset > currentOffset) {
                    this.lyrics.lines--;
                }
                while (this.lyrics.table[this.lyrics.lines].offset <= currentOffset) {
                    if (immediateUpdate) {
                        this.lrcNode.innerText = this.lyrics.table[this.lyrics.lines].lyric;
                        this.lyrics.lines++;
                    }
                    else {
                        this.lrcNode.style.opacity = 0.5;
                        this.lyrics.lines++;
                        setTimeout(() => {
                            this.lrcNode.innerText = this.lyrics.table[this.lyrics.lines - 1].lyric;
                            this.lrcNode.style.opacity = 1;
                        }, 50)
                    }
                }
            } catch (e) {
                clearInterval(this.intervals.lyrics);
            }
        }
        if (!this.nowPlaying.lrc) {
            if (this.lyrics.hasListener) {
                this.domAudio.removeEventListener('seeking', this.updateLyrics);
            }
            // No lyric found, no need to go further.
            this.lyrics = {};
            this.lrcNode.innerText = '♪～(￣ε￣)'
            return;
        }
        // Storage the parsed lyrics.
        this.lyrics.table = [];
        // Part of lines with undefined content.
        let pending = [];
        this.nowPlaying.lrc.split('[').forEach((item, off) => {
            this.nowPlaying.lrcOffset = this.nowPlaying.lrcOffset ? this.nowPlaying.lrcOffset : 0;
            // item -> [%d:%d.%d]%s
            //          1  2  3  4
            let f = res => {
                return (res[1] * 60 + res[2] * 1) * 1000 + res[3].substr(0, 2) * 10 + this.nowPlaying.lrcOffset;
            };

            if (item == '') // Ignore the empty lines.
                return;
            if (item[0] != '[') // Recover the line.
                item = '[' + item;

            if (!/\[(\d+):(\d+).(\d+)\](.*)/.test(item))
                return;
            let lyric = item.match(/\[(\d+):(\d+).(\d+)\](.*)/);
            if (lyric[4] == '') { // Content unedfined, push current offset into pending list.
                pending.push(off);
                let offset = f(lyric);
                this.lyrics.table.push({
                    offset: offset,
                    lyric: '',
                });
                return;
            }
            let offset = f(lyric);
            this.lyrics.table.push({ // Pushing parsed result into the lyrics table.
                offset: offset,
                lyric: lyric[4],
            });
            while (pending.length > 0) { // Filling the lines which content is undefined.
                let off = pending.shift() - 1;
                this.lyrics.table[off].lyric = lyric[4];
            }
        });
        this.lyrics.table.sort((a, b) => { // Sort the table by offset.
            return a.offset - b.offset;
        })
        if (!this.lyrics.hasListener) {
            this.domAudio.addEventListener('seeking', this.updateLyrics)
            this.lyrics.hasListener = true;
        }
        this.lyrics.lines = 0;
    }

    updateProgress() {
        if (this.showProgressBar)
            this.progressBar.style.left = 100 * Math.min((this.domAudio.currentTime / this.domAudio.duration), 1) + '%';
    }

    flushStatus() {
        if (this.domAudio.paused) {
            //this.uiCollection.playButton.innerHTML = playButtonSvg;
        } else {
            //this.uiCollection.playButton.innerHTML = pauseButtonSvg;
        }
    }

    play() {
        this.initLyrics();
        if (this.showLyrics) {
            this.intervals.lyrics = setInterval(() => { this.updateLyrics(false) }, 20);
        }
        this.intervals.progress = setInterval(() => { this.updateProgress() }, 200);
        this.domAudio.play();
        this.flushStatus();
    }

    pause() {
        clearInterval(this.intervals.lyrics);
        // this.spectral.pause();
        this.domAudio.pause();
        this.flushStatus();
    }

    nextTrack() {
        this.switchTo(this.currentTrack + 1);
    }

    prevTrack() {
        this.switchTo(this.currentTrack - 1);
    }

    reinit() {
        // UI part
        this.uiCollection.songTitle.innerHTML = this.nowPlaying.title ? this.nowPlaying.title : '未知歌曲';
        this.uiCollection.songArtist.innerHTML = this.nowPlaying.artist ? this.nowPlaying.artist : '未知艺术家';
        this.uiCollection.progressBar.style.left = '0';
        this.uiCollection.cover.style.backgroundImage = `url('${this.nowPlaying.cover}')`;
        this.uiCollection.bg.style.backgroundImage = `url('${this.nowPlaying.cover}')`;
        // this.playListElem.forEach((item, offset) => {
        //     if (offset == this.currentTrack) {
        //         item.classList.add('now_playing');
        //     }
        //     else {
        //         item.classList.remove('now_playing');
        //     }
        // });
        // Audio part
        this.domAudio.src = this.nowPlaying.url;

        // Lyrics
        this.initLyrics();

        clearInterval(this.intervals.songTitleMarq);
        this.uiCollection.songTitle.style.marginLeft = '';
        if (this.uiCollection.songArtist.clientWidth < this.uiCollection.songTitle.clientWidth) {
            // We do not hope that the overflow part is really hidden. Fix it.
            let songTitle = this.uiCollection.songTitle;
            songTitle.innerText = songTitle.innerText + '        ';
            let actualWidth = songTitle.clientWidth;
            let mleft = 40;
            songTitle.innerText = songTitle.innerText + songTitle.innerText;
            let renderMarq = () => {
                if (mleft < 0)
                    songTitle.style.marginLeft = `${mleft}px`;
                mleft -= 0.5;
                if (mleft + actualWidth <= 0) {
                    mleft = 40;
                }
            };
            this.intervals.songTitleMarq = setInterval(renderMarq, 20);
        }

        // Clear the remaining lyric.
        this.lrcNode.innerHTML = '';

        // flush Status
        this.flushStatus();
    }

    constructor(params) {
        // Load all the preferences.
        this.element = params.parent;
        this.style = params.style || {};
        this.playList = params.playList;
        this.barCount = params.maxBars ? params.maxBars : 128;
        this.logarithmic = params.logarithmic ? params.logarithmic : false;
        this.fftSize = params.fftSize;
        this.autoStart = params.autoStart ? params.autoStart : false;
        this.showVisualizer = params.showVisualizer ? params.showVisualizer : true;
        this.showProgressBar = params.showProgressBar ? params.showProgressBar : true;;
        this.enableBlur = typeof params.enableBlur !== 'undefined' ? params.enableBlur : true;
        this.showLyrics = params.showLyrics ? params.showLyrics : false;
        this.dropRate = typeof params.dropRate !== 'undefined' ? params.dropRate : 1;
        this.linearRegion = params.linearRegion ? params.linearRegion : [0, 1];
        this.renderMode = params.renderMode || 'canvas';
        this.showBuoy = params.showBuoy ? params.showBuoy : false;

        // Initialize some global variables
        this.currentTrack = 0;
        this.intervals = {};
        this.lyrics = {};

        // Initialize components.
        this.initUI();
        this.initAudio();
        this.initLyrics();

        // Immediate fill the data of now playing song.
        this.reinit();

        if (this.showVisualizer && this.audioContext) {
            this.visualizer = new Spectral({
                audio: this.domAudio,
                audioAnalyser: this.audioAnalyser,
                canvas: this.visualNode,
                logarithmic: this.logarithmic,
                bandCount: this.barCount,
                linearRegion: this.linearRegion,
                showBuoy: this.showBuoy,
                fps: 50,
            });
            this.visualizer.start();
        }

        // let's rock and roll.
        if (this.autoStart)
            this.switchTo(0, true)
    }

    switchTo(track, isFirst) {
        let isEnd = false;
        this.pause();
        if (this.nowPlaying.onfinish && !isFirst)
            this.nowPlaying.onfinish(this);
        this.currentTrack = track;
        if (this.currentTrack < 0)
            this.currentTrack += this.playList.length;
        if (this.currentTrack === this.playList.length) {
            isEnd = true;
        }
        this.currentTrack %= this.playList.length;
        this.reinit();
        if (this.nowPlaying.onstart)
            this.nowPlaying.onstart(this);
        isEnd || this.play();
        this.flushStatus();
    }
}

window.Player = Player;