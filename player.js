!function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={exports:{},id:n,loaded:!1};return t[n].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();i(1);var r=function(){function t(e){n(this,t),this.element=e.parent,this.style=e.style||{},this.playList=e.playList,this.barCount=e.maxBars?e.maxBars:128,this.logarithmic=!!e.logarithmic&&e.logarithmic,this.fftSize=e.fftSize,this.autoStart=!!e.autoStart&&e.autoStart,this.showVisualizer=!e.showVisualizer||e.showVisualizer,this.showProgressBar=!e.showProgressBar||e.showProgressBar,this.enableBlur="undefined"==typeof e.enableBlur||e.enableBlur,this.showLyrics=!!e.showLyrics&&e.showLyrics,this.dropRate="undefined"!=typeof e.dropRate?e.dropRate:1,this.linearRegion=e.linearRegion?e.linearRegion:[0,1],this.currentTrack=0,this.intervals={},this.lyrics={},this.initUI(),this.initAudio(),this.initLyrics(),this.initVisualizer(),this.reinit(),this.autoStart&&this.play()}return s(t,[{key:"initUI",value:function(){var t=this;this.element.style.position="relative",this.element.style.width=this.style.width||"300px",this.element.style.height=this.style.height||"300px",this.element.style.overflow="hidden",this.element.classList.add("__nano_player__"),this.uiStatus="unfocus",this.uiCollection={},this.showingFreq=[];var e=document.createElement("DIV");e.classList.add("cover"),e.style.overflow="hidden";var i=document.createElement("DIV");i.className="cover hidden",i.style.zIndex="3";var n=document.createElement("H1");n.classList.add("songTitle");var s=document.createElement("H2");s.classList.add("songArtist");var r=document.createElement("DIV");r.classList.add("lyrics");var a=document.createElement("DIV");a.className="cover hidden",a.style.zIndex="3",a.style.margin="0 auto";var o=document.createElement("DIV");o.classList.add("controls");var l=document.createElement("I");l.className="fa fa-play controlButton",l.setAttribute("aria-hidden","true"),l.style.fontSize="3em",l.style.marginLeft=l.style.marginRight="10%",l.addEventListener("click",function(e){"unfocus"!=t.uiStatus&&(e.stopPropagation(),t.domAudio.paused?t.play():t.pause())});var c=document.createElement("I");c.className="fa fa-forward controlButton",c.setAttribute("aria-hidden","true"),c.style.fontSize="3em",c.addEventListener("click",function(e){"unfocus"!=t.uiStatus&&(e.stopPropagation(),t.nextTrack())});var u=document.createElement("I");u.className="fa fa-backward controlButton",u.setAttribute("aria-hidden","true"),u.style.fontSize="3em",u.addEventListener("click",function(e){"unfocus"!=t.uiStatus&&(e.stopPropagation(),t.prevTrack())});var d=document.createElement("DIV");d.className="progress",d.overflow="hidden",d.addEventListener("click",function(e){if("unfocus"!=t.uiStatus){e.stopPropagation();var i=d.getBoundingClientRect(),n=i.left;t.domAudio.currentTime=t.domAudio.duration*(e.clientX-n)/d.clientWidth,t.renderVisualizer()}});var h=document.createElement("DIV");h.style.height="100%",h.style.backgroundColor="white",d.appendChild(h);var p=document.createElement("DIV");p.classList.add("visualizer");var f=document.createElement("I");f.className="fa fa-list-ul navButton",f.setAttribute("aria-hidden","true"),f.style.position="absolute",f.style.bottom="3%",f.style.right="3%",f.style.fontSize="1.2em",f.style.color="white",f.addEventListener("click",function(i){"unfocus"!=t.uiStatus&&(i.stopPropagation(),e.classList.add("outside-left"),m.classList.remove("outside-right"))});var y=document.createElement("DIV");y.classList.add("cover"),y.style.zIndex="2";var v=document.createElement("DIV");v.classList.add("cover"),v.style.zIndex="1",v.style.backgroundSize="cover";var g=document.createElement("DIV");g.style.zIndex="0",g.classList.add("cover"),g.innerHTML=['<svg x="0px" y="0px" viewBox="0 0 489.164 489.164" style="width: 50%; height: 50%; padding-left: 25%; padding-top: 25%">','<path d="M159.582,75.459v285.32c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5s37.009,72.5,82.5,72.5',"\ts82.5-32.523,82.5-72.5V168.942l245-60.615v184.416c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5",'\ts37.009,72.5,82.5,72.5s82.5-32.523,82.5-72.5V0L159.582,75.459z"/>',"<g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>","</svg>"].join("\n"),g.style.backgroundColor="white";var m=document.createElement("DIV");m.className="cover outside-right playlist",m.style.backgroundColor="black";var b=document.createElement("DIV");b.className="headbar";var _=document.createElement("I");_.className="fa fa-chevron-left navButton",_.setAttribute("aria-hidden","true"),_.style.position="absolute",_.style.left="3%",_.style.fontSize="1.2em",_.style.lineHeight="44px",_.style.color="white",_.addEventListener("click",function(i){"unfocus"!=t.uiStatus&&(i.stopPropagation(),e.classList.remove("outside-left"),m.classList.add("outside-right"))});var L=document.createElement("SPAN");L.style.lineHeight="44px",L.innerHTML="播放列表",b.appendChild(_),b.appendChild(L),m.appendChild(b);var x=document.createElement("DIV");x.className="listContainer",m.appendChild(x);var w=document.createElement("DIV");x.appendChild(w),this.playListElem=[];var C=function(e){var i=document.createElement("DIV");i.className="list",i.offset=e;var n=document.createElement("DIV");n.className="face",n.style.backgroundImage="url('"+t.playList[e].cover+"')";var s=document.createElement("DIV");s.className="title",s.innerHTML=t.playList[e].title+' <br /> <span style="font-size: 0.8em">'+t.playList[e].artist+"</span>",i.appendChild(n),i.appendChild(s),i.addEventListener("click",function(){t.domAudio.pause(),t.currentTrack=i.offset,t.reinit(),t.domAudio.play(),t.flushStatus()}),w.appendChild(i),t.playListElem.push(i)};for(var k in this.playList)C(k);i.appendChild(s),i.appendChild(n),i.appendChild(r),e.appendChild(i),o.appendChild(u),o.appendChild(l),o.appendChild(c),a.appendChild(o),this.showProgressBar&&a.appendChild(d),a.appendChild(p),a.appendChild(f),e.appendChild(a),e.appendChild(y),e.appendChild(v),e.appendChild(g),this.element.appendChild(e),this.element.appendChild(m),n.style.minWidth=this.element.clientWidth+"px",this.element.clientWidth<n.clientWidth&&!function(){var e=n.clientWidth,i=0;n.innerText=n.innerText+"    "+n.innerText;var s=function(){n.style.marginLeft=i+"px",i-=1,i+e<=0&&(i=0)};t.intervals.songTitleMarq=setInterval(s,20)}(),e.addEventListener("click",function(e){"unfocus"==t.uiStatus?(t.enableBlur&&[v,g].forEach(function(t){return t.classList.add("blur")}),[l,u,c,d].forEach(function(t){t.classList.add("pointer")}),y.style.backgroundColor="rgba(0, 0, 0, .5)",[i,a].forEach(function(t){t.classList.remove("hidden")}),t.uiStatus="focus"):(t.enableBlur&&[v,g].forEach(function(t){return t.classList.remove("blur")}),[l,u,c,d].forEach(function(t){t.classList.remove("pointer")}),y.style.backgroundColor="",[i,a].forEach(function(t){t.classList.add("hidden")}),t.uiStatus="unfocus")}),this.visualNode=p,this.lrcNode=r,this.progressBar=h,this.uiCollection={container:e,mediainfo:i,songTitle:n,songArtist:s,lyrics:r,controller:a,controls:o,playButton:l,nextButton:c,prevButton:u,progress:d,progressInner:h,visualizer:p,overlay:y,cover:v,legacyCover:g}}},{key:"initAudio",value:function(){var t=this;this.domAudio=document.createElement("AUDIO"),this.domAudio.crossOrigin="anonymous",this.element.appendChild(this.domAudio);try{this.audio={},this.audio.ctx=new AudioContext,this.audio.source=this.audio.ctx.createMediaElementSource(this.domAudio),this.audio.analyser=this.audio.ctx.createAnalyser(),this.audio.analyser.fftSize=this.fftSize?this.fftSize:this.audio.analyser.fftSize,this.audio.source.connect(this.audio.analyser),this.audio.source.connect(this.audio.ctx.destination),this.freq=new Uint8Array(this.audio.analyser.frequencyBinCount)}catch(t){this.audio=null,console.log("Failed on initAudio")}this.domAudio.addEventListener("ended",function(){t.nextTrack()})}},{key:"initLyrics",value:function(){var t=this;if(this.showLyrics){if(this.updateLyrics=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];try{var i=1e3*t.domAudio.currentTime;t.lyrics.lines;for(t.lyrics.table.length==t.lyrics.lines&&clearInterval(t.intervals.lyrics);t.lyrics.table[t.lyrics.lines-1]&&t.lyrics.table[t.lyrics.lines-1].offset>i;)t.lyrics.lines--;for(;t.lyrics.table[t.lyrics.lines].offset<=i;)e?(t.lrcNode.innerText=t.lyrics.table[t.lyrics.lines].lyric,t.lyrics.lines++):(t.lrcNode.style.opacity=.5,t.lyrics.lines++,setTimeout(function(){t.lrcNode.innerText=t.lyrics.table[t.lyrics.lines-1].lyric,t.lrcNode.style.opacity=1},50))}catch(e){clearInterval(t.intervals.lyrics)}},!this.nowPlaying.lrc)return this.lyrics.hasListener&&this.domAudio.removeEventListener("seeking",this.updateLyrics),this.lyrics={},void(this.lrcNode.innerText="♪～(￣ε￣)");this.lyrics.table=[];var e=[];this.nowPlaying.lrc.split("[").forEach(function(i,n){t.nowPlaying.lrcOffset=t.nowPlaying.lrcOffset?t.nowPlaying.lrcOffset:0;var s=function(e){return 1e3*(60*e[1]+1*e[2])+10*e[3].substr(0,2)+t.nowPlaying.lrcOffset};if(""!=i){"["!=i[0]&&(i="["+i);var r=i.match(/\[(\d+):(\d+).(\d+)\](.*)/);if(""==r[4]){e.push(n);var a=s(r);return void t.lyrics.table.push({offset:a,lyric:""})}var o=s(r);for(t.lyrics.table.push({offset:o,lyric:r[4]});e.length>0;){var l=e.shift()-1;t.lyrics.table[l].lyric=r[4]}}}),this.lyrics.table.sort(function(t,e){return t.offset-e.offset}),this.lyrics.hasListener||(this.domAudio.addEventListener("seeking",this.updateLyrics),this.lyrics.hasListener=!0),this.lyrics.lines=0}}},{key:"updateBar",value:function(t,e){var i=this.barArray[t];if(i){e/=2.56;var n=i.style.height.substring(0,i.style.height.length-1);if(n=parseFloat(n),e<n){var s=n-e;e+=s*(1-this.dropRate)}i.style.height=e+"%"}}},{key:"renderVisualizer",value:function(){if(this.showProgressBar&&(this.progressBar.style.width=100*Math.min(this.domAudio.currentTime/this.domAudio.duration,1)+"%"),this.showVisualizer&&null!==this.audio&&(this.audio.analyser.getByteFrequencyData(this.freq),!this.domAudio.paused))if(this.logarithmic)for(var t=0;t!=this.barCount;++t){for(var e=0,i=0,n=Math.log(this.audio.analyser.frequencyBinCount)/this.barCount,s=Math.exp((t-1)*n);s<=Math.exp(t*n);++s)e+=this.freq[Math.ceil(s)],i++;var r=e/i;this.updateBar(t,r)}else for(var a=(this.linearRegion[1]-this.linearRegion[0])*this.audio.analyser.frequencyBinCount,o=0;o<this.barCount;++o){for(var l=0,c=0;c<a/this.barCount;++c){var u=o*(a/this.barCount)+c+this.audio.analyser.frequencyBinCount*this.linearRegion[0];l+=this.freq[Math.ceil(u)]}var d=l/(a/this.barCount);this.updateBar(o,d)}}},{key:"flushStatus",value:function(){this.domAudio.paused?(this.uiCollection.playButton.classList.remove("fa-pause"),this.uiCollection.playButton.classList.add("fa-play")):(this.uiCollection.playButton.classList.remove("fa-play"),this.uiCollection.playButton.classList.add("fa-pause"))}},{key:"play",value:function(){var t=this;this.initLyrics(),this.intervals.lyrics=setInterval(function(){t.updateLyrics(!1)},20),this.intervals.visualizer=setInterval(function(){t.renderVisualizer()},17),this.domAudio.play(),this.flushStatus()}},{key:"pause",value:function(){clearInterval(this.intervals.lyrics),clearInterval(this.intervals.visualizer),this.domAudio.pause(),this.flushStatus()}},{key:"nextTrack",value:function(){this.pause(),this.currentTrack++,this.currentTrack%=this.playList.length,this.reinit(),this.play()}},{key:"prevTrack",value:function(){this.currentTrack--,this.currentTrack<0&&(this.currentTrack+=this.playList.length),this.currentTrack%=this.playList.length,this.reinit(),this.play()}},{key:"reinit",value:function(){var t=this;this.uiCollection.songTitle.innerHTML=this.nowPlaying.title?this.nowPlaying.title:"未知歌曲",this.uiCollection.songArtist.innerHTML=this.nowPlaying.artist?this.nowPlaying.artist:"未知艺术家",this.uiCollection.progressInner.style.width="0",this.uiCollection.cover.style.backgroundImage="url('"+this.nowPlaying.cover+"')",this.playListElem.forEach(function(e,i){i==t.currentTrack?e.classList.add("now_playing"):e.classList.remove("now_playing")}),this.domAudio.src=this.nowPlaying.url,this.initLyrics(),clearInterval(this.intervals.songTitleMarq),this.uiCollection.songTitle.style.marginLeft="",this.element.clientWidth<this.uiCollection.songTitle.clientWidth&&!function(){var e=t.uiCollection.songTitle;e.innerText=e.innerText+"        ";var i=e.clientWidth,n=40;e.innerText=e.innerText+e.innerText;var s=function(){n<0&&(e.style.marginLeft=n+"px"),n-=.5,n+i<=0&&(n=40)};t.intervals.songTitleMarq=setInterval(s,20)}(),this.lrcNode.innerHTML="",this.flushStatus()}},{key:"nowPlaying",get:function(){return this.playList[this.currentTrack]}}]),s(t,[{key:"initVisualizer",value:function(){if(this.showVisualizer&&null!==this.audio){this.barArray=[],this.visualNode.innerHTML="";for(var t=this.visualNode.clientWidth/this.barCount,e=0;e!=this.barCount;++e){var i=document.createElement("DIV");i.style.width=t+"px",i.style.marginLeft=e*t+1+"px",i.style.bottom="0",i.style.position="absolute",i.style.display="inline-block",i.style.backgroundColor="rgba(255, 255, 255, 0.3)",i.id="bar"+e,this.visualNode.appendChild(i),this.barArray.push(i)}}}}]),t}();window.Player=r},function(t,e,i){var n=i(2);"string"==typeof n&&(n=[[t.id,n,""]]);i(4)(n,{});n.locals&&(t.exports=n.locals)},function(t,e,i){e=t.exports=i(3)(),e.push([t.id,".__nano_player__ .cover{position:absolute;width:100%;height:100%;transition:all .3s ease;color:#fff;cursor:default}.__nano_player__ .blur{filter:blur(10px)}.__nano_player__ .hidden{opacity:0}.__nano_player__ h1.songTitle{font-weight:400;margin:1%;font-size:150%;text-align:center;white-space:pre;display:inline-block}.__nano_player__ h2.songArtist{font-weight:400;margin-top:2%;margin-bottom:0;font-size:100%;text-align:center;line-height:1em}.__nano_player__ div.lyrics{font-weight:400;margin:1%;font-size:80%;text-align:center;transition:all .05s ease}.__nano_player__ .progress{position:absolute;bottom:5%;left:25%;width:50%;height:1%;margin:0 auto;border:1px solid #fff}.__nano_player__ .controls{position:absolute;height:20%;width:100%;bottom:35%;text-align:center}.__nano_player__ .visualizer{position:absolute;bottom:7%;left:25%;width:50%;height:12%;margin:0 auto}.__nano_player__ i.controlButton{min-width:50px;display:inline-block;text-align:center}.__nano_player__ .pointer,.__nano_player__ i.navButton{cursor:pointer}.__nano_player__ .outside-left{margin-left:-100%}.__nano_player__ .outside-right{margin-left:100%}.__nano_player__ .playlist{position:absolute;overflow:hidden}.__nano_player__ .headbar{background-color:#000;height:44px;width:100%;text-align:center;position:absolute}.__nano_player__ .list{width:100%;height:64px;transition:all .2s ease}.__nano_player__ .now_playing{background-color:#333}.__nano_player__ .listContainer{position:absolute;top:44px;left:0;right:-17px;bottom:0;overflow-y:scroll}.__nano_player__ .list>.face{position:absolute;height:64px;width:64px;display:inline-block;background-size:cover}.__nano_player__ .list>.title{position:absolute;padding-left:12px;left:64px;right:0;padding-top:12px;display:inline-block;text-overflow:ellipsis;overflow:hidden;line-height:20px;white-space:nowrap}",""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},s=0;s<this.length;s++){var r=this[s][0];"number"==typeof r&&(n[r]=!0)}for(s=0;s<e.length;s++){var a=e[s];"number"==typeof a[0]&&n[a[0]]||(i&&!a[2]?a[2]=i:i&&(a[2]="("+a[2]+") and ("+i+")"),t.push(a))}},t}},function(t,e,i){function n(t,e){for(var i=0;i<t.length;i++){var n=t[i],s=p[n.id];if(s){s.refs++;for(var r=0;r<s.parts.length;r++)s.parts[r](n.parts[r]);for(;r<n.parts.length;r++)s.parts.push(c(n.parts[r],e))}else{for(var a=[],r=0;r<n.parts.length;r++)a.push(c(n.parts[r],e));p[n.id]={id:n.id,refs:1,parts:a}}}}function s(t){for(var e=[],i={},n=0;n<t.length;n++){var s=t[n],r=s[0],a=s[1],o=s[2],l=s[3],c={css:a,media:o,sourceMap:l};i[r]?i[r].parts.push(c):e.push(i[r]={id:r,parts:[c]})}return e}function r(t,e){var i=v(),n=b[b.length-1];if("top"===t.insertAt)n?n.nextSibling?i.insertBefore(e,n.nextSibling):i.appendChild(e):i.insertBefore(e,i.firstChild),b.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");i.appendChild(e)}}function a(t){t.parentNode.removeChild(t);var e=b.indexOf(t);e>=0&&b.splice(e,1)}function o(t){var e=document.createElement("style");return e.type="text/css",r(t,e),e}function l(t){var e=document.createElement("link");return e.rel="stylesheet",r(t,e),e}function c(t,e){var i,n,s;if(e.singleton){var r=m++;i=g||(g=o(e)),n=u.bind(null,i,r,!1),s=u.bind(null,i,r,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(i=l(e),n=h.bind(null,i),s=function(){a(i),i.href&&URL.revokeObjectURL(i.href)}):(i=o(e),n=d.bind(null,i),s=function(){a(i)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else s()}}function u(t,e,i,n){var s=i?"":n.css;if(t.styleSheet)t.styleSheet.cssText=_(e,s);else{var r=document.createTextNode(s),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(r,a[e]):t.appendChild(r)}}function d(t,e){var i=e.css,n=e.media;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}function h(t,e){var i=e.css,n=e.sourceMap;n&&(i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var s=new Blob([i],{type:"text/css"}),r=t.href;t.href=URL.createObjectURL(s),r&&URL.revokeObjectURL(r)}var p={},f=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},y=f(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),v=f(function(){return document.head||document.getElementsByTagName("head")[0]}),g=null,m=0,b=[];t.exports=function(t,e){e=e||{},"undefined"==typeof e.singleton&&(e.singleton=y()),"undefined"==typeof e.insertAt&&(e.insertAt="bottom");var i=s(t);return n(i,e),function(t){for(var r=[],a=0;a<i.length;a++){var o=i[a],l=p[o.id];l.refs--,r.push(l)}if(t){var c=s(t);n(c,e)}for(var a=0;a<r.length;a++){var l=r[a];if(0===l.refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete p[l.id]}}}};var _=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()}]);