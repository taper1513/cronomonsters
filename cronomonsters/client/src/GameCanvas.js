import React from 'react';
import ReactDOM from 'react-dom';
import SongData from './songData.json';
import FixTheDoor from './fixTheDoor.json';

class GameCanvas extends React.Component {

    constructor(){
      super();

      const songDuration = 3 * 60 * 1000;
      const bpm = 150  ;
      const bps = bpm / 60;
      
      const bpms = bps / 1000;
      const beatDivider = 4;
      this.octer = (1/beatDivider)/ bpms;

      this.record = true;
      this.recordArray = [];
      this.speed = 600 /1000;// 300 px per second
      this.beatStart = 0;
      this.noteFrames = [];
      this.minorRange = 2;
      this.majorRange = 10;
      this.earlyRange = 90;
      this.lateRange = 20;
    
      this.noteCount = 0;
      this.noteCountFrame = 0;
      this.animateScore = [];

      this.arrayOfSustained = [];
      this.sustainedScoring = [];
      this.lastSustainedInserted = -10;

      console.log("bpm:  " + bpm);
      console.log("bps:  " + bps);
      console.log("step: " + this.octer )
      console.log("bpms: " + bpms);


      const songData = SongData;
      console.log(' starting array creation' );
      let i;
      for( i = 0; i< songData.length; i++)
      {
        this.noteFrames[songData[i][0]] = songData[i][1];
      }  
      
      
      this.fixTheDoorData = FixTheDoor;
      this.lastSavedFrame = [];
     
      
    //generateArraybygivenDivider
    for( i = 0; i< songDuration/this.octer; i++){
      this.recordArray[i] = [i*this.octer,[[1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]];

    }
     
      
    
     console.log(JSON.stringify(this.recordArray));
      let self = this;
       this.printArray = setInterval(function() {
        console.log(JSON.stringify(self.fixTheDoorData));
       }, 10000);
     
      
       
      console.log("last index:  " + i);
      this.width=720;
      this.height=720;
      this.canvasStyle = {
        backgroundColor: "black",
      };
      this.score = 0;
      this.userWantsToStart = false;
      this.loop = this.loop.bind(this);
      this.currentSongTime = 0;
      this.firstTimeLoop = true;
      
      
      this.handleClick = function(e){
        self.userWantsToStart = true;   
        console.log('user started.');
      }

    
  }
 

  
  componentDidMount() {
    window.addEventListener('keydown',this.keyDown.bind(this));
    window.addEventListener('keyup',this.keyUp.bind(this));
    this.released = [];
    this.released[1] = true;
    this.released[2] = true;
    this.released[3] = true;
    this.released[4] = true;
    this.released[5] = true;
    this.released[6] = true;

    let c = document.getElementById("canvas");
    this.ctx = c.getContext("2d");
    this.bgImg = new Image();
    this.bgImg.src = "assets/bg.jpg";
    
    //loading notesImg Array
    this.notesImg = [];
    let i;
    for (i = 1; i < 7; i++){
      this.notesImg[i] = new Image();
      this.notesImg[i].src = "assets/notes/note" + i + ".png";
    }

    this.song = document.getElementsByClassName("song")[0]; 
    this.song.muted = true;

    this.startLoop();



  
   
    
  
  }

  startLoop() {

    if( !this._frameId ) {
      this._frameId = window.requestAnimationFrame( this.loop );
     
    }
  }

    
  loop() {

    let i;
    for (i=0; i < this.sustainedScoring.length; i++ ){
     this.score = this.score + 0.2;
    }

    
    if ( !this.userWantsToStart) {
      this.frameId = window.requestAnimationFrame(this.loop);
      return
    }

    if ( this.firstTimeLoop === true) {
      
      this.startTime = Date.now();
      let self=this;

     this.timecounter = setInterval(function() {
            self.currentSongTime = Date.now() - self.startTime;
     }, 1000/60);
     
  
      setTimeout(function(){ 
       // self.song.play();
      },this.octer*5);

      this.song.muted = false;
      this.firstTimeLoop =false;
    }
    
    let ctx = this.ctx;
    let step = this.octer;
    let noteFrames = this.noteFrames;
    let now =  this.currentSongTime  ;
    let s = this.speed;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);

    ctx.beginPath();
    ctx.strokeStyle = "white";
    
    //getting what should now closer frame in the song

    let songFrame = parseInt(now/step) * step; //CHECCCK IT
  
    for( i = songFrame; i < songFrame + this.majorRange * step; i = i + step ){
  
      let noteFrame = noteFrames[i];
      let j;
      let y =  550 + now * s - i *s;
      let squareSize = 200; //y * 1/10;
      ctx.strokeStyle = "red ";
      if( y > 550 )
       continue;
      for (j=1; j < 7; j++ ){
        if(noteFrame[j][0] == 1 ){
          let distCoef =100;
          let x = j*distCoef - 20;
          if ( j > 3 )
            x = j*distCoef + 20;  
          ctx.drawImage(this.notesImg[j] ,x - squareSize/2 + 40 , y , squareSize/2 +10, squareSize/2);
          ctx.stroke();
        }
        if(noteFrame[j][1] > 0 ) {       
          if( this.lastSustainedInserted != i ) {
            this.arrayOfSustained.push([i,j,noteFrame[j][1]]);
            this.lastSustainedInserted = i;
          }
        }
      }
      ctx.stroke();
    }


    let x;
    let opacity
    for (i=0; i < this.animateScore.length; i++ ){
      x = this.animateScore[i][0];
      opacity = this.animateScore[i][1];
      ctx.strokeStyle = 'rgba(0,255,255,' + opacity + ')';
      ctx.rect(x*100 - 20 + opacity*15, 565 - 20 + opacity*15, 50 + (10 - opacity*30), 50 + (10 - opacity*30));
      ctx.stroke();
      this.animateScore[i][1] = this.animateScore[i][1] - 0.05;
      if( this.animateScore[i][1] <= 0 ) {
        this.animateScore.splice(i);
      }
    }
    
    ctx.strokeStyle = "yellow ";
    for (i=0; i < this.arrayOfSustained.length; i++ ){
      let finalY = 550 + now * s - ( this.arrayOfSustained[i][0] + this.arrayOfSustained[i][2]*this.octer) *s;
  //    if ( !this.sustainedScoring.includes( this.arrayOfSustained[i])) { 
        let y =  550 + now * s - this.arrayOfSustained[i][0] *s;
        let j = this.arrayOfSustained[i][1];
        ctx.beginPath();
        ctx.moveTo(j*100, y);
        ctx.lineTo(j*100, finalY);
        ctx.strokeStyle = 'rgba(0,0,255,' + opacity + ')';
        ctx.stroke();
  //    }
      if ( finalY > 720 ) {
        this.arrayOfSustained.splice(i)
      }

    }

  
    //this.sustainedScoring = [[800,5,28]]
    
    for (i=0; i < this.sustainedScoring.length; i++ ){
      
      let y =  550 + now * s - this.sustainedScoring[i][0] *s;
      let j = this.sustainedScoring[i][1];
      let finalY = 550 + now * s - ( this.sustainedScoring[i][0] + this.sustainedScoring[i][2]*this.octer) *s;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      ctx.moveTo(j*100, y);
      let an;
      for( an = 0; an < 100; an = an + 2) {
        if ( an%2 ===0) 
        {
          ctx.lineTo(j*100 +10, 550 - an);
        }
        else {
          ctx.lineTo(j*100 -10, 550 - an);
        }

      }
     // ctx.lineTo(j*100, finalY);
     ctx.closePath();
      ctx.stroke(); 
      if ( finalY > 720 ) {
        this.sustainedScoring.splice(i)
      }

    }

    ctx.strokeStyle = "red ";
    ctx.font = "50px courier new";
    ctx.fillStyle = "white";
    ctx.fillText(this.score, 500, 50);
    ctx.rect(0, 550, this.width, 50);
    
    ctx.stroke();




    this.frameId = window.requestAnimationFrame(this.loop);
  }


