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
let nanoPlayer = new Player({
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

### Licenses

MIT
