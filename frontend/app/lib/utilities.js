/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Use this to check high score whenever you need. It will update the highscore and save it to local storage
function checkHighscore() {
  if (score > highScore) {
    highscoreGained = true
    highscore = score

    localStorage.setItem('highscore', highscore)
  }
}

/**
 * Used to add score
 * @param {Number} amount - amount of score to be added
 * @param {p5 Image Instance} particlesImage
 * @param {Object} particle - { x: null, y: null }
 * @param {Number} particleCount
 * @param {Object} settings - { floatingText: false }
 */
function addScore(
  amount,
  particlesImage,
  particle = { x: null, y: null },
  particleCount = floor(random(2, 15)),
  settings = { floatingText: true }
) {
  score += amount

  if (settings.floatingText) {
    floatingTexts.push(
      new FloatingText(
        particle.x,
        particle.y - 0.75 * objSize * 0.5,
        amount < 0 ? `${amount} 😭` : `+${amount}`,
        amount < 0
          ? Koji.config.colors.negativeFloatingTextColor
          : Koji.config.colors.floatingTextColor,
        objSize * 2,
        2
      )
    )
  }

  // Spawn particles
  if (particle.y > 0) {
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(
        new Particle(particle.x, particle.y, particlesImage) // you may use `imgLife` for the image parameter if the balloon images you have aren't good particles
      )
    }
  }
}

/**
 *
 * @param {p5 Image Instance} particlesImage
 * @param {object} particle - { x: null, y: null }
 * @param {*} particleCount
 * @param {Number} particleCount
 */
function particlesEffect(
  particlesImage,
  particle = { x: null, y: null },
  particleCount = floor(random(2, 15))
) {
  // Spawn particles
  if (particle.y > 0) {
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(
        new Particle(particle.x, particle.y, particlesImage) // you may use `imgLife` for the image parameter if the balloon images you have aren't good particles
      )
    }
  }
}

// Used to go to submit score page
function submitScore(currentScore) {
  window.setScore(currentScore)
  window.setAppView('setScore')
}

// Sound stuffs
function playMusic(music, volume = 0.4, loop = false) {
  if (music) {
    music.setVolume(volume)
    music.setLoop(loop)
    music.play()
  }
}

function disableSound() {
  getAudioContext().suspend()
  soundEnabled = false
}

function enableSound() {
  soundEnabled = true
  getAudioContext().resume()
}

// Call this function on sound button click
function toggleSound() {
  if (canMute) {
    canMute = false

    if (soundEnabled) {
      disableSound()
    } else {
      enableSound()
    }

    // A timeout is required to prevent double registering of touch input on mobile
    setTimeout(() => {
      canMute = true
    }, 100)
  }
}

/*
  Basic smoothing function
  v = ((v * (N - 1)) + w) / N; 

  v - current value
  w - goal value
  The higher the factor, the slower v approaches w.
*/
function Smooth(current, goal, factor) {
  return (current * (factor - 1) + goal) / factor
}

// Isolate the font name from the font link provided in game settings
function getFontFamily(ff) {
  const start = ff.indexOf('family=')
  if (start === -1) return 'sans-serif'
  let end = ff.indexOf('&', start)
  if (end === -1) end = undefined
  return ff.slice(start + 7, end)
}

// Returns true if the user is on mobile
function detectMobile() {
  // KEEP THE SEMICOLONS TO VOID ASI
  let check = false

  ;(function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)

  return check
}

// Returns true if the user is on small sized browser
function detectMobileSize() {
  return width < 550
}