  keyDown(e) {


   
    console.log("keyDown " + e.key);
    console.log("note count " + this.noteCount);

    let noteFrameKeyIndex;
    if ( e.key === "q" && this.released[1] == true)
      noteFrameKeyIndex = 1;
    else if ( e.key === "w" && this.released[2] == true)
      noteFrameKeyIndex = 2;
    else if ( e.key === "e" && this.released[3] == true)
      noteFrameKeyIndex = 3;
    else if ( e.key === "i" && this.released[4] == true)
      noteFrameKeyIndex = 4;
    else if ( e.key === "o" && this.released[5] == true)
      noteFrameKeyIndex = 5;
    else if ( e.key === "p" && this.released[6] == true)
      noteFrameKeyIndex = 6;
    else{
      return;
    }

    if(this.record) {
      let frame =  Math.round((this.currentSongTime/this.octer) * this.octer + ( this.octer - (this.currentSongTime%this.octer)));
      this.fixTheDoorData[frame/this.octer][0] =  frame;
      this.fixTheDoorData[frame/this.octer][1][noteFrameKeyIndex] = [1,0];  
      this.lastSavedFrame[noteFrameKeyIndex] = frame
    }

    this.released[noteFrameKeyIndex] = false;

    let suspectedTargetFrame1 = Math.round((this.currentSongTime/this.octer) * this.octer - (this.currentSongTime%this.octer ));
    let suspectedTargetFrame2 = Math.round((this.currentSongTime/this.octer) * this.octer + ( this.octer - (this.currentSongTime%this.octer)));
   
    console.log(" suspected frame1: " + suspectedTargetFrame1)
    if ( suspectedTargetFrame1 > this.currentSongTime - this.lateRange && suspectedTargetFrame1 < this.currentSongTime + this.earlyRange ) {
       
      //check if note exists, and check if duration of the note is 0, 
       if (this.noteFrames[suspectedTargetFrame1][noteFrameKeyIndex][0] === 1 && this.noteFrames[suspectedTargetFrame1][noteFrameKeyIndex][1] === 0) 
        this.computePoints(suspectedTargetFrame1, noteFrameKeyIndex);    
      //if duration exists, call function to score sustained note
      else if (  this.noteFrames[suspectedTargetFrame1][noteFrameKeyIndex][1] > 0){
        this.computeSustainedPoints(suspectedTargetFrame1, noteFrameKeyIndex, this.noteFrames[suspectedTargetFrame1][noteFrameKeyIndex][1] );
      }
      return;
    }

    console.log(" suspected frame2: " + suspectedTargetFrame2)
    if ( suspectedTargetFrame2 > this.currentSongTime - this.lateRange && suspectedTargetFrame2 < this.currentSongTime + this.earlyRange ) {
      if (this.noteFrames[suspectedTargetFrame2][noteFrameKeyIndex][0] === 1 && this.noteFrames[suspectedTargetFrame2][noteFrameKeyIndex][1] === 0) 
        this.computePoints(suspectedTargetFrame2, noteFrameKeyIndex);
      else if (  this.noteFrames[suspectedTargetFrame2][noteFrameKeyIndex][1] > 0){
          this.computeSustainedPoints(suspectedTargetFrame2, noteFrameKeyIndex, this.noteFrames[suspectedTargetFrame2][noteFrameKeyIndex][1] );
      } 
      return; 
    }

    //wrongKey();

    
   
  }
  
  
  keyUp(e) {

    if( this.noteCount > 0 ) { this.noteCount--; }
    let key;
    if ( e.key == "q")
     key = 1;
    else if ( e.key == "w")
     key = 2;
    else if ( e.key == "e")
     key = 3;
    else if ( e.key == "i")
     key = 4;
    else if ( e.key == "o")
     key= 5;
    else if ( e.key == "p")
      key = 6;
    else{
      return;
    }

    if(this.record) {
      let frame =  Math.round((this.currentSongTime/this.octer) * this.octer + ( this.octer - (this.currentSongTime%this.octer)));
     if ( this.lastSavedFrame[key] !== frame ){
        this.fixTheDoorData[this.lastSavedFrame[key]/this.octer][1][key][1] = frame/this.octer - this.lastSavedFrame[key]/this.octer;  
      }
    }

    this.released[key] = true;
    let i;
    for (i=0; i < this.sustainedScoring.length; i++ ){
      if (this.sustainedScoring[i][1] === key) {
        this.sustainedScoring.splice(i);
      }
    }
    
    
  }
  
