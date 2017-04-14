console.log(ambisonics);

// Setup audio context and variables
var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext; // Safari and old versions of Chrome
var context = new AudioContext; // Create and Initialize the Audio Context

var irUrl = "IRs/aalto2016_N1.wav";
var soundBuffer, sound, soundUrl;
var maxOrder = 1;

// define HOA rotator
var rotator = new ambisonics.sceneRotator(context, maxOrder);
console.log(rotator);
// binaural HOA decoder
var decoder = new ambisonics.binDecoder(context, maxOrder);
console.log(decoder);
// intensity analyser
var analyser = new ambisonics.intensityAnalyser(context, maxOrder);
console.log(analyser);
// FuMa to ACN converter
var converterF2A = new ambisonics.converters.wxyz2acn(context);
console.log(converterF2A);

// connect diagram
converterF2A.out.connect(rotator.in);
rotator.out.connect(decoder.in);
rotator.out.connect(analyser.in);
decoder.out.connect(context.destination);

// function to load samples
function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open("GET", url, true); // Path to Audio File
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    fetchSound.onload = function() {
        context.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
    }
    fetchSound.send();
}

// function to assign sample to the filter buffers for convolution
var assignSample2Filters = function(decodedBuffer) {
    decoder.updateFilters(decodedBuffer);
}

// load and assign samples
loadSample(irUrl, assignSample2Filters);

// function to change sample from select box
function changeSample() {
    soundUrl = document.getElementById("sample_no").value;
    var audioElmt = document.getElementById("audioElmt")
    audioElmt.src = soundUrl;
    audioElmt.play();
}

// Define mouse drag on spatial map .png local impact
function mouseActionLocal(angleXY) {
    rotator.yaw = -angleXY[0];
    rotator.pitch = angleXY[1];
    //console.log(rotator.yaw+','+rotator.pitch)
    rotator.updateRotMtx();
}

function drawLocal() {
    // Update audio analyser buffers
    analyser.updateBuffers();
    var params = analyser.computeIntensity();
    updateCircles(params, canvas);
}

//$.holdReady( true ); // to force awaiting on common.html loading

//$(document).ready(function() {
    
    // var audioElmt=document.getElementById('audioElmt');
    // if(Hls.isSupported()) {
    //    var hlsaudio=new Hls(); 
    //    hlsaudio.loadSource('m3u8/index.m3u8');
    //    hlsaudio.attachMedia (audioElmt);
       
    // }
    //console.log(audioElmt.src);
    //soundUrl=audioElmt.src;
    //var audioElmt = document.getElementById("audioElmt");
    //audioElmt.loop = true;

    // define source node streaming audio from HTML audio elmt
    // var audionew=document.createElement('audio');
    // audionew.src="sound/music.mp3";
    if(browser.indexOf('mobile')>0){

        var mediaElmtSource = context.createMediaElementSource(panorama);
    }else{
        var mediaElmtSource = context.createMediaElementSource(video);
    }
    
    //console.log(mediaElmtSource);    

    mediaElmtSource.connect(converterF2A.in);

    // var oBtn=document.createElement('button');
    //     oBtn.innerHTML='按钮';
    //     oBtn.style.cssText="position:absolute;left:10px;top:120px;";
    // document.body.appendChild(oBtn);

    // oBtn.onclick=function(){
    //     if(audionew.paused){
    //         audionew.play();
    //     }else{
    //         audionew.pause();
    //     }
    // }
//})

function onDecodeAudioDataError(error) {
    var url = 'hjre';
  alert("Browser cannot decode audio data..." + "\n\nError: " + error + "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)");
}


//不用audio标签的做法

  