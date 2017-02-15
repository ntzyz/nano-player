!function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={exports:{},id:n,loaded:!1};return t[n].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();i(1),i(2);var a=i(6),o=i(7),r=i(8),l=i(9),c=i(10),h=i(11),u=i(12),d=i(13),f=i(14),p=i(16),g=function(){function t(e){var i=this;n(this,t),this.element=e.parent,this.style=e.style||{},this.playList=e.playList,this.barCount=e.maxBars?e.maxBars:128,this.logarithmic=!!e.logarithmic&&e.logarithmic,this.fftSize=e.fftSize,this.autoStart=!!e.autoStart&&e.autoStart,this.showVisualizer=!e.showVisualizer||e.showVisualizer,this.showProgressBar=!e.showProgressBar||e.showProgressBar,this.enableBlur="undefined"==typeof e.enableBlur||e.enableBlur,this.showLyrics=!!e.showLyrics&&e.showLyrics,this.dropRate="undefined"!=typeof e.dropRate?e.dropRate:1,this.linearRegion=e.linearRegion?e.linearRegion:[0,1],this.renderMode=e.renderMode||"canvas",this.showBuoy=!!e.showBuoy&&e.showBuoy,this.currentTrack=0,this.intervals={},this.lyrics={},this.initUI(),this.initAudio(),this.initLyrics(),this.reinit();var s=function(){"undefined"!=typeof i.showingVisualizer?(i.visualizer.dispose(),"spectral"===i.showingVisualizer?i.showingVisualizer="oscillator":i.showingVisualizer="spectral"):i.showingVisualizer="spectral","spectral"===i.showingVisualizer?i.visualizer=new f({audio:i.domAudio,audioAnalyser:i.audioAnalyser,canvas:i.visualNode,logarithmic:i.logarithmic,bandCount:i.barCount,linearRegion:i.linearRegion,showBuoy:i.showBuoy,fps:50}):i.visualizer=new p({audio:i.domAudio,audioAnalyser:i.audioAnalyser,canvas:i.visualNode,fps:50}),i.visualizer.start()};this.showVisualizer&&this.audioContext&&(this.visualNode.addEventListener("click",function(t){"unfocus"!=i.uiStatus&&(t.stopPropagation(),s())}),s()),this.autoStart&&this.switchTo(0,!0)}return s(t,[{key:"initUI",value:function(){var t=this;this.element.style.position="relative",this.element.style.width=this.style.width||"300px",this.element.style.height=this.style.height||"300px",this.element.style.overflow="hidden",this.element.classList.add("__nano_player__"),this.uiStatus="unfocus",this.uiCollection={},this.showingFreq=[];var e=a({tagName:"div",classList:["cover"],style:{overflow:"hidden"}}),i=a({tagName:"div",classList:["cover","hidden"],style:{zIndex:3}}),n=a({tagName:"h1",classList:["songTitle"],style:{fontSize:Math.min(this.element.clientWidth,this.element.clientHeight)/12+"px"}}),s=a({tagName:"h2",classList:["songArtist"],style:{fontSize:Math.min(this.element.clientWidth,this.element.clientHeight)/18+"px"}}),l=a({tagName:"div",classList:["lyrics","gpu"],style:{fontSize:Math.min(this.element.clientWidth,this.element.clientHeight)/25+"px"}}),f=a({tagName:"div",classList:["cover","hidden"],style:{zIndex:"3",margin:"0 auto"}}),p=a({tagName:"div",classList:["controls"]}),g=a({tagName:"div",classList:["controlButton"],attr:{"aria-hidden":!0},innerHTML:r,style:{fontSize:"3em",marginLeft:"8%",marginRight:"7%",display:"inline-block",width:"20%",height:"100%"},eventListener:{click:function(e){"unfocus"!=t.uiStatus&&(e.stopPropagation(),t.domAudio.paused?t.play():t.pause())}}}),y=a({tagName:"div",innerHTML:c,style:{display:"inline-block",width:"20%",height:"100%"},eventListener:{click:function(e){"unfocus"!=t.uiStatus&&(e.stopPropagation(),t.nextTrack())}}}),v=a({tagName:"div",innerHTML:h,style:{display:"inline-block",width:"20%",height:"100%"},eventListener:{click:function(e){"unfocus"!=t.uiStatus&&(e.stopPropagation(),t.prevTrack())}}}),m=a({tagName:"div",classList:["progress"],style:{overflow:"hidden"},eventListener:{click:function(e){if("unfocus"!=t.uiStatus){e.stopPropagation();var i=m.getBoundingClientRect(),n=i.left;t.domAudio.currentTime=t.domAudio.duration*(e.clientX-n)/m.clientWidth,t.updateProgress()}}}}),w=a({tagName:"div",style:{height:"100%",backgroundColor:"white"}});m.appendChild(w);var b=void 0;b=a("canvas"===this.renderMode?{tagName:"canvas",classList:["visualizer"]}:{tagName:"div",classList:["visualizer"]});var x=a({tagName:"div",classList:["navButton"],attr:{"aria-hidden":!0},innerHTML:u,style:{position:"absolute",bottom:"1%",right:"1%",width:"10%",height:"10%",color:"white"},eventListener:{click:function(i){"unfocus"!=t.uiStatus&&(i.stopPropagation(),e.classList.add("outside-left"),C.classList.remove("outside-right"))}}}),_=a({tagName:"div",classList:["cover"],style:{zIndex:"2"}}),k=a({tagName:"div",classList:["cover","gpu"],style:{zIndex:"1",backgroundSize:"cover",backgroundPosition:"center"}}),L=a({tagName:"div",classList:["cover","gpu"],innerHTML:o,style:{backgroundColor:"white"}}),C=a({tagName:"div",classList:["cover","outside-right","playlist"],style:{backgroundColor:"black"}}),T=a({tagName:"div",parent:C,classList:["headbar"]}),A=(a({tagName:"div",parent:T,classList:["navButton"],innerHTML:d,style:{position:"absolute",left:"10px",top:"10px",width:"24px",height:"24px"},eventListener:{click:function(i){"unfocus"!=t.uiStatus&&(i.stopPropagation(),e.classList.remove("outside-left"),C.classList.add("outside-right"))}}}),a({tagName:"span",parent:T,style:{lineHeight:"44px"},innerHTML:"播放列表"}),a({tagName:"div",classList:["listContainer"],parent:C})),M=a({tagName:"div",parent:A});this.playListElem=[];var S=function(e){var i=document.createElement("DIV");i.className="list",i.offset=e;var n=document.createElement("DIV");n.className="face",n.style.backgroundImage="url('"+t.playList[e].cover+"')",n.style.position="absolute",n.style.zIndex=2,n.style.width="100%",n.style.height="100%";var s=document.createElement("DIV");s.innerHTML=o,s.style.position="absolute",s.style.zIndex=1,s.style.backgroundColor="grey",s.style.width="100%",s.style.height="100%";var a=document.createElement("DIV");a.className="face";var r=document.createElement("DIV");r.className="face faceWrapper",r.style.position="relative",r.appendChild(n),r.appendChild(s),a.appendChild(r);var l=document.createElement("DIV");l.className="title",l.innerHTML=t.playList[e].title+' <br /> <span style="font-size: 0.8em">'+t.playList[e].artist+"</span>",i.appendChild(a),i.appendChild(l),i.addEventListener("click",function(){t.switchTo(i.offset)}),M.appendChild(i),t.playListElem.push(i)};for(var B in this.playList)S(B);if(i.appendChild(s),i.appendChild(n),i.appendChild(l),e.appendChild(i),p.appendChild(v),p.appendChild(g),p.appendChild(y),f.appendChild(p),this.showProgressBar&&f.appendChild(m),f.appendChild(b),f.appendChild(x),e.appendChild(f),e.appendChild(_),e.appendChild(k),e.appendChild(L),this.element.appendChild(e),this.element.appendChild(C),n.style.minWidth=this.element.clientWidth+"px",this.element.clientWidth<n.clientWidth&&!function(){var e=n.clientWidth,i=0;n.innerText=n.innerText+"    "+n.innerText;var s=function(){n.style.marginLeft=i+"px",i-=1,i+e<=0&&(i=0)};t.intervals.songTitleMarq=setInterval(s,20)}(),e.addEventListener("click",function(e){"unfocus"==t.uiStatus?(t.enableBlur&&[k,L].forEach(function(t){return t.classList.add("blur")}),[g,v,y,m].forEach(function(t){t.classList.add("pointer")}),_.style.backgroundColor="rgba(0, 0, 0, .5)",[i,f].forEach(function(t){t.classList.remove("hidden")}),t.uiStatus="focus"):(t.enableBlur&&[k,L].forEach(function(t){return t.classList.remove("blur")}),[g,v,y,m].forEach(function(t){t.classList.remove("pointer")}),_.style.backgroundColor="",[i,f].forEach(function(t){t.classList.add("hidden")}),t.uiStatus="unfocus")}),this.visualNode=b,this.lrcNode=l,this.progressBar=w,"canvas"===this.renderMode){var N=b.getBoundingClientRect();b.width=N.width*window.devicePixelRatio*2,b.height=N.height*window.devicePixelRatio*2,this.ctx=this.visualNode.getContext("2d")}this.uiCollection={container:e,mediainfo:i,songTitle:n,songArtist:s,lyrics:l,controller:f,controls:p,playButton:g,nextButton:y,prevButton:v,progress:m,progressInner:w,visualizer:b,overlay:_,cover:k,legacyCover:L}}},{key:"initAudio",value:function(){var t=this;this.domAudio=document.createElement("AUDIO"),this.domAudio.crossOrigin="anonymous",this.element.appendChild(this.domAudio);try{this.audioContext=new AudioContext,this.audioSource=this.audioContext.createMediaElementSource(this.domAudio),this.audioAnalyser=this.audioContext.createAnalyser(),this.audioAnalyser.fftSize=this.fftSize||this.audioAnalyser.fftSize,this.audioSource.connect(this.audioAnalyser),this.audioSource.connect(this.audioContext.destination)}catch(t){this.audioContext=null}this.domAudio.addEventListener("ended",function(){t.nextTrack()})}},{key:"initLyrics",value:function(){var t=this;if(this.showLyrics){if(this.updateLyrics=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];try{var i=1e3*t.domAudio.currentTime;t.lyrics.lines;for(t.lyrics.table.length==t.lyrics.lines&&clearInterval(t.intervals.lyrics);t.lyrics.table[t.lyrics.lines-1]&&t.lyrics.table[t.lyrics.lines-1].offset>i;)t.lyrics.lines--;for(;t.lyrics.table[t.lyrics.lines].offset<=i;)e?(t.lrcNode.innerText=t.lyrics.table[t.lyrics.lines].lyric,t.lyrics.lines++):(t.lrcNode.style.opacity=.5,t.lyrics.lines++,setTimeout(function(){t.lrcNode.innerText=t.lyrics.table[t.lyrics.lines-1].lyric,t.lrcNode.style.opacity=1},50))}catch(e){clearInterval(t.intervals.lyrics)}},!this.nowPlaying.lrc)return this.lyrics.hasListener&&this.domAudio.removeEventListener("seeking",this.updateLyrics),this.lyrics={},void(this.lrcNode.innerText="♪～(￣ε￣)");this.lyrics.table=[];var e=[];this.nowPlaying.lrc.split("[").forEach(function(i,n){t.nowPlaying.lrcOffset=t.nowPlaying.lrcOffset?t.nowPlaying.lrcOffset:0;var s=function(e){return 1e3*(60*e[1]+1*e[2])+10*e[3].substr(0,2)+t.nowPlaying.lrcOffset};if(""!=i&&("["!=i[0]&&(i="["+i),/\[(\d+):(\d+).(\d+)\](.*)/.test(i))){var a=i.match(/\[(\d+):(\d+).(\d+)\](.*)/);if(""==a[4]){e.push(n);var o=s(a);return void t.lyrics.table.push({offset:o,lyric:""})}var r=s(a);for(t.lyrics.table.push({offset:r,lyric:a[4]});e.length>0;){var l=e.shift()-1;t.lyrics.table[l].lyric=a[4]}}}),this.lyrics.table.sort(function(t,e){return t.offset-e.offset}),this.lyrics.hasListener||(this.domAudio.addEventListener("seeking",this.updateLyrics),this.lyrics.hasListener=!0),this.lyrics.lines=0}}},{key:"updateProgress",value:function(){this.showProgressBar&&(this.progressBar.style.width=100*Math.min(this.domAudio.currentTime/this.domAudio.duration,1)+"%")}},{key:"flushStatus",value:function(){this.domAudio.paused?this.uiCollection.playButton.innerHTML=r:this.uiCollection.playButton.innerHTML=l}},{key:"play",value:function(){var t=this;this.initLyrics(),this.showLyrics&&(this.intervals.lyrics=setInterval(function(){t.updateLyrics(!1)},20)),this.intervals.progress=setInterval(function(){t.updateProgress()},200),this.domAudio.play(),this.flushStatus()}},{key:"pause",value:function(){clearInterval(this.intervals.lyrics),this.domAudio.pause(),this.flushStatus()}},{key:"nextTrack",value:function(){this.switchTo(this.currentTrack+1)}},{key:"prevTrack",value:function(){this.switchTo(this.currentTrack-1)}},{key:"reinit",value:function(){var t=this;this.uiCollection.songTitle.innerHTML=this.nowPlaying.title?this.nowPlaying.title:"未知歌曲",this.uiCollection.songArtist.innerHTML=this.nowPlaying.artist?this.nowPlaying.artist:"未知艺术家",this.uiCollection.progressInner.style.width="0",this.uiCollection.cover.style.backgroundImage="url('"+this.nowPlaying.cover+"')",this.playListElem.forEach(function(e,i){i==t.currentTrack?e.classList.add("now_playing"):e.classList.remove("now_playing")}),this.domAudio.src=this.nowPlaying.url,this.initLyrics(),clearInterval(this.intervals.songTitleMarq),this.uiCollection.songTitle.style.marginLeft="",this.element.clientWidth<this.uiCollection.songTitle.clientWidth&&!function(){var e=t.uiCollection.songTitle;e.innerText=e.innerText+"        ";var i=e.clientWidth,n=40;e.innerText=e.innerText+e.innerText;var s=function(){n<0&&(e.style.marginLeft=n+"px"),n-=.5,n+i<=0&&(n=40)};t.intervals.songTitleMarq=setInterval(s,20)}(),this.lrcNode.innerHTML="",this.flushStatus()}},{key:"nowPlaying",get:function(){return this.playList[this.currentTrack]}}]),s(t,[{key:"switchTo",value:function(t,e){var i=!1;this.pause(),this.nowPlaying.onfinish&&!e&&this.nowPlaying.onfinish(this),this.currentTrack=t,this.currentTrack<0&&(this.currentTrack+=this.playList.length),this.currentTrack===this.playList.length&&(i=!0),this.currentTrack%=this.playList.length,this.reinit(),this.nowPlaying.onstart&&this.nowPlaying.onstart(this),i||this.play(),this.flushStatus()}}]),t}();window.Player=g},function(t,e){/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
"document"in window.self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))?!function(){"use strict";var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var i,n=arguments.length;for(i=0;i<n;i++)t=arguments[i],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var i=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:i.call(this,t)}}t=null}():!function(t){"use strict";if("Element"in t){var e="classList",i="prototype",n=t.Element[i],s=Object,a=String[i].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[i].indexOf||function(t){for(var e=0,i=this.length;e<i;e++)if(e in this&&this[e]===t)return e;return-1},r=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},l=function(t,e){if(""===e)throw new r("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(e))throw new r("INVALID_CHARACTER_ERR","String contains an invalid character");return o.call(t,e)},c=function(t){for(var e=a.call(t.getAttribute("class")||""),i=e?e.split(/\s+/):[],n=0,s=i.length;n<s;n++)this.push(i[n]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},h=c[i]=[],u=function(){return new c(this)};if(r[i]=Error[i],h.item=function(t){return this[t]||null},h.contains=function(t){return t+="",l(this,t)!==-1},h.add=function(){var t,e=arguments,i=0,n=e.length,s=!1;do t=e[i]+"",l(this,t)===-1&&(this.push(t),s=!0);while(++i<n);s&&this._updateClassName()},h.remove=function(){var t,e,i=arguments,n=0,s=i.length,a=!1;do for(t=i[n]+"",e=l(this,t);e!==-1;)this.splice(e,1),a=!0,e=l(this,t);while(++n<s);a&&this._updateClassName()},h.toggle=function(t,e){t+="";var i=this.contains(t),n=i?e!==!0&&"remove":e!==!1&&"add";return n&&this[n](t),e===!0||e===!1?e:!i},h.toString=function(){return this.join(" ")},s.defineProperty){var d={get:u,enumerable:!0,configurable:!0};try{s.defineProperty(n,e,d)}catch(t){t.number===-2146823252&&(d.enumerable=!1,s.defineProperty(n,e,d))}}else s[i].__defineGetter__&&n.__defineGetter__(e,u)}}(window.self))},function(t,e,i){var n=i(3);"string"==typeof n&&(n=[[t.id,n,""]]);i(5)(n,{});n.locals&&(t.exports=n.locals)},function(t,e,i){e=t.exports=i(4)(),e.push([t.id,".__nano_player__{user-select:none}.__nano_player__ .gpu{transform:translateZ(0);will-change:transform}.__nano_player__ .cover{position:absolute;width:100%;height:100%;transition:all .3s ease;color:#fff;cursor:default}.__nano_player__ .blur{filter:blur(10px)}.__nano_player__ .hidden{opacity:0}.__nano_player__ h1.songTitle{font-weight:400;margin-top:1%;margin-bottom:1%;text-align:center;white-space:pre;display:inline-block}.__nano_player__ h2.songArtist{font-weight:400;margin:2% auto 0;text-align:center;line-height:1em;height:1em;text-overflow:ellipsis;max-width:90%;white-space:pre;overflow:hidden}.__nano_player__ div.lyrics{font-weight:400;margin:1%;text-align:center;transition:all .05s ease}.__nano_player__ .progress{position:absolute;bottom:5%;left:25%;width:50%;height:1%;margin:0 auto;border:1px solid #fff}.__nano_player__ .controls{position:absolute;height:20%;max-height:100px;width:100%;top:50%;transform:translateY(-40%);text-align:center}.__nano_player__ .visualizer{position:absolute;bottom:7%;left:25%;width:50%;height:12%;margin:0 auto;border:1px solid transparent}.__nano_player__ canvas.nearestNeighbor{image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:-o-crisp-edges;image-rendering:pixelated;-ms-interpolation-mode:nearest-neighbor}.__nano_player__ .controlButton{min-width:50px;display:inline-block;text-align:center}.__nano_player__ .navButton,.__nano_player__ .pointer{cursor:pointer}.__nano_player__ .outside-left{margin-left:-100%}.__nano_player__ .outside-right{margin-left:100%}.__nano_player__ .playlist{position:absolute;overflow:hidden}.__nano_player__ .headbar{background-color:#000;height:44px;width:100%;text-align:center;position:absolute}.__nano_player__ .list{width:100%;height:64px;transition:all .2s ease}.__nano_player__ .now_playing{background-color:#333}.__nano_player__ .listContainer{position:absolute;top:44px;left:0;right:-17px;bottom:0;overflow-y:scroll;-webkit-overflow-scrolling:touch}.__nano_player__ .list .face{position:absolute;height:64px;width:64px;display:inline-block;background-size:cover}.__nano_player__ .list>.title{position:absolute;padding-left:12px;left:64px;right:0;padding-top:12px;display:inline-block;text-overflow:ellipsis;overflow:hidden;line-height:20px;white-space:nowrap}",""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},s=0;s<this.length;s++){var a=this[s][0];"number"==typeof a&&(n[a]=!0)}for(s=0;s<e.length;s++){var o=e[s];"number"==typeof o[0]&&n[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(t,e,i){function n(t,e){for(var i=0;i<t.length;i++){var n=t[i],s=f[n.id];if(s){s.refs++;for(var a=0;a<s.parts.length;a++)s.parts[a](n.parts[a]);for(;a<n.parts.length;a++)s.parts.push(c(n.parts[a],e))}else{for(var o=[],a=0;a<n.parts.length;a++)o.push(c(n.parts[a],e));f[n.id]={id:n.id,refs:1,parts:o}}}}function s(t){for(var e=[],i={},n=0;n<t.length;n++){var s=t[n],a=s[0],o=s[1],r=s[2],l=s[3],c={css:o,media:r,sourceMap:l};i[a]?i[a].parts.push(c):e.push(i[a]={id:a,parts:[c]})}return e}function a(t,e){var i=y(),n=w[w.length-1];if("top"===t.insertAt)n?n.nextSibling?i.insertBefore(e,n.nextSibling):i.appendChild(e):i.insertBefore(e,i.firstChild),w.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");i.appendChild(e)}}function o(t){t.parentNode.removeChild(t);var e=w.indexOf(t);e>=0&&w.splice(e,1)}function r(t){var e=document.createElement("style");return e.type="text/css",a(t,e),e}function l(t){var e=document.createElement("link");return e.rel="stylesheet",a(t,e),e}function c(t,e){var i,n,s;if(e.singleton){var a=m++;i=v||(v=r(e)),n=h.bind(null,i,a,!1),s=h.bind(null,i,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(i=l(e),n=d.bind(null,i),s=function(){o(i),i.href&&URL.revokeObjectURL(i.href)}):(i=r(e),n=u.bind(null,i),s=function(){o(i)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else s()}}function h(t,e,i,n){var s=i?"":n.css;if(t.styleSheet)t.styleSheet.cssText=b(e,s);else{var a=document.createTextNode(s),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(a,o[e]):t.appendChild(a)}}function u(t,e){var i=e.css,n=e.media;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}function d(t,e){var i=e.css,n=e.sourceMap;n&&(i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var s=new Blob([i],{type:"text/css"}),a=t.href;t.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}var f={},p=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},g=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),y=p(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,m=0,w=[];t.exports=function(t,e){e=e||{},"undefined"==typeof e.singleton&&(e.singleton=g()),"undefined"==typeof e.insertAt&&(e.insertAt="bottom");var i=s(t);return n(i,e),function(t){for(var a=[],o=0;o<i.length;o++){var r=i[o],l=f[r.id];l.refs--,a.push(l)}if(t){var c=s(t);n(c,e)}for(var o=0;o<a.length;o++){var l=a[o];if(0===l.refs){for(var h=0;h<l.parts.length;h++)l.parts[h]();delete f[l.id]}}}};var b=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()},function(t,e){"use strict";var i=function(t){if(t&&t.tagName){var e=document.createElement(t.tagName);if(t.attr)for(var i in t.attr)e.setAttribute(i,t.attr[i]);if(t.style)for(var n in t.style)e.style[n]=t.style[n];if(t.classList&&(e.className=t.classList.join(" ")),t.eventListener)for(var s in t.eventListener)e.addEventListener(s,t.eventListener[s]);return t.innerHTML&&(e.innerHTML=t.innerHTML),t.parent&&t.parent.appendChild(e),e}};t.exports=i},function(t,e){"use strict";t.exports=['<svg x="0px" y="0px" viewBox="0 0 489.164 489.164" style="width: 50%; height: 50%; padding-left: 25%; padding-top: 25%">','<path d="M159.582,75.459v285.32c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5s37.009,72.5,82.5,72.5',"\ts82.5-32.523,82.5-72.5V168.942l245-60.615v184.416c-14.274-10.374-32.573-16.616-52.5-16.616c-45.491,0-82.5,32.523-82.5,72.5",'\ts37.009,72.5,82.5,72.5s82.5-32.523,82.5-72.5V0L159.582,75.459z"/>',"<g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>","</svg>"].join(" ")},function(t,e){"use strict";t.exports=['<svg width="90%" height="90%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">',"<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->","  <g>",'    <path stroke="#000" transform="rotate(90 250,250.00000000000003) " rx="20" d="m35,434.999998l214.999994,-369.999996l214.999994,369.999996l-429.999987,0z" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>',"  </g>","</svg>"].join(" ")},function(t,e){"use strict";t.exports=['<svg width="90%" height="90%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">',"<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->","  <g>",'    <rect rx="20" height="400" width="180" y="50" x="35" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#fff"/>','    <rect rx="20" height="400" width="180" y="50" x="285" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#fff"/>',"  </g>","</svg>"].join(" ")},function(t,e){"use strict";t.exports=['<svg width="90%" height="90%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">',"<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->","  <g>",'    <path stroke="#000" transform="rotate(90 205.0000152587891,249.99998474121094) " d="m11.50002,379.99999l193.49999,-260l193.49999,260l-386.99998,0z" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>','    <rect stroke="#000" height="400" width="113" rx="20" y="50" x="332" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff" />',"  </g>","</svg>"].join(" ")},function(t,e){"use strict";t.exports=['<svg width="90%" height="90%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">',"<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->","  <g>",'    <path stroke="#000" transform="rotate(-90 296.0000305175781,249.99999999999997) " d="m102.50002,380l193.49999,-260l193.49999,260l-386.99998,0z" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>','    <rect stroke="#000" height="400" width="113" rx="20" y="50" x="55" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>',"  </g>","</svg>"].join(" ")},function(t,e){"use strict";t.exports=['<svg width="90%" height="90%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">',"<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->","  <g>",'    <ellipse ry="40" rx="40" id="svg_3" cy="125" cx="100" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#fff"/>','    <ellipse ry="40" rx="40" id="svg_5" cy="250" cx="100" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#fff"/>','    <ellipse ry="40" rx="40" id="svg_6" cy="374" cx="100" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#fff"/>','    <rect stroke="#000" id="svg_7" height="60" width="250" y="94.5" x="178.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>','    <rect stroke="#000" id="svg_12" height="60" width="250" y="345" x="178.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>','    <rect stroke="#000" id="svg_10" height="60" width="250" y="220" x="178.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>','    <rect stroke="#000" id="svg_11" height="60" width="250" y="220" x="178.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#fff"/>',"  </g>","</svg>"].join(" ")},function(t,e){"use strict";t.exports=['<svg width="90%" height="90%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">',"<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->","  <g>",'    <path fill="#fff" stroke-width="0" d="m375,125.63483l-116.66008,124.37264l116.66008,124.37252l-66.67002,71.12003l-183.32999,-195.49254l183.32999,-195.50748" stroke="#000"/>',"  </g>","</svg>"].join(" ")},function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var o=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),r=i(15),l=function(t){function e(t){n(this,e);var i=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));if("string"==typeof t.canvas){if(i.canvas=document.querySelector(t.canvas),!i.canvas instanceof HTMLElement)throw"Unable to get HTMLElement"}else{if(!(t.canvas instanceof HTMLElement))throw"Unknown type of element";i.canvas=t.canvas}if("CANVAS"===!i.canvas.tagName)throw"Element must be a canvas";i.freq=new Uint8Array(i.audioAnalyser.frequencyBinCount);var a=i.canvas.getBoundingClientRect();return i.canvas.width=a.width*window.devicePixelRatio*2,i.canvas.height=a.height*window.devicePixelRatio*2,i.canvas.classList.add("nearestNeighbor"),i.canvasContext=i.canvas.getContext("2d"),i.canvasFillStyle=t.fillStyle||"rgba(255, 255, 255, 0.3)",i.logarithmic=t.logarithmic||!1,i.bandCount=t.bandCount||32,i.linearRegion=t.linearRegion||[0,.75],i.fps=t.fps||50,i.showBuoy=t.showBuoy||!1,i.intervalId=null,i.showingBuoy=new Array(i.bandCount).fill(i.canvas.height),i.initialized=!0,i}return a(e,t),o(e,[{key:"start",value:function(){var t=this;null===this.intervalId&&(this.intervalId=setInterval(function(){t.renderFrame()},1e3/this.fps))}},{key:"pause",value:function(){clearInterval(this.intervalId),this.intervalId=null}},{key:"dispose",value:function(){this.canvas.classList.remove("nearestNeighbor"),this.pause()}},{key:"renderFrame",value:function(){if(this.initialized){this.audioAnalyser.getByteFrequencyData(this.freq);var t=[],e=this.canvasContext;if(e.fillStyle=this.canvasFillStyle,e.clearRect(0,0,this.canvas.width,this.canvas.height),e.beginPath(),e.moveTo(0,this.canvas.height),this.logarithmic)for(var i=0;i!=this.bandCount;++i){for(var n=0,s=0,a=Math.log(this.audioAnalyser.frequencyBinCount)/this.bandCount,o=Math.exp((i-1)*a);o<=Math.exp(i*a);++o)n+=this.freq[Math.ceil(o)],s++;var r=n/s;t[i]=r,this.updateBand(i,r)}else for(var l=(this.linearRegion[1]-this.linearRegion[0])*this.audioAnalyser.frequencyBinCount,c=0;c<this.bandCount;++c){for(var h=0,u=0;u<l/this.bandCount;++u){var d=c*(l/this.bandCount)+u+this.audioAnalyser.frequencyBinCount*this.linearRegion[0];h+=this.freq[Math.ceil(d)]}var f=h/Math.ceil(l/this.bandCount);t[c]=f,this.updateBand(c,f)}if(e.lineTo(this.canvas.width,this.canvas.height),e.lineTo(0,this.canvas.height),e.fill(),this.showBuoy){this.canvasContext.strokeStyle="rgba(255, 255, 255, 1)",this.canvasContext.beginPath();for(var p=0;p<this.bandCount;++p)this.updateBuoy(p,t[p]);this.canvasContext.stroke()}}}},{key:"updateBand",value:function(t,e){var i=this.canvas.width/this.bandCount;e/=256,this.canvasContext.lineTo(Math.ceil(t*i),Math.ceil((1-e)*this.canvas.height)),this.canvasContext.lineTo(Math.ceil((t+1)*i),Math.ceil((1-e)*this.canvas.height))}},{key:"updateBuoy",value:function(t,e){var i=this.canvas.width/this.bandCount;e/=256;var n=Math.ceil((1-e)*this.canvas.height);if(this.showingBuoy[t]>n)this.showingBuoy[t]=n;else{var s=n-this.showingBuoy[t];this.showingBuoy[t]+=s/10}this.canvasContext.moveTo(Math.ceil(t*i),Math.ceil(this.showingBuoy[t])-1),this.canvasContext.lineTo(Math.ceil((t+1)*i),Math.ceil(this.showingBuoy[t])-1)}}]),e}(r);t.exports=l},function(t,e){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),a=function(){function t(e){if(i(this,t),void 0===("undefined"==typeof e?"undefined":n(e))||void 0===n(e.audio))throw"Missing parameter.";if("undefined"==typeof e.audioAnalyser||!e.audioAnalyser instanceof AnalyserNode)throw"audioAnalyser is required.";this.domAudio=e.audio,this.audioAnalyser=e.audioAnalyser}return s(t,[{key:"start",value:function(){}},{key:"pause",value:function(){}},{key:"dispose",value:function(){}}]),t}();t.exports=a},function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var o=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),r=i(15),l=function(t){function e(t){n(this,e);var i=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));if("string"==typeof t.canvas){if(i.canvas=document.querySelector(t.canvas),!i.canvas instanceof HTMLElement)throw"Unable to get HTMLElement"}else{if(!(t.canvas instanceof HTMLElement))throw"Unknown type of element";i.canvas=t.canvas}if("CANVAS"===!i.canvas.tagName)throw"Element must be a canvas";i.dataArray=new Uint8Array(i.audioAnalyser.fftSize);var a=i.canvas.getBoundingClientRect();return i.canvas.width=a.width*window.devicePixelRatio,i.canvas.height=a.height*window.devicePixelRatio,i.canvasContext=i.canvas.getContext("2d"),i.canvasFillStyle=t.fillStyle||"rgba(255, 255, 255, 0.3)",i.fps=t.fps||50,i.intervalId=null,i.initialized=!0,i}return a(e,t),o(e,[{key:"start",value:function(){var t=this;null===this.intervalId&&(this.intervalId=setInterval(function(){t.renderFrame()},1e3/this.fps))}},{key:"pause",value:function(){clearInterval(this.intervalId),this.intervalId=null}},{key:"dispose",value:function(){this.pause()}},{key:"renderFrame",value:function(){var t=this;if(this.initialized){this.audioAnalyser.getByteTimeDomainData(this.dataArray);var e=this.canvasContext;this.canvasContext.strokeStyle="rgb(255, 255, 255)",e.clearRect(0,0,this.canvas.width,this.canvas.height),e.beginPath(),this.dataArray.forEach(function(i,n){0===n?e.moveTo(n*t.canvas.width/t.dataArray.length,t.canvas.height/2-(i/192-1)*(t.canvas.height/2)):e.lineTo(n*t.canvas.width/t.dataArray.length,t.canvas.height/2-(i/192-1)*(t.canvas.height/2))}),e.stroke()}}}]),e}(r);t.exports=l}]);