/* eslint-disable */
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.SuperGif=t()}(this,function(){var e=function(e){return e.reduce(function(e,t){return 2*e+t},0)},t=function(e){for(var t=[],n=7;n>=0;n--)t.push(!!(e&1<<n));return t},n=function(e){this.data=e,this.len=this.data.length,this.pos=0,this.readByte=function(){if(this.pos>=this.data.length)throw new Error("Attempted to read past end of stream.");return e instanceof Uint8Array?e[this.pos++]:255&e.charCodeAt(this.pos++)},this.readBytes=function(e){for(var t=[],n=0;e>n;n++)t.push(this.readByte());return t},this.read=function(e){for(var t="",n=0;e>n;n++)t+=String.fromCharCode(this.readByte());return t},this.readUnsigned=function(){var e=this.readBytes(2);return(e[1]<<8)+e[0]}},r=function(e,t){for(var n,r,a=0,i=function(e){for(var n=0,r=0;e>r;r++)t.charCodeAt(a>>3)&1<<(7&a)&&(n|=1<<r),a++;return n},o=[],u=1<<e,l=u+1,f=e+1,c=[],s=function(){c=[],f=e+1;for(var t=0;u>t;t++)c[t]=[t];c[u]=[],c[l]=null};;)if(r=n,n=i(f),n!==u){if(n===l)break;if(n<c.length)r!==u&&c.push(c[r].concat(c[n][0]));else{if(n!==c.length)throw new Error("Invalid LZW code.");c.push(c[r].concat(c[r][0]))}o.push.apply(o,c[n]),c.length===1<<f&&12>f&&f++}else s();return o},a=function(n,a){a||(a={});var i=function(e){for(var t=[],r=0;e>r;r++)t.push(n.readBytes(3));return t},o=function(){var e,t;t="";do e=n.readByte(),t+=n.read(e);while(0!==e);return t},u=function(){var r={};if(r.sig=n.read(3),r.ver=n.read(3),"GIF"!==r.sig)throw new Error("Not a GIF file.");r.width=n.readUnsigned(),r.height=n.readUnsigned();var o=t(n.readByte());r.gctFlag=o.shift(),r.colorRes=e(o.splice(0,3)),r.sorted=o.shift(),r.gctSize=e(o.splice(0,3)),r.bgColor=n.readByte(),r.pixelAspectRatio=n.readByte(),r.gctFlag&&(r.gct=i(1<<r.gctSize+1)),a.hdr&&a.hdr(r)},l=function(r){var i=function(r){var i=(n.readByte(),t(n.readByte()));r.reserved=i.splice(0,3),r.disposalMethod=e(i.splice(0,3)),r.userInput=i.shift(),r.transparencyGiven=i.shift(),r.delayTime=n.readUnsigned(),r.transparencyIndex=n.readByte(),r.terminator=n.readByte(),a.gce&&a.gce(r)},u=function(e){e.comment=o(),a.com&&a.com(e)},l=function(e){n.readByte();e.ptHeader=n.readBytes(12),e.ptData=o(),a.pte&&a.pte(e)},f=function(e){var t=function(e){n.readByte();e.unknown=n.readByte(),e.iterations=n.readUnsigned(),e.terminator=n.readByte(),a.app&&a.app.NETSCAPE&&a.app.NETSCAPE(e)},r=function(e){e.appData=o(),a.app&&a.app[e.identifier]&&a.app[e.identifier](e)};n.readByte();switch(e.identifier=n.read(8),e.authCode=n.read(3),e.identifier){case"NETSCAPE":t(e);break;default:r(e)}},c=function(e){e.data=o(),a.unknown&&a.unknown(e)};switch(r.label=n.readByte(),r.label){case 249:r.extType="gce",i(r);break;case 254:r.extType="com",u(r);break;case 1:r.extType="pte",l(r);break;case 255:r.extType="app",f(r);break;default:r.extType="unknown",c(r)}},f=function(u){var l=function(e,t){for(var n=new Array(e.length),r=e.length/t,a=function(r,a){var i=e.slice(a*t,(a+1)*t);n.splice.apply(n,[r*t,t].concat(i))},i=[0,4,2,1],o=[8,8,4,2],u=0,l=0;4>l;l++)for(var f=i[l];r>f;f+=o[l])a(f,u),u++;return n};u.leftPos=n.readUnsigned(),u.topPos=n.readUnsigned(),u.width=n.readUnsigned(),u.height=n.readUnsigned();var f=t(n.readByte());u.lctFlag=f.shift(),u.interlaced=f.shift(),u.sorted=f.shift(),u.reserved=f.splice(0,2),u.lctSize=e(f.splice(0,3)),u.lctFlag&&(u.lct=i(1<<u.lctSize+1)),u.lzwMinCodeSize=n.readByte();var c=o();u.pixels=r(u.lzwMinCodeSize,c),u.interlaced&&(u.pixels=l(u.pixels,u.width)),a.img&&a.img(u)},c=function(){var e={};switch(e.sentinel=n.readByte(),String.fromCharCode(e.sentinel)){case"!":e.type="ext",l(e);break;case",":e.type="img",f(e);break;case";":e.type="eof",a.eof&&a.eof(e);break;default:throw new Error("Unknown block: 0x"+e.sentinel.toString(16))}"eof"!==e.type&&setTimeout(c,0)},s=function(){u(),setTimeout(c,0)};s()},i=function(e){var t={vp_l:0,vp_t:0,vp_w:null,vp_h:null,c_w:null,c_h:null,auto_play:!0};for(var r in e)t[r]=e[r];t.vp_w&&t.vp_h&&(t.is_vp=!0);var i,o,u=null,l=!1,f=null,c=null,s=null,d=null,p=null,h=null,g=null,y=!0,v=!0,m=!1,_=[],w=[],x=document.createElement("img");x.src=t.gif;var B,b,T=t.hasOwnProperty("on_end")?t.on_end:null,P=t.hasOwnProperty("loop_delay")?t.loop_delay:0,k=t.hasOwnProperty("loop_mode")?t.loop_mode:"auto",C=function(){f=null,c=null,p=s,s=null,h=null},S=function(){try{a(i,N)}catch(e){U("parse")}},E=function(e,t){b.resize(e,t),b.width=e,b.height=t},I=function(e,t){return w[e]?("undefined"!=typeof t.x&&(w[e].x=t.x),void("undefined"!=typeof t.y&&(w[e].y=t.y))):void(w[e]=t)},U=function(e){u=e,_=[]},A=function(e){o=e,E(o.width,o.height)},G=function(e){z(),C(),f=e.transparencyGiven?e.transparencyIndex:null,c=e.delayTime,s=e.disposalMethod},z=function(){h&&(_.push({data:h.getImageData(0,0,o.width,o.height),delay:c}),w.push({x:0,y:0}))},F=function(e){h||(h=B.getContext("2d"));var t=_.length,n=e.lctFlag?e.lct:o.gct;t>0&&(3===p?null!==d?h.putImageData(_[d].data,0,0):h.clearRect(g.leftPos,g.topPos,g.width,g.height):d=t-1,2===p&&h.clearRect(g.leftPos,g.topPos,g.width,g.height));var r=h.getImageData(e.leftPos,e.topPos,e.width,e.height),a=r.data;e.pixels.forEach(function(e,t){e!==f&&(a[4*t+0]=n[e][0],a[4*t+1]=n[e][1],a[4*t+2]=n[e][2],a[4*t+3]=255)}),r.data.set(a),h.putImageData(r,e.leftPos,e.topPos),m||(m=!0),g=e},D=function(){var e=-1,n=0,r=function(){var t=v?1:-1;return(e+t+_.length)%_.length},a=function(t){e+=t,l()},i=function(){null!==T&&T(x),n++},o=function(){var t=!1,o=function(){if(t=y){a(1);var u=10*_[e].delay;u||(u=100);var l=r();0===l&&(u+=P,setTimeout(i,u-1)),(k!==!1||0!==l||0>n)&&setTimeout(o,u)}};return function(){t||setTimeout(o,0)}}(),l=function(){var t;e=parseInt(e,10),e>_.length-1&&(e=0),0>e&&(e=0),t=w[e],B.getContext("2d").putImageData(_[e].data,t.x,t.y)},f=function(){y=!0,o()},c=function(){y=!1};return{init:function(){u||(t.auto_play?o():(e=0,l()))},step:o,play:f,pause:c,playing:y,move_relative:a,current_frame:function(){return e},length:function(){return _.length},move_to:function(t){e=t,l()},get_frames:function(){return _},buffer:function(){return b},get_playing:function(){return y}}}(),M=function(){},R=function(e,t){return function(t){e(t)}},N={hdr:R(A),gce:R(G),com:R(M),app:{NETSCAPE:R(M)},img:R(F,!0),eof:function(e){z(),D.init(),l=!1,console.log("ok"),j&&j(x)}},O=function(){b=t.p5inst.createImage(0,0),B=b.canvas,L=!0},H=function(){var e;return e=t.max_width&&o&&o.width>t.max_width?t.max_width/o.width:1},L=!1,j=!1,q=function(e){return l?!1:(j=e?e:!1,l=!0,_=[],C(),d=null,p=null,h=null,g=null,!0)};return{play:D.play,pause:D.pause,move_relative:D.move_relative,move_to:D.move_to,get_playing:D.get_playing,get_canvas:function(){return canvas},get_canvas_scale:function(){return H()},get_loading:function(){return l},get_auto_play:function(){return t.auto_play},get_length:function(){return D.length()},get_current_frame:function(){return D.current_frame()},get_frames:function(){return D.get_frames()},buffer:function(){return D.buffer()},load_url:function(e,t){if(q(t)){var r=new XMLHttpRequest;r.overrideMimeType("text/plain; charset=x-user-defined"),r.onloadstart=function(){L||O()},r.onload=function(e){i=new n(r.responseText),setTimeout(S,0)},r.onerror=function(){U("xhr")},r.open("GET",e,!0),r.send()}},load:function(e){this.load_url(x.src,e)},load_raw:function(e,t){q(t)&&(L||O(),i=new n(e),setTimeout(S,0))},set_frame_offset:I}};return i}),function(){p5.prototype.loadGif=function(e,t){var n=new SuperGif({gif:e,p5inst:this});n.load(t);var r=n.buffer();return r.play=n.play,r.pause=n.pause,r.playing=n.get_playing,r.frames=n.get_frames,r.totalFrames=n.get_length,r.loaded=function(){return!n.get_loading()},r.frame=function(e){return"number"!=typeof e?n.get_current_frame():void n.move_to(e)},r},p5.prototype.loadRawGif=function(e,t){var n=new SuperGif({gif:"",p5inst:this});n.load_raw(e,t);var r=n.buffer();return r.play=n.play,r.pause=n.pause,r.playing=n.get_playing,r.frames=n.get_frames,r.totalFrames=n.get_length,r.loaded=function(){return!n.get_loading()},r.frame=function(e){return"number"!=typeof e?n.get_current_frame():void n.move_to(e)},r}}();
