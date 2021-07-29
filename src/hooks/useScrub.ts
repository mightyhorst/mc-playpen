import { 
    RefObject, 
    useCallback, 
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
    if(parent){
        const parentRect = parent.getBoundingClientRect();
        const parentWidth = parentRect.width;
        const percentage = left / parentWidth;
        console.log(percentage * 100 + '%');
        return percentage;
    }
    else throw new Error('I cannot find the parent');
}

/**
 * @hook useScrub
 * @param {RefObject<HTMLElement>} handle - 
 * @param {RefObject<HTMLElement>} playbar - 
 */
export function useScrub({
    isHorizontal = true,
    handle,
    playbar
}: {
    isHorizontal?: boolean,
    handle: RefObject<HTMLElement>;
    playbar: RefObject<HTMLElement>;
}): {
    isDragging: boolean,
    percentage: number,
}{
    // let dragObj:HTMLElement|null = null;
    const [dragObj, setDragObj] = useState<HTMLElement|null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [percentage, setPercentage] = useState<number>(0);
    const [xOffset, setXOffset] = useState<number>(0);
    const [yOffset, setYOffset] = useState<number>(0);

    /** 
     * @desc Drag object 
     */
    const dragObject = useCallback((e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let _clientX:number = 0;

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
            _clientX = mouseEvent.clientX;
        } 
        else if (e.type === 'touchmove') {
            const touchEvent: TouchEvent = <TouchEvent> e;
            /**
             * @step adjust location of dragged object so doesn't jump to mouse position
             */
            _clientX = touchEvent.targetTouches[0].clientX ;
        }

        let _left:number = _clientX - xOffset;

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
    }, [dragObj, xOffset]);

    /**
     * @desc sets offset parameters and starts listening for mouse-move
     */
    const startDrag = useCallback((e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);

        const _dragObj = e.target as HTMLElement;
        setDragObj(_dragObj);
        _dragObj.style.position = 'absolute';

        const rect = _dragObj.getBoundingClientRect();
        const parent = _dragObj.parentElement;
        if(!parent) throw new Error('No parent for the dragObj');
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
    }, [dragObject, isHorizontal]);

    useEffect(()=>{
        if(handle.current){
            handle.current.addEventListener('mousedown', startDrag, false);
            handle.current.addEventListener('touchstart', startDrag, false);
        }
    }, [handle, startDrag]);
    

    function setProgressBarWidth(percentage: number) {
        if(playbar.current){
            playbar.current.style.width = percentage * 100 + '%';
        }
        if(handle.current){
            handle.current.style.left = `calc(100% - 5px)`;
        }
    }

    /** 
     * @event onMouseUp
     * @desc End dragging
     */
    document.onmouseup = function (e) {
        if (dragObj) {
            setIsDragging(false);
            // dragObj = null;
            setDragObj(null);
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
