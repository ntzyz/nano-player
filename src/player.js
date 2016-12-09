'use strict';

require('classlist-polyfill');
require('./style.css');

let createElement = require('./element-helper');

class Player {
    get nowPlaying() {
        return this.playList[this.currentTrack];
    }

    initUI() {
        this.element.style.position = 'relative';
        this.element.style.width = this.style.width || '300px';
        this.element.style.height = this.style.height || '300px';
        this.element.style.overflow = 'hidden';
        this.element.classList.add('__nano_player__');

        this.uiStatus = 'unfocus';
        this.uiCollection = {};
        this.showingFreq = [];

        let container = createElement({
            tagName: 'div',
            classList: ['cover'],
            style: {
                overflow: 'hidden',
            }
        });

        // Container for title, artist and lyrics.
        let mediainfo = createElement({
            tagName: 'div',
            classList: ['cover', 'hidden'],
            style: {
                zIndex: 3,
            },
        });

        let songTitle = createElement({
            tagName: 'h1',
            classList: ['songTitle'],
        });

        let songArtist = createElement({
            tagName: 'h2',
            classList: ['songArtist'],
        });

        let lyrics = createElement({
            tagName: 'div',
            classList: ['lyrics'],
        });

        // Container for control buttons, progress bar and visualizer
        let controller = createElement({
            tagName: 'div',
            classList: ['cover', 'hidden'],
            style: {
                zIndex: '3',
                margin: '0 auto',
            }
        });

        let controls = createElement({
            tagName: 'div',
            classList: ['controls'],
        });

        let playButton = createElement({
            tagName: 'i',
            classList: ['fa', 'fa-play', 'controlButton'],
            attr: {
                'aria-hidden': true,
            },
            style: {
                fontSize: '3em',
                marginLeft: '10%',
                marginRight: '10%',
            },
            eventListener: {
                click: event => {   // play <-> pause
                    if (this.uiStatus == 'unfocus') // Button is hidden, ignore this click event.
                        return;
                    event.stopPropagation(); // Stop parent nodes from getting the click event.
                    if (this.domAudio.paused) {
                        this.play();
                    } else {
                        this.pause();
                    }
                }
            }
        });

        let nextButton = createElement({
            tagName: 'i',
            classList: ['fa', 'fa-forward', 'controlButton'],
            attr: {
                'aria-hidden': true,
            },
            style: {
                fontSize: '3em',
            },
            eventListener: {
                click: event => { // Same as above.
                    if (this.uiStatus == 'unfocus')
                        return;
                    event.stopPropagation();
                    this.nextTrack();
                }
            }
        });

        let prevButton = createElement({
            tagName: 'i',
            classList: ['fa', 'fa-backward', 'controlButton'],
            attr: {
                'aria-hidden': true,
            },
            style: {
                fontSize: '3em',
            },
            eventListener: {
                click: event => {
                    if (this.uiStatus == 'unfocus')
                        return;
                    event.stopPropagation();
                    this.prevTrack();
                }
            }
        });

        let progress = createElement({
            tagName: 'div',
            classList: ['progress'],
            style: {
                overflow: 'hidden',
            },
            eventListener: {
                click: event => {
                    if (this.uiStatus == 'unfocus')
                        return;
                    event.stopPropagation();
                    let { left } = progress.getBoundingClientRect();
                    this.domAudio.currentTime = this.domAudio.duration * (event.clientX - left) / progress.clientWidth;
                    this.renderVisualizer();
                }
            }
        });

        let progressInner = createElement({
            tagName: 'div',
            style: {
                height: '100%',
                backgroundColor: 'white',
            }
        });
        progress.appendChild(progressInner);

        let visualizer = createElement({
            tagName: 'canvas',
            classList: ['visualizer'],
        });

        let playListButton = createElement({
            tagName: 'i',
            classList: ['fa', 'fa-list-ul', 'navButton'],
            attr: {
                'aria-hidden': true,
            },
            style: {
                position: 'absolute',
                bottom: '3%',
                right: '3%',
                fontSize: '1.2em',
                color: 'white',
            },
            eventListener: {
                click: event => {
                    if (this.uiStatus == 'unfocus')
                        return;
                    event.stopPropagation();
                    container.classList.add('outside-left');
                    playList.classList.remove('outside-right');
                }
            }
        });

        // Overlay for album cover, for bluring and darking
        let overlay = createElement({
            tagName: 'div',
            classList: ['cover'],
            style: {
                zIndex: '2',
            }
        });

        // Album cover.
        let cover =  createElement({
            tagName: 'div',
            classList: ['cover'],
            style: {
                zIndex: '1',
                backgroundSize: 'cover'
            }
        });

        // Legacy album cover.
        let legacyCover = createElement({
            tagName: 'div',
            classList: ['cover'],
            innerHTML: require('./defaultcover'),
            style: {
                backgroundColor: 'white',
            }
        });

        // PlayList view.
        let playList = createElement({
            tagName: 'div',
            classList: ['cover', 'outside-right', 'playlist'],
            style: {
                backgroundColor: 'black'
            }
        });

        let headbar = createElement({
            tagName: 'div',
            parent: playList,
            classList: ['headbar'],
        });

        let returnButton = createElement({
            tagName: 'i',
            parent: headbar,
            classList: ['fa', 'fa-chevron-left', 'navButton'],
            attr: {
                'aria-hidden': true,
            },
            style: {
                position: 'absolute',
                left: '3%',
                fontSize: '1.2em',
                lineHeight: '44px',
                color: 'white',
            },
            eventListener: {
                click: event => {
                    if (this.uiStatus == 'unfocus')
                        return;
                    event.stopPropagation();
                    container.classList.remove('outside-left');
                    playList.classList.add('outside-right');
                }
            }
        });

        let titleText = createElement({
            tagName: 'span',
            parent: headbar,
            style: {
                lineHeight: '44px',
            },
            innerHTML: '播放列表'
        });

        let listContainer = createElement({
            tagName: 'div',
            classList: ['listContainer'],
            parent: playList
        });

        let listWrapper = createElement({
            tagName: 'div',
            parent: listContainer,
        });

        this.playListElem = [];
        for (let offset in this.playList) {
            let item = document.createElement('DIV');
            item.className = 'list';
            item.offset = offset;

            let face = document.createElement('DIV');
            face.className = 'face';
            face.style.backgroundImage = `url('${this.playList[offset].cover}')`;


            let title = document.createElement('DIV');
            title.className = 'title';
            title.innerHTML = `${this.playList[offset].title} <br /> <span style="font-size: 0.8em">${this.playList[offset].artist}</span>`;

            item.appendChild(face);
            item.appendChild(title);

            item.addEventListener('click', () => {
                this.switchTo(item.offset);
            })

            listWrapper.appendChild(item);
            this.playListElem.push(item);
        }


        // Append all elements to their parent elements.
        mediainfo.appendChild(songArtist);
        mediainfo.appendChild(songTitle);
        mediainfo.appendChild(lyrics);
        container.appendChild(mediainfo);
        controls.appendChild(prevButton);
        controls.appendChild(playButton);
        controls.appendChild(nextButton);
        controller.appendChild(controls);
        if (this.showProgressBar)
            controller.appendChild(progress);
        controller.appendChild(visualizer);
        controller.appendChild(playListButton);
        container.appendChild(controller);
        container.appendChild(overlay);
        container.appendChild(cover);
        container.appendChild(legacyCover);

        this.element.appendChild(container);
        this.element.appendChild(playList);

        // Fix some style issue.
        songTitle.style.minWidth = this.element.clientWidth + 'px';
        if (this.element.clientWidth < songTitle.clientWidth) {
            // We do not hope that the overflow part is really hidden. Fix it.
            let actualWidth = songTitle.clientWidth;
            let mleft = 0;
            songTitle.innerText = songTitle.innerText + '    ' + songTitle.innerText;
            let renderMarq = () => {
                songTitle.style.marginLeft = `${mleft}px`;
                mleft -= 1;
                if (mleft + actualWidth <= 0) {
                    mleft = 0;
                }
            };
            this.intervals.songTitleMarq = setInterval(renderMarq, 20);
        }

        // Switching from showing controllers, mediainfo, visualizer or not.
        container.addEventListener('click', event => {
            if (this.uiStatus == 'unfocus') {
                if (this.enableBlur)
                    [cover, legacyCover].forEach(elem => elem.classList.add('blur'));

                [playButton, prevButton, nextButton, progress].forEach(elem => {
                    elem.classList.add('pointer')
                })
                overlay.style.backgroundColor = 'rgba(0, 0, 0, .5)';
                [mediainfo, controller].forEach(elem => {
                    elem.classList.remove('hidden');
                })

                this.uiStatus = 'focus';
            } else {
                if (this.enableBlur)
                    [cover, legacyCover].forEach(elem => elem.classList.remove('blur'));

                [playButton, prevButton, nextButton, progress].forEach(elem => {
                    elem.classList.remove('pointer')
                })
                overlay.style.backgroundColor = '';
                [mediainfo, controller].forEach(elem => {
                    elem.classList.add('hidden');
                })

                this.uiStatus = 'unfocus';
            }
        });
        // Save some useful elements to our player's object.
        this.visualNode = visualizer;
        this.lrcNode = lyrics;
        this.progressBar = progressInner;

        let visualizerRect = visualizer.getBoundingClientRect();
        visualizer.width = visualizerRect.width;
        visualizer.style.width = `${visualizerRect.width}px`;
        visualizer.height = visualizer.style.height = visualizerRect.height;
        visualizer.style.height = `${visualizerRect.height}px`;

        // Save all the elements for further use.
        this.uiCollection = {
            container,      mediainfo,      songTitle,
            songArtist,     lyrics,         controller,
            controls,       playButton,     nextButton,
            prevButton,     progress,       progressInner,
            visualizer,     overlay,        cover,
            legacyCover
        }
    }

