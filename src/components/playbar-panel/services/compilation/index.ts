export * from './percentageOfPartial';
export * from './masterContentsSplit';
export * from './masterAndPartials';
export * from './masterAndPartialsWithRanges';
  
  

  
  
  /** ~~~~~~~~~~~~~~~~~~~~~~
   *
   * @namespace drag
   *
   */
  HANDLE.addEventListener("mousedown", startDrag, false);
  HANDLE.addEventListener("touchstart", startDrag, false);
  let dragObj = null;
  
  function setProgressBarWidth(percentage){
    PLAYBAR.style.width = percentage * 100 + '%';
    HANDLE.style.left = `calc(100% - 5px)`;
  }
  
  /*sets offset parameters and starts listening for mouse-move*/
  function startDrag(e){
    window.IS_DRAGGING = true;
      e.preventDefault();
      e.stopPropagation();
      dragObj = e.target;
      dragObj.style.position = "absolute";
      
      const rect = dragObj.getBoundingClientRect();
    const parent = dragObj.parentElement;
    const parentRect = parent.getBoundingClientRect();
      
      if(e.type ==='mousedown')
      {
      //clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
          xOffset = e.clientX - rect.left + (rect.width/2) + parentRect.left; 
          yOffset = e.clientY - rect.top;
          window.addEventListener('mousemove', dragObject, false);
      }
      else if(e.type === 'touchstart'){
      //clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
          xOffset = e.targetTouches[0].clientX - rect.left; 
          yOffset = e.targetTouches[0].clientY - rect.top;
          window.addEventListener('touchmove', dragObject, false);
      }
  }
  
  /*Drag object*/
  function dragObject(e){
      e.preventDefault();
      e.stopPropagation();
      
    // if there is no object being dragged then do nothing
      if(dragObj === null){
      return; 
    }
    else if(e.type === "mousemove"){
      // adjust location of dragged object so doesn't jump to mouse position
      const left = e.clientX - xOffset;
          //dragObj.style.top = e.clientY-yOffset +"px";
      const percentage = findPercentageOnDrag(dragObj, left);
      if(percentage >= 0 && percentage <=1){
            dragObj.style.left = (percentage * 100) +"%";
        // setProgressBarWidth(percentage);;
        window.PERCENTAGE = percentage;
      }
      }
    else if(e.type === "touchmove"){
      // adjust location of dragged object so doesn't jump to mouse position
          dragObj.style.left = e.targetTouches[0].clientX - xOffset +"px"; 
          //dragObj.style.top = e.targetTouches[0].clientY-yOffset +"px";
      }
  }
  
  /*End dragging*/
  document.onmouseup = function(e){
      if(dragObj){
      window.IS_DRAGGING = false;
          dragObj = null;
          window.removeEventListener('mousemove', dragObject, false);
          window.removeEventListener('touchmove', dragObject, false);
      /**
       * @step percentage
       */
      const percentage = window.PERCENTAGE;
      setTimeFromPercentage(percentage);
      /**
       * @step print text to editor
       */
      printToEditor(percentage);
      /**
       * @step progress bar
       */
      // setProgressBarWidth(percentage);
      log(`Percentage: ${Math.ceil(percentage * 100)}%`);
      log(`CURRENT_PERCENTAGE: ${Math.ceil(CURRENT_TIME())} of ${DURATION}ms`);
      }
  }
  
  
          
  function findPercentageOnDrag(dragObj, left){
    const parent = dragObj.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const parentWidth = parentRect.width;
    const percentage = left / parentWidth;
    console.log((percentage * 100) + '%');
    return percentage;
  }
  
  
  /**
   * @namespace click on playbar container
   */
  const playbarContainer = document.querySelector('.playbar-container');
  function getPlaybarContainerWidth(){
    const rect = playbarContainer.getBoundingClientRect();
    return rect.width;
  }
  playbarContainer.addEventListener('click', (evt)=>{
      if(window.IS_DRAGGING) return;
      evt.preventDefault();
        evt.stopPropagation();
      const width = getPlaybarContainerWidth();
      const percentage = (evt.offsetX / width);
      // setProgressBarWidth(percentage);
      //setTimeFromPercentage(percentage)
  }, false);
  