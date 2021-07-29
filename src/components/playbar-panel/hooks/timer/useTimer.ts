import {} from 'react';

/**~~~~~~~~~~~~~~~~~~ 
 * 
 * @namespace timer
 * @function useTimer
 * 
 */
export function useTimer(){
    
  let START = Date.now();
  let DURATION = 2000;
  let END = START + DURATION;
  let CURRENT_TIME = () => Date.now() - START;
  let CURRENT_PERCENTAGE = () => CURRENT_TIME() / DURATION;
  const EDITOR = document.querySelector('#EDITOR');
  const PLAYBAR = document.querySelector('.PLAYBAR');
  const HANDLE = document.querySelector('.HANDLE');
  
  function setTimeFromPercentage(percentage){
    const currentTime = percentage * DURATION;
    START = Date.now() - currentTime;
  }
  
  function printToEditor(percentage){
    const printed = masterAndPartials({
      masterContentsSplit,
      partials,
      percentage,
    });
    EDITOR.textContent = printed.join('');;
  }
  
  function animate(){
    const percentage = CURRENT_PERCENTAGE();
    
    /**
     * @step print text to editor
     */
    printToEditor(percentage);
    
    /**
     * @step update playbar width
     */
    setProgressBarWidth(percentage);
    
    /**
     * @step check status and loop
     */
    if(percentage < 1){
      window.requestAnimationFrame(animate);
    }
    else{
      console.log('done');
    }
  }
}
