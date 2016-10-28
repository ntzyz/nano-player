Nano Player
===========

[![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](LICENSE)
[![Build Status](https://travis-ci.org/ntzyz/nano-player.svg?branch=master)](https://travis-ci.org/ntzyz/nano-player)

[Demo page](https://dev.cczu.edu.cn/~ntzyz/)

#### Status

Working in progress

Note that Internet Explorer 11 does not support `<audio>` with Advanced Audio Coding (a.k.a AAC), so the demo included in the repo will not work on IE11.

Also, `autoStart` does not work on mobile browsers, set it to `false` seems to be a good choice.

#### How to use

It's quiet easy:

``` html
<div id="player"></div>
<script src="player.js"></script>
<script>
let player = new Player({
    parent: document.getElementById('player'),
    maxBars: 32,
    logarithmic: false,
    fftSize: 512,
    autoStart: true,
    showVisualizer: true,
    showProgressBar: true,
    showLyrics: true,
    enableBlur: true,
    playList: [
        {
            url: 'media/MYTH & ROID - STYX HELIX.aac',
            cover: 'cover/MYTH & ROID - STYX HELIX.jpg',
            artist: 'MYTH & ROID',
            title: 'STYX HELIX',
            lrc: '[00:00.00]This should be the content of the LyRiCs file.',
        },
    ]
}
</script>
```

#### Licenses

MIT
