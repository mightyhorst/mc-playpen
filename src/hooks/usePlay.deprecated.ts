import {useCallback, useState} from 'react';

export enum PlayState{
    NOT_STARTED = 'NOT_STARTED',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    FINISHED = 'FINISHED',
};

export function usePlay({
    start: initStart,
    duration,
}:{
    start: number;
    duration: number;
}):{
    isPlaying: boolean;
    isStopped: boolean;
    status: PlayState, 
    play: () => void;
    pause: () => void;
    stop: () => void;
    // reset: () => void;
    currentTime: number;
    setCurrentTime: (currentTime: number) => void;
    currentPercentage: number;
}{
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isStopped, setIsStopped] = useState<boolean>(true);
    const [status, setStatus] = useState<PlayState>(PlayState.NOT_STARTED);

    const [start, setStart] = useState<number>(initStart);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentPercentage, setCurrentPercentage] = useState<number>(0);
    // const currentPercentage = useCallback(() => {
    //     return currentTime / duration;
    // }, [currentTime, duration]);

    // const animate = useCallback(()=> {
    let _start:number;
    const animate = () => {
        if(isStopped){
            _start = Date.now();
            setStart(_start);
        }
        else{
            _start = start;
        }
        
        const _currentTime = Date.now() - _start;
        const _currentPercentage = _currentTime / duration;
        setCurrentTime(_currentTime);
        setCurrentPercentage(_currentPercentage);
        
        /**
         * @step check status and loop
         */
        // if(_currentPercentage < 1 && isPlaying && !isStopped){
        if(_currentPercentage < 1){
            window.requestAnimationFrame(animate);
        }
        else{
            console.log('done', {
                start, 
                _currentTime,
                _currentPercentage,
            });
            // setStatus(PlayState.FINISHED);
            // setIsPlaying(false);
            // setIsStopped(true);
            // setCurrentTime(0);
            // setCurrentPercentage(0);
        }
    }
    // }, [start, currentTime, duration, isPlaying, isStopped]);

    const play = () => {
        let _start:number;
        if(isStopped){
            _start = Date.now();
            setStart(_start);
        }
        setIsPlaying(true);
        setIsStopped(false);
        setStatus(PlayState.PLAYING);

        animate();
    };
    const pause = () => {
        setIsPlaying(false);
        setStatus(PlayState.PAUSED);
    };
    const stop = () => {
        setIsPlaying(false);
        setIsStopped(true);
        setStatus(PlayState.NOT_STARTED);
        setCurrentTime(0);
        setCurrentPercentage(0);
    };
    // const reset = () => {
    //     stop();
    //     setStart(Date.now());
    // };

    return {
        isPlaying, 
        isStopped,
        status, 
        play,
        pause,
        stop,
        // reset,
        currentTime,
        setCurrentTime,
        currentPercentage,
    };
}