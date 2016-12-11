Nano Player
===========

[![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](LICENSE)
[![Build Status](https://travis-ci.org/ntzyz/nano-player.svg?branch=master)](https://travis-ci.org/ntzyz/nano-player)

[Demo page](https://dev.cczu.edu.cn/~ntzyz/)

### How to use

Here is an example on how to use it:

``` html
<link href="//cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.css" rel="stylesheet">
<div id="player"></div>
<script src="player.js"></script>
<script>
var nanoPlayer = new Player({
    parent: document.getElementById('player'),      // Required, the DOM element of container for our player
    style: {
        width: '300px',
        height: '300px',
    },
    maxBars: 32,                // Optional, bar(or band) count for visualizer
    logarithmic: false,         // Optional, logarithmic scale or linear scale
    fftSize: 512,               // Optional, must be the power of 2 and between 32 and 32768
    autoStart: true,            // Optional, doesn't work for mobile browser
    showVisualizer: true,       // Optional, show visualizer or not
    showProgressBar: true,      // Optional, show progress bar or not
    showLyrics: true,           // Optional, show lyrics or not
    enableBlur: true,           // Optional, enable the blur effect or not
    renderMode: 'canvas',       // Optional, both dom and canvas can be used to display the visualizer.
    playList: [
        {
            url: 'STYX HELIX.aac',      // Required, URL of the song.
            cover: 'STYX HELIX.jpg',    // Recommend, album cover 
            artist: 'MYTH & ROID',      // Recommend, artist of the song.
            title: 'STYX HELIX',        // Recommend, song title
            lrc: '[00:00.00]LyRiCs',    // Optional, content of the LyRiCs file.
            lrcOffset: 0,               // Optional, lyrics offset for this song.
        },
    ]
});
</script>
```

### Tips
The blur filter provided by CSS3 should be disabled on most mobile devices for performance issue. You can initialize player with this option to do that:
``` JavaScript
{
    // ...
    enableBlur: navigator.userAgent.match(/Mobile|Android/) === null,
    // ...
}
```

### Advanced
You can set up two callback for each song: onstart, onfinish. Here is a complex example using this two callbacks to replace cover with a `<video>` tag.

[View demo](https://dev.cczu.edu.cn/~ntzyz/video.html) (Google Chrome, Mozilla Firefox or other desktop browser is required.)

``` JavaScript
var nanoPlayer = new Player({
    parent: document.getElementById('player'),
    style: {
        width: '300px',
        height: '300px',
    },
    maxBars: 64,
    logarithmic: false,
    fftSize: 512,
    linearRegion: [0, 0.75],
    showLyrics: true,
    autoStart: true,
    enableBlur: navigator.userAgent.match(/Mobile|Android/) === null,
    renderMode: 'canvas',
    playList: [
        {
            url: 'VOICES.mp3',
            cover: 'tilt-six,hatsune miku - VOICES.jpg',
            title: 'VOICES',
            artist: 'tilt-six/初音ミク',
            lrc: '[00:01.99]もっと響かせて [00:04.44]きみのメロディ [00:09.95]もっと届かせて [00:12.45]この声を全部 [00:17.15]君と [00:19.93] [00:35.95]もっと溢れてく [00:38.37]イマジネーションと [00:43.91]もっとこだわった [00:46.34]クリエイションを [00:51.18]思いはいつでも [00:55.91]伝えなくちゃ届かないから [01:01.47]もっと声にのせるよ [01:07.93]「声」たちが [01:13.67]続いてゆく限り [01:15.93]これからも [01:21.66]夢をずっと歌う [01:25.04]僕らの声で [01:28.91]つなぎ続けたゆく [01:32.90]彼方を超えて [01:37.32]繋ぎ続ける世界 [01:40.90]VOICES [01:41.94]広げて [01:45.29]きっと叶うよ未来 [01:48.94]新しい声で [01:53.25]歌は溢れて [01:57.92] [02:16.75]終わり',
            lrcOffset: 5200,
            onstart: function(self) {
                // Backup the old width and height for further use.
                this.oldStyle = { width: self.element.style.width, height: self.element.style.height };

                // Update width and height to make it fit for video playback.
                self.uiCollection.songTitle.style.minWidth = self.element.style.width = '533px';
                self.element.style.height = '300px';

                // Create and setup <video>.
                this.video = document.createElement('video');
                this.video.src = 'VOICE.video.mp4'
                this.video.style.width = '100%';
                this.video.style.position = 'center';

                // Setup some event handlers.
                self.domAudio.onpause = function() {
                    this.video.pause();
                }.bind(this);
                self.domAudio.onplay = function() {
                    this.video.play();
                }.bind(this);
                self.domAudio.onseeking = function() {
                    this.video.currentTime = self.domAudio.currentTime;
                    console.log('Syncing');
                }.bind(this);
                this.video.onstalled = this.video.onwaiting = function() {
                    self.domAudio.currentTime = this.video.currentTime;
                    console.log('Syncing');
                }.bind(this);

                // Backup and replace cover with video.
                this.backup = self.uiCollection.cover;
                self.uiCollection.container.replaceChild(
                    this.video,
                    self.uiCollection.cover
                );
            }.bind(this),
            onfinish: function(self) {
                // Restore styles.
                self.uiCollection.songTitle.style.minWidth = self.element.style.width = this.oldStyle.width;
                self.element.style.height = this.oldStyle.height;

                // Restore cover.
                self.uiCollection.container.replaceChild(
                    this.backup,
                    this.video
                );

                // Dispose video tag.
                this.video.remove();
                this.video = undefined

                // Remove event handlers.
                self.domAudio.onpause = undefined;
                self.domAudio.onplay = undefined;
                self.domAudio.onseeking = undefined;
            }.bind(this)
        },
        {
            url: 'Halsey - Castle.untag.mp3',
            cover: 'Halsey - Castle.jpg',
            title: 'Castle',
            artist: 'Halsey',
        },
    ]
});
``` 

### Licenses

MIT
