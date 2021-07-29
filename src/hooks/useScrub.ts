import { 
    RefObject, 
    useEffect, 
    useState, 
} from 'react';

/**
 * @function findPercentageOnDrag
 * @param {HTMLElement} dragObj - the dragged handle dom
 * @param {number} left - left in px
 */
function findPercentageOnDrag(dragObj: HTMLElement, left: number) {
    const parent = dragObj.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const parentWidth = parentRect.width;
    const percentage = left / parentWidth;
    console.log(percentage * 100 + '%');
    return percentage;
}

/**
 * @hook useSlider
 * @param {RefObject<HTMLElement>} handle - 
 * @param {RefObject<HTMLElement>} playbar - 
 */
export function useSlider({
    isHorizontal = true,
    handle,
    playbar
}: {
    isHorizontal: boolean,
    handle: RefObject<HTMLElement>;
    playbar: RefObject<HTMLElement>;
}): {
    isDragging: boolean,
    percentage: number,
}{
    let dragObj:HTMLElement = null;
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [percentage, setPercentage] = useState<number>(0);
    const [xOffset, setXOffset] = useState<number>(null);
    const [yOffset, setYOffset] = useState<number>(null);

    /** 
     * @desc Drag object 
     */
    function dragObject(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        e.stopPropagation();

        let _left:number = 0;

        /** 
         * @step if there is no object being dragged then do nothing
         */
        if (dragObj === null) {
            return;
        } 
        else if (e.type === 'mousemove') {
            const mouseEvent: MouseEvent = <MouseEvent> e;
            /** 
             * @step adjust location of dragged object so doesn't jump to mouse position
             */
            _left = mouseEvent.clientX - xOffset;
        } 
        else if (e.type === 'touchmove') {
            const touchEvent: TouchEvent = <TouchEvent> e;
            /**
             * @step adjust location of dragged object so doesn't jump to mouse position
             */
            _left = touchEvent.targetTouches[0].clientX - xOffset;
        }

        /**
         * @step convert left px to percentage
         */
        const _percentage = findPercentageOnDrag(dragObj, _left);

        /**
         * @check valid percentage
         */
        if (_percentage >= 0 && _percentage <= 1) {
            dragObj.style.left = _percentage * 100 + '%';
            setPercentage(_percentage);
        }
    }

    /**
     * @desc sets offset parameters and starts listening for mouse-move
     */
    function startDrag(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);

        dragObj = e.target as HTMLElement;
        dragObj.style.position = 'absolute';

        const rect = dragObj.getBoundingClientRect();
        const parent = dragObj.parentElement;
        const parentRect = parent.getBoundingClientRect();

        if (e.type === 'mousedown') {

            const mouseEvent: MouseEvent = <MouseEvent> e;
            /** 
             * @step clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
             */
            if(isHorizontal){
                setXOffset(mouseEvent.clientX - rect.left + rect.width / 2 + parentRect.left);
            }
            else{
                setYOffset(mouseEvent.clientY - rect.top);
            }
            window.addEventListener('mousemove', dragObject, false);

        } 
        else if (e.type === 'touchstart') {

            const touchEvent: TouchEvent = <TouchEvent> e;
            /** 
             * @step clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
             */
            if(isHorizontal){
                setXOffset(touchEvent.targetTouches[0].clientX - rect.left);
            }
            else{
                setYOffset(touchEvent.targetTouches[0].clientY - rect.top);
            }
            window.addEventListener('touchmove', dragObject, false);

        }
    }

    handle.current.addEventListener('mousedown', startDrag, false);
    handle.current.addEventListener('touchstart', startDrag, false);
    

    function setProgressBarWidth(percentage) {
        playbar.current.style.width = percentage * 100 + '%';
        handle.current.style.left = `calc(100% - 5px)`;
    }

    /** 
     * @event onMouseUp
     * @desc End dragging
     */
    document.onmouseup = function (e) {
        if (dragObj) {
            setIsDragging(false);
            dragObj = null;
            window.removeEventListener('mousemove', dragObject, false);
            window.removeEventListener('touchmove', dragObject, false);
            
            /**
             * @step percentage
             */
            // setTimeFromPercentage(percentage);

            /**
             * @step print text to editor
             */
            // printToEditor(percentage);

            /**
             * @step progress bar
             */
            setProgressBarWidth(percentage);
        }
    };

    /**
     * @returns scrubbing data
     */
    return {
        isDragging,
        percentage,
    };
}
