let isPlaying = false;
let isStopped = true;
let percentage = 0;
const btnPlayTimer = document.querySelector('#btnPlayTimer');
const btnStopTimer = document.querySelector('#btnStopTimer');
btnPlayTimer.addEventListener('click', ()=>{
  isPlaying = !isPlaying;
  isStopped = false;
  
  window.requestAnimationFrame(animate);
}, false);
btnStopTimer.addEventListener('click', ()=>{
  isStopped = !isStopped;
  isStopped = false;
  percentage = 0;
}, false);

const partialSectionData = {
  partial_id: 'partial01',
  start: 1000,
  duration: 5000,
};

const partialFileData = {
  compiledContent: `console.log("one");
    console.log("two");
    console.log("three");
    console.log("four");
    console.log("five");
    console.log("six");`,
};
const txtMaster = `class Master{
  private text: string;
  constructor(text: string){
    this.text = text;
  }
  toJson(){
    return {
      text: this.text,
    };
  }
  toString(){
    {{partial01}}
  }
}`;
// document.write('<pre>'+JSON.stringify(txtMaster.split('\n'), null, 4)+'</pre>');
const monacoPlaybookModel = {
  compiledContent: txtMaster,
};


const start: number = parseInt('' + partialSectionData.start);

// -- Using the master template, find the start position of this partial
const partialIdStartPositionInMasterTemplate: number = monacoPlaybookModel
  .compiledContent
  .indexOf('{{' + partialSectionData.partial_id + '}}');
const partialIdEndPositionInMasterTemplate: number = partialIdStartPositionInMasterTemplate + ('{{' + partialSectionData.partial_id + '}}').length;
const contentBeforePartialIdInMasterTemplate: string = monacoPlaybookModel
  .compiledContent
  .substr(0, partialIdStartPositionInMasterTemplate);
const contentAfterPartialIdInMasterTemplate: string = monacoPlaybookModel
  .compiledContent
  .substr(partialIdEndPositionInMasterTemplate);
const contentBeforeSplitByNewLine: string[] = contentBeforePartialIdInMasterTemplate.split('\n');

let originalCursorRow: number = contentBeforeSplitByNewLine.length;
let originalCursorCol: number = contentBeforeSplitByNewLine[contentBeforeSplitByNewLine.length - 1].length + 1;

// -- Calculate the number of chars to print per interval 
const tick = 100;
const totalNumberOfIntervals = partialSectionData.duration / tick;
const charsToPrintPerInterval = Math.ceil(partialFileData.compiledContent.length / totalNumberOfIntervals);
const charPrintingInterval = Math.floor(90 / (charsToPrintPerInterval));




/**
 * @model monacoPartialModel
 */
const monacoPartialModel = {
  partialId: partialSectionData.partial_id,
  start: start,
  end: start + partialSectionData.duration,
  fileContent: partialFileData.compiledContent,
  totalNumberOfCharsPrinting: 0,
  totalNumberOfCharsPrinted: 0,
  autoprintState: 'NOT_STARTED',
  charsToPrintPerInterval: charsToPrintPerInterval,
  charPrintingInterval: charPrintingInterval,
  originalCursorPosition: {
    row: originalCursorRow,
    col: originalCursorCol,
  },
  beginningCursorPosition: {
    row: originalCursorRow,
    col: originalCursorCol,
  },
  currentCursorPosition: {
    row: originalCursorRow,
    col: originalCursorCol,
  },
  preventNormalPlaybackChars: false,
};

/**
 * @author Mitchy
 */
const txtPartial = monacoPartialModel.fileContent;
const txtBlocks = txtPartial.match(new RegExp(`.{1,${charsToPrintPerInterval}}`, 'g'));
interface Block{
  time: number,
  chars: string,
}
let blocks:Block[] = [];
let i = 0;
for(
  let currentTime = monacoPartialModel.start; 
  currentTime <= monacoPartialModel.end; 
  currentTime += tick
){
  blocks.push({
    time: currentTime, 
    chars: txtBlocks[i],
  });
  i++;
}
document.write('<pre>'+JSON.stringify(blocks, null, 4) + '</pre>');

// --- 
// document.write('<pre>'+JSON.stringify(monacoPartialModel, null, 4) + '</pre>');
const domTimeline = document.getElementById('timeline');
const domMonacoEditor = document.getElementById('monaco-editor');
let _currentTime = monacoPartialModel.start;
let _currentIndex = 0;
let interval;
interval = setInterval(()=>{
  domTimeline.textContent = ''+_currentTime;
  domMonacoEditor.textContent += txtBlocks[_currentIndex] || '';
  _currentTime += tick;
  _currentIndex++;
  if((_currentTime >= monacoPartialModel.end) || isStopped || !isPlaying){
    clearInterval(interval);
    domTimeline.textContent = 'Done';
  }
}, tick);



function animate() {
  /**
   * @step current time and percentage
   */
  if(!window.startTime){
    window.startTime = Date.now();
  }
  const duration = partialSectionData.duration;
  const currentTime = (Date.now() - window.startTime);
  percentage = currentTime / duration;
  
  /**
   * @step calculate percentage of partial text
   */
  const txtPercentage = percentageOfPartial({
    txtPartial: partialFileData.compiledContent, 
    endPercentage: percentage, 
    startPercentage: 0,
  });
  
  /**
   * @step dom 
   */
  domTimeline.textContent = Math.floor(percentage * 100)+'%';
  domMonacoEditor.textContent = 
    contentBeforePartialIdInMasterTemplate + 
    txtPercentage + 
    contentAfterPartialIdInMasterTemplate;

  /**
   * @step done
   */
  if(percentage < 1 && !isStopped && isPlaying){
    window.requestAnimationFrame(animate);
    console.log(percentage);
    
  }
  else{
    domTimeline.textContent += ' ✅';
    console.log('✅');
    isStopped = true;
    isPlaying = false;
    percentage = 0;
  }
}
/**
 * @function percentageOfPartial
 * @param {string} txtPartial
 * @param {number} endPercentage
 * @param {number?} startPercentage
 */
function percentageOfPartial(
  {
    txtPartial, 
    endPercentage, 
    startPercentage,
  }:
  {
    txtPartial: string;
    endPercentage: number;
    startPercentage?: number;
  }
): string{
  const startIndex = startPercentage ? txtPartial.length * startPercentage : 0;
  const endIndex = txtPartial.length * endPercentage;
  const txtPercentage = txtPartial.substring(startIndex, endIndex);
  return txtPercentage;
}
