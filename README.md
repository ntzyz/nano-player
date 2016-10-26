Nano Player
===========

[Demo page](https://dev.cczu.edu.cn/~ntzyz/)

#### Status

Working in progress

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
