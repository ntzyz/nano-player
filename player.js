/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(1);
	__webpack_require__(2);

	var createElement = __webpack_require__(6);
	var defaultCover = __webpack_require__(7);

	var Spectral = __webpack_require__(8);
	var Oscillator = __webpack_require__(10);

	var Player = function () {
	    _createClass(Player, [{
	        key: 'initUI',
	        value: function initUI() {
	            var _this = this;

	            this.element.style.position = 'relative';
	            this.element.style.width = this.style.width || '300px';
	            this.element.style.height = this.style.height || '300px';
	            this.element.style.overflow = 'hidden';
	            this.element.classList.add('__nano_player__');

	            this.uiStatus = 'unfocus';
	            this.uiCollection = {};
	            this.showingFreq = [];

	            var container = createElement({
	                tagName: 'div',
	                classList: ['cover'],
	                style: {
	                    overflow: 'hidden'
	                }
	            });

	            // Container for title, artist and lyrics.
	            var mediainfo = createElement({
	                tagName: 'div',
	                classList: ['cover', 'hidden'],
	                style: {
	                    zIndex: 3
	                }
	            });

	            var songTitle = createElement({
	                tagName: 'h1',
	                classList: ['songTitle']
	            });

	            var songArtist = createElement({
	                tagName: 'h2',
	                classList: ['songArtist']
	            });

	            var lyrics = createElement({
	                tagName: 'div',
	                classList: ['lyrics', 'gpu']
	            });

	            // Container for control buttons, progress bar and visualizer
	            var controller = createElement({
	                tagName: 'div',
	                classList: ['cover', 'hidden'],
	                style: {
	                    zIndex: '3',
	                    margin: '0 auto'
	                }
	            });

	            var controls = createElement({
	                tagName: 'div',
	                classList: ['controls']
	            });

	            var playButton = createElement({
	                tagName: 'i',
	                classList: ['fa', 'fa-play', 'controlButton'],
	                attr: {
	                    'aria-hidden': true
	                },
	                style: {
	                    fontSize: '3em',
	                    marginLeft: '10%',
	                    marginRight: '10%'
	                },
	                eventListener: {
	                    click: function click(event) {
	                        // play <-> pause
	                        if (_this.uiStatus == 'unfocus') // Button is hidden, ignore this click event.
	                            return;
	                        event.stopPropagation(); // Stop parent nodes from getting the click event.
	                        if (_this.domAudio.paused) {
	                            _this.play();
	                        } else {
	                            _this.pause();
	                        }
	                    }
	                }
	            });

	            var nextButton = createElement({
	                tagName: 'i',
	                classList: ['fa', 'fa-forward', 'controlButton'],
	                attr: {
	                    'aria-hidden': true
	                },
	                style: {
	                    fontSize: '3em'
	                },
	                eventListener: {
	                    click: function click(event) {
	                        // Same as above.
	                        if (_this.uiStatus == 'unfocus') return;
	                        event.stopPropagation();
	                        _this.nextTrack();
	                    }
	                }
	            });

	            var prevButton = createElement({
	                tagName: 'i',
	                classList: ['fa', 'fa-backward', 'controlButton'],
	                attr: {
	                    'aria-hidden': true
	                },
	                style: {
	                    fontSize: '3em'
	                },
	                eventListener: {
	                    click: function click(event) {
	                        if (_this.uiStatus == 'unfocus') return;
	                        event.stopPropagation();
	                        _this.prevTrack();
	                    }
	                }
	            });

	            var progress = createElement({
	                tagName: 'div',
	                classList: ['progress'],
	                style: {
	                    overflow: 'hidden'
	                },
	                eventListener: {
	                    click: function click(event) {
	                        if (_this.uiStatus == 'unfocus') return;
	                        event.stopPropagation();

	                        var _progress$getBounding = progress.getBoundingClientRect(),
	                            left = _progress$getBounding.left;

	                        _this.domAudio.currentTime = _this.domAudio.duration * (event.clientX - left) / progress.clientWidth;
	                        _this.updateProgress();
	                    }
	                }
	            });

	            var progressInner = createElement({
	                tagName: 'div',
	                style: {
	                    height: '100%',
	                    backgroundColor: 'white'
	                }
	            });
	            progress.appendChild(progressInner);

	            var visualizer = void 0;
	            if (this.renderMode === 'canvas') {
	                visualizer = createElement({
	                    tagName: 'canvas',
	                    classList: ['visualizer']
	                });
	            } else {
	                visualizer = createElement({
	                    tagName: 'div',
	                    classList: ['visualizer']
	                });
	            }

	            var playListButton = createElement({
	                tagName: 'i',
	                classList: ['fa', 'fa-list-ul', 'navButton'],
	                attr: {
	                    'aria-hidden': true
	                },
	                style: {
	                    position: 'absolute',
	                    bottom: '3%',
	                    right: '3%',
	                    fontSize: '1.2em',
	                    color: 'white'
	                },
	                eventListener: {
	                    click: function click(event) {
	                        if (_this.uiStatus == 'unfocus') return;
	                        event.stopPropagation();
	                        container.classList.add('outside-left');
	                        playList.classList.remove('outside-right');
	                    }
	                }
	            });

	            // Overlay for album cover, for bluring and darking
	            var overlay = createElement({
	                tagName: 'div',
	                classList: ['cover'],
	                style: {
	                    zIndex: '2'
	                }
	            });

	            // Album cover.
	            var cover = createElement({
	                tagName: 'div',
	                classList: ['cover', 'gpu'],
	                style: {
	                    zIndex: '1',
	                    backgroundSize: 'cover'
	                }
	            });

	            // Legacy album cover.
	            var legacyCover = createElement({
	                tagName: 'div',
	                classList: ['cover', 'gpu'],
	                innerHTML: defaultCover,
	                style: {
	                    backgroundColor: 'white'
	                }
	            });

	            // PlayList view.
	            var playList = createElement({
	                tagName: 'div',
	                classList: ['cover', 'outside-right', 'playlist'],
	                style: {
	                    backgroundColor: 'black'
	                }
	            });

	            var headbar = createElement({
	                tagName: 'div',
	                parent: playList,
	                classList: ['headbar']
	            });

	            var returnButton = createElement({
	                tagName: 'i',
	                parent: headbar,
	                classList: ['fa', 'fa-chevron-left', 'navButton'],
	                attr: {
	                    'aria-hidden': true
	                },
	                style: {
	                    position: 'absolute',
	                    left: '3%',
	                    fontSize: '1.2em',
	                    lineHeight: '44px',
	                    color: 'white'
	                },
	                eventListener: {
	                    click: function click(event) {
	                        if (_this.uiStatus == 'unfocus') return;
	                        event.stopPropagation();
	                        container.classList.remove('outside-left');
	                        playList.classList.add('outside-right');
	                    }
	                }
	            });

	            var titleText = createElement({
	                tagName: 'span',
	                parent: headbar,
	                style: {
	                    lineHeight: '44px'
	                },
	                innerHTML: '播放列表'
	            });

	            var listContainer = createElement({
	                tagName: 'div',
	                classList: ['listContainer'],
	                parent: playList
	            });

	            var listWrapper = createElement({
	                tagName: 'div',
	                parent: listContainer
	            });

	            this.playListElem = [];

	            var _loop = function _loop(offset) {
	                var item = document.createElement('DIV');
	                item.className = 'list';
	                item.offset = offset;

	                var face = document.createElement('DIV');
	                face.className = 'face';
	                face.style.backgroundImage = 'url(\'' + _this.playList[offset].cover + '\')';
	                face.style.position = 'absolute';
	                face.style.zIndex = 2;
	                face.style.width = '100%';
	                face.style.height = '100%';

	                var fallbackFace = document.createElement('DIV');
	                fallbackFace.innerHTML = defaultCover;
	                fallbackFace.style.position = 'absolute';
	                fallbackFace.style.zIndex = 1;
	                fallbackFace.style.backgroundColor = 'grey';
	                fallbackFace.style.width = '100%';
	                fallbackFace.style.height = '100%';

	                var faceContainer = document.createElement('DIV');
	                faceContainer.className = 'face';

	                var faceWrapper = document.createElement('DIV');
	                faceWrapper.className = 'face faceWrapper';
	                faceWrapper.style.position = 'relative';

	                faceWrapper.appendChild(face);
	                faceWrapper.appendChild(fallbackFace);
	                faceContainer.appendChild(faceWrapper);

	                var title = document.createElement('DIV');
	                title.className = 'title';
	                title.innerHTML = _this.playList[offset].title + ' <br /> <span style="font-size: 0.8em">' + _this.playList[offset].artist + '</span>';

	                item.appendChild(faceContainer);
	                item.appendChild(title);

	                item.addEventListener('click', function () {
	                    _this.switchTo(item.offset);
	                });

	                listWrapper.appendChild(item);
	                _this.playListElem.push(item);
	            };

	            for (var offset in this.playList) {
	                _loop(offset);
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
	            if (this.showProgressBar) controller.appendChild(progress);
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
	                (function () {
	                    // We do not hope that the overflow part is really hidden. Fix it.
	                    var actualWidth = songTitle.clientWidth;
	                    var mleft = 0;
	                    songTitle.innerText = songTitle.innerText + '    ' + songTitle.innerText;
	                    var renderMarq = function renderMarq() {
	                        songTitle.style.marginLeft = mleft + 'px';
	                        mleft -= 1;
	                        if (mleft + actualWidth <= 0) {
	                            mleft = 0;
	                        }
	                    };
	                    _this.intervals.songTitleMarq = setInterval(renderMarq, 20);
	                })();
	            }

	            // Switching from showing controllers, mediainfo, visualizer or not.
	            container.addEventListener('click', function (event) {
	                if (_this.uiStatus == 'unfocus') {
	                    if (_this.enableBlur) [cover, legacyCover].forEach(function (elem) {
	                        return elem.classList.add('blur');
	                    });

	                    [playButton, prevButton, nextButton, progress].forEach(function (elem) {
	                        elem.classList.add('pointer');
	                    });
	                    overlay.style.backgroundColor = 'rgba(0, 0, 0, .5)';
	                    [mediainfo, controller].forEach(function (elem) {
	                        elem.classList.remove('hidden');
	                    });

	                    _this.uiStatus = 'focus';
	                } else {
	                    if (_this.enableBlur) [cover, legacyCover].forEach(function (elem) {
	                        return elem.classList.remove('blur');
	                    });

	                    [playButton, prevButton, nextButton, progress].forEach(function (elem) {
	                        elem.classList.remove('pointer');
	                    });
	                    overlay.style.backgroundColor = '';
	                    [mediainfo, controller].forEach(function (elem) {
	                        elem.classList.add('hidden');
	                    });

	                    _this.uiStatus = 'unfocus';
	                }
	            });
	            // Save some useful elements to our player's object.
	            this.visualNode = visualizer;
	            this.lrcNode = lyrics;
	            this.progressBar = progressInner;

	            if (this.renderMode === 'canvas') {
	                var visualizerRect = visualizer.getBoundingClientRect();
	                visualizer.width = visualizerRect.width * window.devicePixelRatio * 2;
	                // visualizer.style.width = `${visualizerRect.width}px`;
	                visualizer.height = visualizerRect.height * window.devicePixelRatio * 2;
	                // visualizer.style.height = `${visualizerRect.height}px`;
	                this.ctx = this.visualNode.getContext('2d');
	            }

	            // Save all the elements for further use.
	            this.uiCollection = {
	                container: container, mediainfo: mediainfo, songTitle: songTitle,
	                songArtist: songArtist, lyrics: lyrics, controller: controller,
	                controls: controls, playButton: playButton, nextButton: nextButton,
	                prevButton: prevButton, progress: progress, progressInner: progressInner,
	                visualizer: visualizer, overlay: overlay, cover: cover,
	                legacyCover: legacyCover
	            };
	        }
	    }, {
	        key: 'initAudio',
	        value: function initAudio() {
	            var _this2 = this;

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
	            } catch (ex) {
	                this.audioContext = null;
	            }

	            this.domAudio.addEventListener('ended', function () {
	                _this2.nextTrack();
	            });
	        }
	    }, {
	        key: 'initLyrics',
	        value: function initLyrics() {
	            var _this3 = this;

	            if (!this.showLyrics) {
	                return;
	            }

	            // We need this function to be an arrow function, as we need this pointing to 
	            // the whole class but not the HTMLAudioElement.
	            // Also, the reason for not using anonymous lambda function is that 
	            // cleatInterval would treat them as different event handler.
	            this.updateLyrics = function () {
	                var immediateUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	                try {
	                    var currentOffset = _this3.domAudio.currentTime * 1000;
	                    var lastLines = _this3.lyrics.lines;

	                    if (_this3.lyrics.table.length == _this3.lyrics.lines) clearInterval(_this3.intervals.lyrics);
	                    while (_this3.lyrics.table[_this3.lyrics.lines - 1] && _this3.lyrics.table[_this3.lyrics.lines - 1].offset > currentOffset) {
	                        _this3.lyrics.lines--;
	                    }
	                    while (_this3.lyrics.table[_this3.lyrics.lines].offset <= currentOffset) {
	                        if (immediateUpdate) {
	                            _this3.lrcNode.innerText = _this3.lyrics.table[_this3.lyrics.lines].lyric;
	                            _this3.lyrics.lines++;
	                        } else {
	                            _this3.lrcNode.style.opacity = 0.5;
	                            _this3.lyrics.lines++;
	                            setTimeout(function () {
	                                _this3.lrcNode.innerText = _this3.lyrics.table[_this3.lyrics.lines - 1].lyric;
	                                _this3.lrcNode.style.opacity = 1;
	                            }, 50);
	                        }
	                    }
	                } catch (e) {
	                    clearInterval(_this3.intervals.lyrics);
	                }
	            };
	            if (!this.nowPlaying.lrc) {
	                if (this.lyrics.hasListener) {
	                    this.domAudio.removeEventListener('seeking', this.updateLyrics);
	                }
	                // No lyric found, no need to go further.
	                this.lyrics = {};
	                this.lrcNode.innerText = '♪～(￣ε￣)';
	                return;
	            }
	            // Storage the parsed lyrics.
	            this.lyrics.table = [];
	            // Part of lines with undefined content.
	            var pending = [];
	            this.nowPlaying.lrc.split('[').forEach(function (item, off) {
	                _this3.nowPlaying.lrcOffset = _this3.nowPlaying.lrcOffset ? _this3.nowPlaying.lrcOffset : 0;
	                // item -> [%d:%d.%d]%s
	                //          1  2  3  4
	                var f = function f(res) {
	                    return (res[1] * 60 + res[2] * 1) * 1000 + res[3].substr(0, 2) * 10 + _this3.nowPlaying.lrcOffset;
	                };

	                if (item == '') // Ignore the empty lines.
	                    return;
	                if (item[0] != '[') // Recover the line.
	                    item = '[' + item;

	                if (!/\[(\d+):(\d+).(\d+)\](.*)/.test(item)) return;
	                var lyric = item.match(/\[(\d+):(\d+).(\d+)\](.*)/);
	                if (lyric[4] == '') {
	                    // Content unedfined, push current offset into pending list.
	                    pending.push(off);
	                    var _offset = f(lyric);
	                    _this3.lyrics.table.push({
	                        offset: _offset,
	                        lyric: ''
	                    });
	                    return;
	                }
	                var offset = f(lyric);
	                _this3.lyrics.table.push({ // Pushing parsed result into the lyrics table.
	                    offset: offset,
	                    lyric: lyric[4]
	                });
	                while (pending.length > 0) {
	                    // Filling the lines which content is undefined.
	                    var _off = pending.shift() - 1;
	                    _this3.lyrics.table[_off].lyric = lyric[4];
	                }
	            });
	            this.lyrics.table.sort(function (a, b) {
	                // Sort the table by offset.
	                return a.offset - b.offset;
	            });
	            if (!this.lyrics.hasListener) {
	                this.domAudio.addEventListener('seeking', this.updateLyrics);
	                this.lyrics.hasListener = true;
	            }
	            this.lyrics.lines = 0;
	        }
	    }, {
	        key: 'updateProgress',
	        value: function updateProgress() {
	            if (this.showProgressBar) this.progressBar.style.width = 100 * Math.min(this.domAudio.currentTime / this.domAudio.duration, 1) + '%';
	        }
	    }, {
	        key: 'flushStatus',
	        value: function flushStatus() {
	            if (this.domAudio.paused) {
	                this.uiCollection.playButton.classList.remove('fa-pause');
	                this.uiCollection.playButton.classList.add('fa-play');
	            } else {
	                this.uiCollection.playButton.classList.remove('fa-play');
	                this.uiCollection.playButton.classList.add('fa-pause');
	            }
	        }
	    }, {
	        key: 'play',
	        value: function play() {
	            var _this4 = this;

	            this.initLyrics();
	            if (this.showLyrics) {
	                this.intervals.lyrics = setInterval(function () {
	                    _this4.updateLyrics(false);
	                }, 20);
	            }
	            this.intervals.progress = setInterval(function () {
	                _this4.updateProgress();
	            }, 200);
	            this.domAudio.play();
	            this.flushStatus();
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            clearInterval(this.intervals.lyrics);
	            // this.spectral.pause();
	            this.domAudio.pause();
	            this.flushStatus();
	        }
	    }, {
	        key: 'nextTrack',
	        value: function nextTrack() {
	            this.switchTo(this.currentTrack + 1);
	        }
	    }, {
	        key: 'prevTrack',
	        value: function prevTrack() {
	            this.switchTo(this.currentTrack - 1);
	        }
	    }, {
	        key: 'reinit',
	        value: function reinit() {
	            var _this5 = this;

	            // UI part
	            this.uiCollection.songTitle.innerHTML = this.nowPlaying.title ? this.nowPlaying.title : '未知歌曲';
	            this.uiCollection.songArtist.innerHTML = this.nowPlaying.artist ? this.nowPlaying.artist : '未知艺术家';
	            this.uiCollection.progressInner.style.width = '0';
	            this.uiCollection.cover.style.backgroundImage = 'url(\'' + this.nowPlaying.cover + '\')';
	            this.playListElem.forEach(function (item, offset) {
	                if (offset == _this5.currentTrack) {
	                    item.classList.add('now_playing');
	                } else {
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
	                (function () {
	                    // We do not hope that the overflow part is really hidden. Fix it.
	                    var songTitle = _this5.uiCollection.songTitle;
	                    songTitle.innerText = songTitle.innerText + '        ';
	                    var actualWidth = songTitle.clientWidth;
	                    var mleft = 40;
	                    songTitle.innerText = songTitle.innerText + songTitle.innerText;
	                    var renderMarq = function renderMarq() {
	                        if (mleft < 0) songTitle.style.marginLeft = mleft + 'px';
	                        mleft -= 0.5;
	                        if (mleft + actualWidth <= 0) {
	                            mleft = 40;
	                        }
	                    };
	                    _this5.intervals.songTitleMarq = setInterval(renderMarq, 20);
	                })();
	            }

	            // Clear the remaining lyric.
	            this.lrcNode.innerHTML = '';

	            // flush Status
	            this.flushStatus();
	        }
	    }, {
	        key: 'nowPlaying',
	        get: function get() {
	            return this.playList[this.currentTrack];
	        }
	    }]);

	    function Player(params) {
	        var _this6 = this;

	        _classCallCheck(this, Player);

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

	        var switchVisualizer = function switchVisualizer() {
	            if (typeof _this6.showingVisualizer !== 'undefined') {
	                _this6.visualizer.dispose();
	                if (_this6.showingVisualizer === 'spectral') {
	                    _this6.showingVisualizer = 'oscillator';
	                } else {
	                    _this6.showingVisualizer = 'spectral';
	                }
	            } else {
	                _this6.showingVisualizer = 'spectral';
	            }
	            if (_this6.showingVisualizer === 'spectral') {
	                _this6.visualizer = new Spectral({
	                    audio: _this6.domAudio,
	                    audioAnalyser: _this6.audioAnalyser,
	                    canvas: _this6.visualNode,
	                    logarithmic: _this6.logarithmic,
	                    bandCount: _this6.barCount,
	                    linearRegion: _this6.linearRegion,
	                    showBuoy: _this6.showBuoy,
	                    fps: 50
	                });
	            } else {
	                _this6.visualizer = new Oscillator({
	                    audio: _this6.domAudio,
	                    audioAnalyser: _this6.audioAnalyser,
	                    canvas: _this6.visualNode,
	                    fps: 50
	                });
	            }
	            _this6.visualizer.start();
	        };

	        if (this.showVisualizer && this.audioContext) {
	            this.visualNode.addEventListener('click', function (event) {
	                if (_this6.uiStatus == 'unfocus') return;
	                event.stopPropagation();
	                switchVisualizer();
	            });
	            switchVisualizer();
	        }

	        // let's rock and roll.
	        if (this.autoStart) this.switchTo(0, true);
	    }

	    _createClass(Player, [{
	        key: 'switchTo',
	        value: function switchTo(track, isFirst) {
	            var isEnd = false;
	            this.pause();
	            if (this.nowPlaying.onfinish && !isFirst) this.nowPlaying.onfinish(this);
	            this.currentTrack = track;
	            if (this.currentTrack < 0) this.currentTrack += this.playList.length;
	            if (this.currentTrack === this.playList.length) {
	                isEnd = true;
	            }
	            this.currentTrack %= this.playList.length;
	            this.reinit();
	            if (this.nowPlaying.onstart) this.nowPlaying.onstart(this);
	            isEnd || this.play();
	            this.flushStatus();
	        }
	    }]);

	    return Player;
	}();

	window.Player = Player;

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 * classList.js: Cross-browser full element.classList implementation.
	 * 2014-07-23
	 *
	 * By Eli Grey, http://eligrey.com
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 */

	/*global self, document, DOMException */

	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

	/* Copied from MDN:
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
	 */

	if ("document" in window.self) {

	  // Full polyfill for browsers with no classList support
	  // Including IE < Edge missing SVGElement.classList
	  if (!("classList" in document.createElement("_"))
	    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

	  (function (view) {

	    "use strict";

	    if (!('Element' in view)) return;

	    var
	        classListProp = "classList"
	      , protoProp = "prototype"
	      , elemCtrProto = view.Element[protoProp]
	      , objCtr = Object
	      , strTrim = String[protoProp].trim || function () {
	        return this.replace(/^\s+|\s+$/g, "");
	      }
	      , arrIndexOf = Array[protoProp].indexOf || function (item) {
	        var
	            i = 0
	          , len = this.length
	        ;
	        for (; i < len; i++) {
	          if (i in this && this[i] === item) {
	            return i;
	          }
	        }
	        return -1;
	      }
	      // Vendors: please allow content code to instantiate DOMExceptions
	      , DOMEx = function (type, message) {
	        this.name = type;
	        this.code = DOMException[type];
	        this.message = message;
	      }
	      , checkTokenAndGetIndex = function (classList, token) {
	        if (token === "") {
	          throw new DOMEx(
	              "SYNTAX_ERR"
	            , "An invalid or illegal string was specified"
	          );
	        }
	        if (/\s/.test(token)) {
	          throw new DOMEx(
	              "INVALID_CHARACTER_ERR"
	            , "String contains an invalid character"
	          );
	        }
	        return arrIndexOf.call(classList, token);
	      }
	      , ClassList = function (elem) {
	        var
	            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
	          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
	          , i = 0
	          , len = classes.length
	        ;
	        for (; i < len; i++) {
	          this.push(classes[i]);
	        }
	        this._updateClassName = function () {
	          elem.setAttribute("class", this.toString());
	        };
	      }
	      , classListProto = ClassList[protoProp] = []
	      , classListGetter = function () {
	        return new ClassList(this);
	      }
	    ;
	    // Most DOMException implementations don't allow calling DOMException's toString()
	    // on non-DOMExceptions. Error's toString() is sufficient here.
	    DOMEx[protoProp] = Error[protoProp];
	    classListProto.item = function (i) {
	      return this[i] || null;
	    };
	    classListProto.contains = function (token) {
	      token += "";
	      return checkTokenAndGetIndex(this, token) !== -1;
	    };
	    classListProto.add = function () {
	      var
	          tokens = arguments
	        , i = 0
	        , l = tokens.length
	        , token
	        , updated = false
	      ;
	      do {
	        token = tokens[i] + "";
	        if (checkTokenAndGetIndex(this, token) === -1) {
	          this.push(token);
	          updated = true;
	        }
	      }
	      while (++i < l);

	      if (updated) {
	        this._updateClassName();
	      }
	    };
	    classListProto.remove = function () {
	      var
	          tokens = arguments
	        , i = 0
	        , l = tokens.length
	        , token
	        , updated = false
	        , index
	      ;
	      do {
	        token = tokens[i] + "";
	        index = checkTokenAndGetIndex(this, token);
	        while (index !== -1) {
	          this.splice(index, 1);
	          updated = true;
	          index = checkTokenAndGetIndex(this, token);
	        }
	      }
	      while (++i < l);

	      if (updated) {
	        this._updateClassName();
	      }
	    };
	    classListProto.toggle = function (token, force) {
	      token += "";

	      var
	          result = this.contains(token)
	        , method = result ?
	          force !== true && "remove"
	        :
	          force !== false && "add"
	      ;

	      if (method) {
	        this[method](token);
	      }

	      if (force === true || force === false) {
	        return force;
	      } else {
	        return !result;
	      }
	    };
	    classListProto.toString = function () {
	      return this.join(" ");
	    };

	    if (objCtr.defineProperty) {
	      var classListPropDesc = {
	          get: classListGetter
	        , enumerable: true
	        , configurable: true
	      };
	      try {
	        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	      } catch (ex) { // IE 8 doesn't support enumerable:true
	        if (ex.number === -0x7FF5EC54) {
	          classListPropDesc.enumerable = false;
	          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	        }
	      }
	    } else if (objCtr[protoProp].__defineGetter__) {
	      elemCtrProto.__defineGetter__(classListProp, classListGetter);
	    }

	    }(window.self));

	    } else {
	    // There is full or partial native classList support, so just check if we need
	    // to normalize the add/remove and toggle APIs.

	    (function () {
	      "use strict";

	      var testElement = document.createElement("_");

	      testElement.classList.add("c1", "c2");

	      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
	      // classList.remove exist but support only one argument at a time.
	      if (!testElement.classList.contains("c2")) {
	        var createMethod = function(method) {
	          var original = DOMTokenList.prototype[method];

	          DOMTokenList.prototype[method] = function(token) {
	            var i, len = arguments.length;

	            for (i = 0; i < len; i++) {
	              token = arguments[i];
	              original.call(this, token);
	            }
	          };
	        };
	        createMethod('add');
	        createMethod('remove');
	      }

	      testElement.classList.toggle("c3", false);

	      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	      // support the second argument.
	      if (testElement.classList.contains("c3")) {
	        var _toggle = DOMTokenList.prototype.toggle;

	        DOMTokenList.prototype.toggle = function(token, force) {
	          if (1 in arguments && !this.contains(token) === !force) {
	            return force;
	          } else {
	            return _toggle.call(this, token);
	          }
	        };

	      }

	      testElement = null;
	    }());
	  }
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/.0.26.1@css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/.0.26.1@css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".__nano_player__ {\n    user-select: none;\n}\n\n.__nano_player__ .gpu{\n    transform: translateZ(0);\n    will-change: transform;\n}\n\n.__nano_player__ .cover {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    transition: all ease 0.3s;\n    color: white;\n    cursor: default;\n}\n.__nano_player__ .blur {\n    filter: blur(10px);\n}\n.__nano_player__ .hidden {\n    opacity: 0;\n}\n.__nano_player__ h1.songTitle {\n    font-weight: normal;\n    margin-top: 1%;\n    margin-bottom: 1%;\n    font-size: 150%;\n    text-align: center;\n    white-space: pre;\n    display: inline-block;\n}\n.__nano_player__ h2.songArtist {\n    font-weight: normal;\n    margin: 2% auto 0 auto;\n    font-size: 100%;\n    text-align: center;\n    line-height: 1em;\n    height: 1em;\n    text-overflow: ellipsis;\n    max-width: 90%;\n    white-space: pre;\n    overflow: hidden;\n}\n.__nano_player__ div.lyrics {\n    font-weight: normal;\n    margin: 1%;\n    font-size: 80%;\n    text-align: center;\n    transition: all ease 0.05s\n}\n.__nano_player__ .progress {\n    position: absolute;\n    bottom: 5%;\n    left: 25%;\n    width: 50%;\n    height: 1%;\n    margin: 0 auto;\n    border: 1px solid white;\n}\n.__nano_player__ .controls {\n    position: absolute;\n    height: 20%;\n    width: 100%;\n    bottom: 35%;\n    text-align: center;\n}\n.__nano_player__ .visualizer {\n    position: absolute;\n    bottom: 7%;\n    left: 25%;\n    width: 50%;\n    height: 12%;\n    margin: 0 auto;\n    border: 1px solid rgba(0,0,0,0);\n}\n.__nano_player__ canvas.nearestNeighbor {\n    image-rendering: optimizeSpeed;             /* Older versions of FF          */\n    image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */\n    image-rendering: -webkit-optimize-contrast; /* Safari                        */\n    image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */\n    image-rendering: pixelated;                 /* Awesome future-browsers       */\n    -ms-interpolation-mode: nearest-neighbor;   /* IE                            */\n}\n.__nano_player__ i.controlButton {\n    min-width: 50px;\n    display: inline-block;\n    text-align: center;\n}\n.__nano_player__ i.navButton {\n    cursor: pointer;\n}\n.__nano_player__ .pointer {\n    cursor: pointer;\n}\n.__nano_player__ .outside-left {\n    margin-left: -100%;\n}\n.__nano_player__ .outside-right {\n    margin-left: 100%;\n}\n.__nano_player__ .playlist {\n    position: absolute;\n    overflow: hidden;\n}\n\n.__nano_player__ .headbar {\n    background-color: #000;\n    height: 44px;\n    width: 100%;\n    text-align: center;\n    position: absolute;\n}\n\n.__nano_player__ .list {\n    width: 100%;\n    height: 64px;\n    transition: all ease 0.2s;\n}\n.__nano_player__ .now_playing {\n    background-color: #333;\n}\n.__nano_player__ .listContainer {\n    position: absolute;\n    top: 44px;\n    left: 0;\n    right: -17px;\n    bottom: 0;\n    overflow-y: scroll;\n    -webkit-overflow-scrolling: touch;\n}\n.__nano_player__ .list .face {\n    position: absolute;\n    height: 64px;\n    width: 64px;\n    display: inline-block;\n    background-size: cover;\n}\n\n.__nano_player__ .list>.title {\n    position: absolute;\n    padding-left: 12px; \n    left: 64px;\n    right: 0;\n    padding-top: 12px;\n    display: inline-block;\n    text-overflow: ellipsis;\n    overflow: hidden;\n    line-height: 20px;\n    white-space: nowrap;\n}", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var createElement = function createElement(options) {
	    if (!options || !options.tagName) return undefined;

	    var element = document.createElement(options.tagName);
	    if (options.attr) {
	        for (var name in options.attr) {
	            element.setAttribute(name, options.attr[name]);
	        }
	    }

	    if (options.style) {
	        for (var _name in options.style) {
	            element.style[_name] = options.style[_name];
	        }
	    }

	    if (options.classList) {
	        element.className = options.classList.join(' ');
	    }

	    if (options.eventListener) {
	        for (var listener in options.eventListener) {
	            element.addEventListener(listener, options.eventListener[listener]);
	        }
	    }

	    if (options.innerHTML) {
	        element.innerHTML = options.innerHTML;
	    }

	    if (options.parent) {
	        options.parent.appendChild(element);
	    }

	    return element;
	};

	module.exports = createElement;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['<svg x="0px" y="0px" viewBox="0 0 489.164 489.164" style="width: 50%; height: 50%; padding-left: 25%; padding-top: 25%">', '<path d="M159.582,75.459v285.32c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5s37.009,72.5,82.5,72.5', '	s82.5-32.523,82.5-72.5V168.942l245-60.615v184.416c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5', '	s37.009,72.5,82.5,72.5s82.5-32.523,82.5-72.5V0L159.582,75.459z"/>', '<g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>', '</svg>'].join(' ');

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Visualizer = __webpack_require__(9);

	var Spectral = function (_Visualizer) {
	    _inherits(Spectral, _Visualizer);

	    function Spectral(param) {
	        _classCallCheck(this, Spectral);

	        // Check if HTMLElement exist
	        var _this = _possibleConstructorReturn(this, (Spectral.__proto__ || Object.getPrototypeOf(Spectral)).call(this, param));

	        if (typeof param.canvas === 'string') {
	            _this.canvas = document.querySelector(param.canvas);
	            if (!_this.canvas instanceof HTMLElement) {
	                throw 'Unable to get HTMLElement';
	            }
	        } else if (param.canvas instanceof HTMLElement) {
	            _this.canvas = param.canvas;
	        } else {
	            throw 'Unknown type of element';
	        }

	        // Check if canvas is really a <canvas>
	        if (!_this.canvas.tagName === 'CANVAS') {
	            throw 'Element must be a canvas';
	        }

	        // Initialize
	        _this.freq = new Uint8Array(_this.audioAnalyser.frequencyBinCount);

	        // Fix HiDPI support
	        var rect = _this.canvas.getBoundingClientRect();
	        _this.canvas.width = rect.width * window.devicePixelRatio * 2;
	        _this.canvas.height = rect.height * window.devicePixelRatio * 2;
	        _this.canvas.classList.add('nearestNeighbor');

	        // Canvas
	        _this.canvasContext = _this.canvas.getContext('2d');
	        _this.canvasFillStyle = param.fillStyle || 'rgba(255, 255, 255, 0.3)';

	        // Some other options
	        _this.logarithmic = param.logarithmic || false;
	        _this.bandCount = param.bandCount || 32;
	        _this.linearRegion = param.linearRegion || [0, 0.75];
	        _this.fps = param.fps || 50;
	        _this.showBuoy = param.showBuoy || false;
	        _this.intervalId = null;
	        _this.showingBuoy = new Array(_this.bandCount).fill(_this.canvas.height);

	        // Modern browser!
	        _this.initialized = true;
	        return _this;
	    }

	    _createClass(Spectral, [{
	        key: 'start',
	        value: function start() {
	            var _this2 = this;

	            if (this.intervalId !== null) return;
	            this.intervalId = setInterval(function () {
	                _this2.renderFrame();
	            }, 1000 / this.fps);
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            clearInterval(this.intervalId);
	            this.intervalId = null;
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            this.canvas.classList.remove('nearestNeighbor');
	            this.pause();
	        }
	    }, {
	        key: 'renderFrame',
	        value: function renderFrame() {
	            if (!this.initialized) return;

	            this.audioAnalyser.getByteFrequencyData(this.freq);

	            var tempValue = []; // FIXME: rename this variable.
	            var canvasContext = this.canvasContext;
	            canvasContext.fillStyle = this.canvasFillStyle;
	            canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
	            canvasContext.beginPath();
	            canvasContext.moveTo(0, this.canvas.height);

	            if (this.logarithmic) {
	                for (var i = 0; i != this.bandCount; ++i) {
	                    var sum = 0,
	                        cnt = 0;
	                    var width = Math.log(this.audioAnalyser.frequencyBinCount) / this.bandCount;

	                    for (var j = Math.exp((i - 1) * width); j <= Math.exp(i * width); ++j) {
	                        sum += this.freq[Math.ceil(j)];
	                        cnt++;
	                    }
	                    var value = sum / cnt;
	                    tempValue[i] = value;
	                    this.updateBand(i, value);
	                }
	            } else {
	                var _width = (this.linearRegion[1] - this.linearRegion[0]) * this.audioAnalyser.frequencyBinCount;
	                for (var _i = 0; _i < this.bandCount; ++_i) {
	                    var _sum = 0;
	                    for (var _j = 0; _j < _width / this.bandCount; ++_j) {
	                        var offset = _i * (_width / this.bandCount) + _j + this.audioAnalyser.frequencyBinCount * this.linearRegion[0];
	                        _sum += this.freq[Math.ceil(offset)];
	                    }
	                    var _value = _sum / Math.ceil(_width / this.bandCount);
	                    tempValue[_i] = _value;
	                    this.updateBand(_i, _value);
	                }
	            }
	            canvasContext.lineTo(this.canvas.width, this.canvas.height);
	            canvasContext.lineTo(0, this.canvas.height);
	            canvasContext.fill();

	            if (this.showBuoy) {
	                this.canvasContext.strokeStyle = 'rgba(255, 255, 255, 1)';
	                this.canvasContext.beginPath();
	                for (var _i2 = 0; _i2 < this.bandCount; ++_i2) {
	                    this.updateBuoy(_i2, tempValue[_i2]);
	                }
	                this.canvasContext.stroke();
	            }
	        }
	    }, {
	        key: 'updateBand',
	        value: function updateBand(offset, value) {
	            var width = this.canvas.width / this.bandCount;
	            value /= 256;
	            this.canvasContext.lineTo(Math.ceil(offset * width), Math.ceil((1 - value) * this.canvas.height));
	            this.canvasContext.lineTo(Math.ceil((offset + 1) * width), Math.ceil((1 - value) * this.canvas.height));
	        }
	    }, {
	        key: 'updateBuoy',
	        value: function updateBuoy(offset, value) {
	            var width = this.canvas.width / this.bandCount;
	            value /= 256;
	            var height = Math.ceil((1 - value) * this.canvas.height);
	            if (this.showingBuoy[offset] > height) this.showingBuoy[offset] = height;else {
	                var dt = height - this.showingBuoy[offset];
	                this.showingBuoy[offset] += dt / 10;
	            }
	            this.canvasContext.moveTo(Math.ceil(offset * width), Math.ceil(this.showingBuoy[offset]) - 1);
	            this.canvasContext.lineTo(Math.ceil((offset + 1) * width), Math.ceil(this.showingBuoy[offset]) - 1);
	        }
	    }]);

	    return Spectral;
	}(Visualizer);

	module.exports = Spectral;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	// Abstract class of visualizer

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Visualizer = function () {
	    function Visualizer(param) {
	        _classCallCheck(this, Visualizer);

	        // Check if audio element exists
	        if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === undefined || _typeof(param.audio) === undefined) {
	            throw 'Missing parameter.';
	        }
	        if (typeof param.audioAnalyser === 'undefined' || !param.audioAnalyser instanceof AnalyserNode) {
	            throw 'audioAnalyser is required.';
	        }

	        this.domAudio = param.audio;
	        this.audioAnalyser = param.audioAnalyser;
	    }

	    _createClass(Visualizer, [{
	        key: 'start',
	        value: function start() {
	            // TODO:
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            // TODO:
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            // TODO:
	        }
	    }]);

	    return Visualizer;
	}();

	module.exports = Visualizer;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Visualizer = __webpack_require__(9);

	var Oscillator = function (_Visualizer) {
	    _inherits(Oscillator, _Visualizer);

	    function Oscillator(param) {
	        _classCallCheck(this, Oscillator);

	        // Check if HTMLElement exist
	        var _this = _possibleConstructorReturn(this, (Oscillator.__proto__ || Object.getPrototypeOf(Oscillator)).call(this, param));

	        if (typeof param.canvas === 'string') {
	            _this.canvas = document.querySelector(param.canvas);
	            if (!_this.canvas instanceof HTMLElement) {
	                throw 'Unable to get HTMLElement';
	            }
	        } else if (param.canvas instanceof HTMLElement) {
	            _this.canvas = param.canvas;
	        } else {
	            throw 'Unknown type of element';
	        }

	        // Check if canvas is really a <canvas>
	        if (!_this.canvas.tagName === 'CANVAS') {
	            throw 'Element must be a canvas';
	        }

	        // Initialize
	        _this.dataArray = new Uint8Array(_this.audioAnalyser.fftSize);

	        // Fix HiDPI support
	        var rect = _this.canvas.getBoundingClientRect();
	        _this.canvas.width = rect.width * window.devicePixelRatio;
	        _this.canvas.height = rect.height * window.devicePixelRatio;

	        // Canvas
	        _this.canvasContext = _this.canvas.getContext('2d');
	        _this.canvasFillStyle = param.fillStyle || 'rgba(255, 255, 255, 0.3)';

	        // Some other options
	        _this.fps = param.fps || 50;
	        _this.intervalId = null;

	        // Modern browser!
	        _this.initialized = true;
	        return _this;
	    }

	    _createClass(Oscillator, [{
	        key: 'start',
	        value: function start() {
	            var _this2 = this;

	            if (this.intervalId !== null) return;
	            this.intervalId = setInterval(function () {
	                _this2.renderFrame();
	            }, 1000 / this.fps);
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            clearInterval(this.intervalId);
	            this.intervalId = null;
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            this.pause();
	        }
	    }, {
	        key: 'renderFrame',
	        value: function renderFrame() {
	            var _this3 = this;

	            if (!this.initialized) return;

	            this.audioAnalyser.getByteTimeDomainData(this.dataArray);

	            var tempValue = []; // FIXME: rename this variable.
	            var canvasContext = this.canvasContext;
	            this.canvasContext.strokeStyle = 'rgb(255, 255, 255)';
	            canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
	            canvasContext.beginPath();

	            this.dataArray.forEach(function (data, offset) {
	                if (offset === 0) canvasContext.moveTo(offset * _this3.canvas.width / _this3.dataArray.length, _this3.canvas.height / 2 - (data / 192 - 1) * (_this3.canvas.height / 2));else canvasContext.lineTo(offset * _this3.canvas.width / _this3.dataArray.length, _this3.canvas.height / 2 - (data / 192 - 1) * (_this3.canvas.height / 2));
	            });

	            canvasContext.stroke();
	        }
	    }]);

	    return Oscillator;
	}(Visualizer);

	module.exports = Oscillator;

/***/ }
/******/ ]);