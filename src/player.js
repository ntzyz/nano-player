
'use strict';

class Player {
    get nowPlaying() {
        return this.playList[this.currentTrack];
    }

    initUI() {
        this.uiStatus = 'unfocus';
        this.uiCollection = {};
        this.showingFreq = [];

        // Create the stylesheet and HTML elements and append them to the parent node.
        let style = document.createElement('STYLE');
        style.innerHTML = [
            '.cover {',
            '    position: absolute;',
            '    width: 100%;',
            '    height: 100%;',
            '    transition: all ease 0.3s;',
            '    color: white;',
            '    cursor: default;',
            '}',
            '.blur {',
            '    filter: blur(10px);',
            '}',
            '.hidden {',
            '    opacity: 0;',
            '}',
            'h1.songTitle {',
            '    font-weight: normal;',
            '    margin: 1%;',
            '    font-size: 150%;',
            '    text-align: center;',
            '}',
            'h2.songArtist {',
            '    font-weight: normal;',
            '    margin: 0%;',
            '    font-size: 100%;',
            ' text-align: center;',
            '}',
            'div.lyrics {',
            '    font-weight: normal;',
            '    margin: 3%;',
            '    font-size: 80%;',
            '    text-align: center;',
            '}',
            '.progress {',
            '    position: absolute;',
            '    bottom: 5%;',
            '    left: 25%;',
            '    width: 50%;',
            '    height: 1%;',
            '    margin: 0 auto;',
            '    border: 1px solid white;',
            '}.controls {',
            '    position: absolute;',
            '    height: 20%;',
            '    width: 100%;',
            '    bottom: 35%;',
            '    text-align: center;',
            '}',
            '.visualizer {',
            '    position: absolute;',
            '    bottom: 7%;',
            '    left: 25%;',
            '    width: 50%;',
            '    height: 12%;',
            '    margin: 0 auto;',
            '}',
            'i.fa {',
            '    min-width: 50px;',
            '    display: inline-block;',
            '    text-align: center;',
            '}',
            '.pointer{',
            '    cursor: pointer;',
            '}',
        ].join(' ');
        this.element.appendChild(style);

        // Container for all elements excluding stylesheet and <audio>.
        let container = document.createElement('DIV');
        container.classList.add('cover');
        container.style.overflow = 'hidden';

        // Container for title, artist and lyrics.
        let mediainfo = document.createElement('DIV');
        mediainfo.className = 'cover hidden';
        mediainfo.style.zIndex = '2';

        let songTitle = document.createElement('H1');
        songTitle.classList.add('songTitle');
        songTitle.innerHTML = this.nowPlaying.title ? this.nowPlaying.title : '未知歌曲';

        let songArtist = document.createElement('H2');
        songArtist.classList.add('songArtist');
        songArtist.innerHTML = this.nowPlaying.artist ? this.nowPlaying.artist : '未知艺术家';

        let lyrics = document.createElement('DIV');
        lyrics.classList.add('lyrics');

        // Container for control buttons, progress bar and visualizer
        let controller = document.createElement('DIV');
        controller.className = 'cover hidden';
        controller.style.zIndex = '2';
        controller.style.margin = '0 auto';

        let controls = document.createElement('DIV');
        controls.classList.add('controls');

        let playButton = document.createElement('I');
        playButton.className = 'fa fa-play';
        playButton.setAttribute('aria-hidden', 'true');
        playButton.style.fontSize = '3em';
        playButton.style.marginLeft = playButton.style.marginRight = '10%';

        // play <-> pause
        playButton.addEventListener('click', event => {
            if (this.uiStatus == 'unfocus')         // Button is hidden, ignore this click event.
                return;
            event.stopPropagation();                // Stop parent nodes from getting the click event.
            if (playButton.classList.contains('fa-play')) {
                this.play();
            }
            else {
                this.pause();
            }
        });
        
        let nextButton = document.createElement('I');
        nextButton.className = 'fa fa-forward';
        nextButton.setAttribute('aria-hidden', 'true');
        nextButton.style.fontSize = '3em';
        nextButton.addEventListener('click', event => {    // Same as above.
            if (this.uiStatus == 'unfocus')
                return;
            event.stopPropagation();
            this.nextTrack();
        });

        let prevButton = document.createElement('I');
        prevButton.className = 'fa fa-backward';
        prevButton.setAttribute('aria-hidden', 'true');
        prevButton.style.fontSize = '3em';
        prevButton.addEventListener('click', event => {
            if (this.uiStatus == 'unfocus')
                return;
            event.stopPropagation();
            this.prevTrack();
        });

        let progress = document.createElement('DIV');
        progress.className = 'progress';
        progress.overflow = 'hidden';
        progress.addEventListener('click', event => {
            if (this.uiStatus == 'unfocus')
                return;
            event.stopPropagation();
            let {left} = progress.getBoundingClientRect();
            this.domAudio.currentTime = this.domAudio.duration * (event.clientX - left) / progress.clientWidth;
            this.renderVisualizer();
        });

        let progressInner = document.createElement('DIV');
        progressInner.style.height = '100%';
        progressInner.style.width = '0';
        progressInner.style.backgroundColor = 'white';
        progress.appendChild(progressInner);

        let visualizer = document.createElement('DIV');
        visualizer.classList.add('visualizer');

        // Overlay for album cover, for bluring and darking
        let overlay = document.createElement('DIV');
        overlay.classList.add('cover');
        overlay.style.zIndex = '1';

        // Album cover.
        let cover = document.createElement('DIV');
        cover.classList.add('cover');
        cover.style.zIndex = '0';
        if (this.nowPlaying.cover) {
            // Load image from playList.
            cover.style.backgroundImage = `url('${this.nowPlaying.cover}')`;
            cover.style.backgroundSize = 'cover';
        }
        else {
            // No image was ordered, use the default one.
            cover.style.backgroundImage = `url('default.svg')`;
            cover.style.backgroundSize = '50%';
            cover.style.backgroundRepeat = 'no-repeat';
            cover.style.backgroundPosition = 'center';
        }

        // Append all elements to their parent elements.
        mediainfo.appendChild(songTitle);
        mediainfo.appendChild(songArtist);
        mediainfo.appendChild(lyrics);
        container.appendChild(mediainfo);
        controls.appendChild(prevButton);
        controls.appendChild(playButton);
        controls.appendChild(nextButton);
        controller.appendChild(controls);
        if (this.showProgressBar)
            controller.appendChild(progress);
        controller.appendChild(visualizer);
        container.appendChild(controller);
        container.appendChild(overlay);
        container.appendChild(cover);

        this.element.appendChild(container);

        // Switching from showing controllers, mediainfo, visualizer or not.
        container.addEventListener('click', event => {
            if (this.uiStatus == 'unfocus') {
                if (this.enableBlur)
                    cover.classList.add('blur');

                [playButton, prevButton, nextButton, progress].forEach(elem => {
                    elem.classList.add('pointer')
                })
                overlay.style.backgroundColor = 'rgba(0, 0, 0, .5)';
                [mediainfo, controller].forEach(elem => {
                    elem.classList.remove('hidden');
                })

                this.uiStatus = 'focus';
            }
            else {
                if (this.enableBlur)
                    cover.classList.remove('blur');

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

        // Save all the elements for further use.
        this.uiCollection = {
            container: container,
            mediainfo: mediainfo,
            songTitle: songTitle,
            songArtist: songArtist,
            lyrics: lyrics,
            controller: controller,
            controls: controls,
            playButton: playButton,
            nextButton: nextButton,
            prevButton: prevButton,
            progress: progress,
            progressInner: progressInner,
            visualizer: visualizer,
            overlay: overlay,
            cover: cover
        }
    }

    initAudio() {
        // The <audio> element.
        this.domAudio = document.createElement('AUDIO');
        this.domAudio.src = this.nowPlaying.url;
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
        }
        catch (ex) {
            this.audio = null;
            console.log('Failed on initAudio');     // doing nothing on unsupported browsers.
        }
        this.domAudio.addEventListener('ended', () => {
            this.nextTrack();
        });
    }

    initLyrics() {
        if (!this.showLyrics) {
            return;
        }
        if (!this.nowPlaying.lrc) {
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
            // item -> [%d:%d.%d]%s
            //          1  2  3  4
            let f = res => {
                return (res[1] * 60 + res[2] * 1) * 1000 + res[3].substr(0,2) * 10;
            };

            if (item == '')                 // Ignore the empty lines.
                return;
            if (item[0] != '[')             // Recover the line.
                item = '[' + item;

            let lyric = item.match(/\[(\d+):(\d+).(\d+)\](.*)/);
            if (lyric[4] == '') {           // Content unedfined, push current offset into pending list.
                pending.push(off);
                let offset = f(lyric);
                this.lyrics.table.push({
                    offset: offset,
                    lyric: '',
                });
                return;
            }
            let offset = f(lyric);
            this.lyrics.table.push({        // Pushing parsed result into the lyrics table.
                offset: offset,
                lyric: lyric[4],
            });
            while (pending.length > 0) {    // Filling the lines which content is undefined.
                let off = pending.shift() - 1;
                this.lyrics.table[off].lyric = lyric[4];
            }
        });
        this.lyrics.table.sort((a, b) => {  // Sort the table by offset.
            return a.offset - b.offset;
        })
        this.domAudio.addEventListener('seeking', () => {
            this.updateLyrics();            // Immediate update the lyric when seeking.
        })
        this.lyrics.lines = 0;
    }

    updateLyrics() {
        try {
            let currentOffset = this.domAudio.currentTime * 1000;
            let lastLines = this.lyrics.lines;

            if (this.lyrics.table.length == this.lyrics.lines) clearInterval(this.intervals.lyrics);
            while (this.lyrics.table[this.lyrics.lines - 1] && this.lyrics.table[this.lyrics.lines - 1].offset > currentOffset) {
                this.lyrics.lines--;
            }
            while (this.lyrics.table[this.lyrics.lines].offset <= currentOffset) {
                this.lrcNode.innerText = this.lyrics.table[this.lyrics.lines].lyric;
                this.lyrics.lines++;
            }
        }
        catch(e) {
            clearInterval(this.intervals.lyrics);
        }
    }

    updateBar(offset, value){
        let bar = this.barArray[offset];
        if (!bar)
            return;

        // Converts a number to a percentage
        value /= 2.56;
        
        // Only in the drop
        let prevValue = bar.style.height.substring(0, bar.style.height.length-1);
        prevValue = parseFloat(prevValue);
        if(value < prevValue){
            let dist = prevValue - value;
            value += dist * (1 - this.dropRate);
        }
        bar.style.height = value + '%';
    }

    renderVisualizer()  {
        if (this.showProgressBar)
            this.progressBar.style.width = 100*Math.min((this.domAudio.currentTime / this.domAudio.duration), 1) + '%';
        if (!this.showVisualizer || this.audio === null)
            return;
        this.audio.analyser.getByteFrequencyData(this.freq);

        if (this.logarithmic) {
            for (let i = 0; i != this.barCount; ++i) {
                let sum = 0, cnt = 0;
                let width = Math.log(this.audio.analyser.frequencyBinCount) / this.barCount;

                for (let j = Math.exp((i-1) * width);j <= Math.exp((i) * width); ++j) {
                    sum += this.freq[Math.ceil(j)];
                    cnt++;
                }
                let value = sum / cnt;
                this.updateBar(i, value);
            }
        }
        else {
            let width = (this.linearRegion[1] - this.linearRegion[0]) * this.audio.analyser.frequencyBinCount;
            for (let i = 0; i < this.barCount; ++i) {
                let sum = 0;
                for (let j = 0; j < width / this.barCount; ++j) {
                    let offset = i * (width / this.barCount) + j + this.audio.analyser.frequencyBinCount * this.linearRegion[0];
                    sum += this.freq[Math.ceil(offset)];
                }                
                let value = sum / (width / this.barCount);                
                this.updateBar(i, value);
            }
        }
    }

    play() {
        this.initLyrics();
        this.uiCollection.playButton.classList.remove('fa-play');
        this.uiCollection.playButton.classList.add('fa-pause');
        this.intervals.lyrics = setInterval(() => {this.updateLyrics()}, 20);
        this.intervals.visualizer = setInterval(() => {this.renderVisualizer()}, 17);
        this.domAudio.play();
    }

    pause() {
        this.uiCollection.playButton.classList.remove('fa-pause');
        this.uiCollection.playButton.classList.add('fa-play');
        clearInterval(this.intervals.lyrics);
        clearInterval(this.intervals.visualizer);
        this.domAudio.pause();
    }

    nextTrack() {
        this.pause();
        this.currentTrack++;
        this.currentTrack %= this.playList.length;
        this.reinit();
        this.play();
    }

    prevTrack() {
        this.currentTrack--;
        if (this.currentTrack < 0)
            this.currentTrack += this.playList.length;
        this.currentTrack %= this.playList.length;
        this.reinit();
        this.play();
    }

    reinit() {
        // UI part
        this.uiCollection.songTitle.innerHTML = this.nowPlaying.title ? this.nowPlaying.title : '未知歌曲';
        this.uiCollection.songArtist.innerHTML = this.nowPlaying.artist ? this.nowPlaying.artist : '未知艺术家';
        this.uiCollection.progressInner.style.width = '0';
        if (this.nowPlaying.cover) {
            this.uiCollection.cover.style.backgroundImage = `url('${this.nowPlaying.cover}')`;
            this.uiCollection.cover.style.backgroundSize = 'cover';
        }
        else {
            this.uiCollection.cover.style.backgroundSize = '50%';
            this.uiCollection.cover.style.backgroundImage = `url('default.svg')`;
            this.uiCollection.cover.style.backgroundRepeat = 'no-repeat';
            this.uiCollection.cover.style.backgroundPosition = 'center';
        }

        // Audio part
        this.domAudio.src = this.nowPlaying.url;

        // Lyrics
        this.initLyrics();
    }

    constructor(params) {
        // Load all the preferences.
        this.element = params.parent;
        this.playList = params.playList;
        this.barCount = params.maxBars ? params.maxBars : 128;
        this.logarithmic = params.logarithmic ? params.logarithmic : false;
        this.fftSize = params.fftSize;
        this.autoStart = params.autoStart ? params.autoStart : false;
        this.showVisualizer = params.showVisualizer ? params.showVisualizer : true;
        this.showProgressBar = params.showProgressBar ? params.showProgressBar : true;;
        this.enableBlur = params.enableBlur ? params.enableBlur : true;
        this.showLyrics = params.showLyrics ? params.showLyrics : false;
        this.dropRate = typeof params.dropRate != 'undefined' ? params.dropRate : 1;
        this.linearRegion = params.linearRegion ? params.linearRegion : [0, 1];

        // Initialize some global variables
        this.currentTrack = 0;
        this.intervals = {};
        this.lyrics = {};

        // Initialize components.
        this.initUI();
        this.initAudio();
        this.initLyrics();
        this.initVisualizer();

        // let's rock and roll.
        if (this.autoStart)
            this.play();
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
            newBar.style.marginLeft = `${i * barWidth}px`;
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
}
