
const songDuration = 1 * 60 * 1000;
const bpm = 60;
const bps = bpm / 60;
const bpms = bps / 1000;
const octer = ((1000*bpms)/2)/bpms;
const beatStart = 0;
let noteFrames = [];


console.log(' starting array creation' );
let i;
let noteFrame = {};
for ( i = beatStart; i < songDuration; i = i + octer ) {
  
 
  noteFrame[0] = [2]; // how may notes in it
  noteFrame[1] = [1,0];
  noteFrame[2] = [1,0];
  noteFrame[3] = [0,0];
  noteFrame[4] = [0,0];
  noteFrame[5] = [0,0];
  noteFrame[6] = [0,0];
  noteFrames[i] = noteFrame;

}


console.log(noteFrames);


const MoveBox = (entities, { input }) => {
  //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
  //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
  //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
  //-- That said, it's probably worth considering performance implications in either case.

  const { payload } = input.find(x => x.name === "onMouseDown") || {};

  if (payload) {
    const box1 = entities["box1"];

    box1.x = payload.pageX;
    box1.y = payload.pageY;
  }

  return entities;
};

const PlayGame = (entities, { input }) => {
  //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
  //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
  //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
  //-- That said, it's probably worth considering performance implications in either case.
    
  let notes = entities["boxSet"];
  let i;
  for ( i = 0 ; i < 10000; i = i + octer)
  console.log(notes);
    notes.push(noteFrames[i]);  
    

    return entities;
  };
   
  export { PlayGame };