    initAudio() {
        // The <audio> element.
        this.domAudio = document.createElement('AUDIO');
        this.domAudio.crossOrigin = 'anonymous';
        this.element.appendChild(this.domAudio);
        // Variables and others needed by HTML Audio API.
        try {
            this.audio = {};
            this.audio.ctx = new AudioContext();
            this.audio.source = this.audio.ctx.createMediaElementSource(this.domAudio);
            this.audio.analyser = this.audio.ctx.createAnalyser();
            this.audio.analyser.fftSize = this.fftSize ? this.fftSize : this.audio.analyser.fftSize;
            this.audio.source.connect(this.audio.analyser);
            this.audio.source.connect(this.audio.ctx.destination);
            this.freq = new Uint8Array(this.audio.analyser.frequencyBinCount)
        } catch (ex) {
            this.audio = null;
            console.log('Failed on initAudio'); // doing nothing on unsupported browsers.
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

    updateBar(offset, value, canvas, ctx) {
        let width = canvas.width / this.barCount;
        value /= 256;
        ctx.lineTo(offset * width, (1 - value) * canvas.height);
        ctx.lineTo((offset + 1) * width, (1 - value) * canvas.height);
    }

    renderVisualizer() {
        if (this.showProgressBar)
            this.progressBar.style.width = 100 * Math.min((this.domAudio.currentTime / this.domAudio.duration), 1) + '%';
        if (!this.showVisualizer || this.audio === null)
            return;
        this.audio.analyser.getByteFrequencyData(this.freq);

        if (this.domAudio.paused)
            return;
        
        let ctx = this.visualNode.getContext('2d');
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.clearRect(0, 0, this.visualNode.width, this.visualNode.height);
        ctx.beginPath();
        ctx.moveTo(0, this.visualNode.height);

        if (this.logarithmic) {
            for (let i = 0; i != this.barCount; ++i) {
                let sum = 0,
                    cnt = 0;
                let width = Math.log(this.audio.analyser.frequencyBinCount) / this.barCount;

                for (let j = Math.exp((i - 1) * width); j <= Math.exp((i) * width); ++j) {
                    sum += this.freq[Math.ceil(j)];
                    cnt++;
                }
                let value = sum / cnt;
                this.updateBar(i, value, this.visualNode, ctx);
            }
        } else {
            let width = (this.linearRegion[1] - this.linearRegion[0]) * this.audio.analyser.frequencyBinCount;
            for (let i = 0; i < this.barCount; ++i) {
                let sum = 0;
                for (let j = 0; j < width / this.barCount; ++j) {
                    let offset = i * (width / this.barCount) + j + this.audio.analyser.frequencyBinCount * this.linearRegion[0];
                    sum += this.freq[Math.ceil(offset)];
                }
                let value = sum / (width / this.barCount);
                this.updateBar(i, value, this.visualNode, ctx);
            }
        }
        ctx.lineTo(this.visualNode.width, this.visualNode.height);
        ctx.lineTo(0, this.visualNode.height);
        ctx.fill();
    }

    flushStatus() {
        if (this.domAudio.paused) {
            this.uiCollection.playButton.classList.remove('fa-pause');
            this.uiCollection.playButton.classList.add('fa-play');
        } else {
            this.uiCollection.playButton.classList.remove('fa-play');
            this.uiCollection.playButton.classList.add('fa-pause');
        }
    }

    play() {
        this.initLyrics();
        this.intervals.lyrics = setInterval(() => { this.updateLyrics(false) }, 20);
        this.intervals.visualizer = setInterval(() => { this.renderVisualizer() }, 17);
        this.domAudio.play();
        this.flushStatus();
    }

    pause() {
        clearInterval(this.intervals.lyrics);
        clearInterval(this.intervals.visualizer);
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
        this.uiCollection.progressInner.style.width = '0';
        this.uiCollection.cover.style.backgroundImage = `url('${this.nowPlaying.cover}')`;
        this.playListElem.forEach((item, offset) => {
            if (offset == this.currentTrack) {
                item.classList.add('now_playing');
            }
            else {
                item.classList.remove('now_playing');
            }
        });
        // Audio part
        this.domAudio.src = this.nowPlaying.url;

        // Lyrics
        this.initLyrics();

        clearInterval(this.intervals.songTitleMarq);
        this.uiCollection.songTitle.style.marginLeft = '';
        if (this.element.clientWidth < this.uiCollection.songTitle.clientWidth) {
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

        // Initialize some global variables
        this.currentTrack = 0;
        this.intervals = {};
        this.lyrics = {};

        // Initialize components.
        this.initUI();
        this.initAudio();
        this.initLyrics();
        // this.initVisualizer();
        this.reinit(); // Immediate fill the data of now playing song.

        // let's rock and roll.
        if (this.autoStart)
            this.switchTo(0, true)
    }

    initVisualizer() {
        if (!this.showVisualizer || this.audio === null)
            return;
        this.barArray = [];
        this.visualNode.innerHTML = "";
        let barWidth = this.visualNode.clientWidth / this.barCount;
        for (let i = 0; i != this.barCount; ++i) {
            let newBar = document.createElement('DIV')
            newBar.style.width = `${barWidth}px`;
            newBar.style.marginLeft = `${i*barWidth + 1}px`;
            newBar.style.bottom = '0';
            newBar.style.position = 'absolute';
            newBar.style.display = 'inline-block';
            // newBar.style.borderTop = 'solid 1px white';
            newBar.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            newBar.id = `bar${i}`;
            this.visualNode.appendChild(newBar);
            this.barArray.push(newBar);
        }
    }

    switchTo(track, isFirst) {
        this.pause();
        if (this.nowPlaying.onfinish && !isFirst)
            this.nowPlaying.onfinish.call();
        this.currentTrack = track;
        this.currentTrack %= this.playList.length;
        this.reinit();
        if (this.nowPlaying.onstart)
            this.nowPlaying.onstart.call();
        this.play();
        this.flushStatus();
    }
}

window.Player = Player;