  registerScore(value, frameIndex) {
    this.score = this.score+ value;
    let j;
    for (j=1; j < 7; j++ ){
      if(frameIndex[j][0] === 1 )
        this.animateScore.push([j,1]);
    }

  }

  computePoints(frameIndex, note) {
   
    //if more than 1 notes exist
    if ( this.noteFrames[frameIndex][0] > 1 ) {
      if(this.noteCountFrame != frameIndex) { this.noteCount = 0; }
      this.noteCountFrame = frameIndex;
      this.noteCount++;
      
      if (this.noteFrames[frameIndex][0] === this.noteCount ){
        this.registerScore(this.noteCount, this.noteFrames[frameIndex]);
        this.noteCount = 0;
        console.log(this.score);
      }
    } 
    else {
      if ( this.noteCount != 0 )  { this.noteCount = 0;}
      this.registerScore(1, this.noteFrames[frameIndex] );
      console.log(this.score);
    }    
  }

  computeSustainedPoints(frameIndex, noteIndex, duration) {
    this.animateScore.push([noteIndex,1]);
    this.sustainedScoring.push([frameIndex, noteIndex, duration]);
  }
  
  render() {
    return <div><canvas id="canvas" onClick={this.handleClick} style={this.canvasStyle} width="720" height="720"></canvas><audio class="song"> <source src="music/fix_the_door.mp3"></source></audio></div>;
  }
}

export default GameCanvas;