import { useState, useMemo, } from 'react';
import { 
    useRafLoop, 
    useUpdate, 
} from './hooks';

export const Timer = () => {
    // const [ticks, setTicks] = useState(0);
    // const [lastCall, setLastCall] = useState(0);
    const [start, setStart] = useState(Date.now());
    const [currentTime, setCurrentTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [msg, setMsg] = useState('');
    const duration = 5000;
    const update = useUpdate();

    const [loopStop, loopStart, isActive] = useRafLoop((time: number) => {
        const now = Date.now();
        setCurrentTime(now - start);
        // setTicks((ticks) => ticks + 1);
        // setLastCall(time);

        if (currentTime >= duration) {
            loopStop();
            setMsg('stopped...');
            update();
            setIsFinished(true);
        }
    }, false);

    const btnStop = useMemo(()=>{
        return (
            <button
                onClick={() => {
                    if (isActive()) {
                        loopStop();
                    }
                    else {
                        setStart(Date.now());
                    }
                    setCurrentTime(0);
                    setIsFinished(false);
                    update();
                }}
            >
                STOP
            </button>
        );
    }, [isActive, loopStop, update]);

    return (
        <div>
            <div>duration: {duration}</div>
            <div>currentTime: {currentTime}</div>
            <br />
            <button
                onClick={() => {
                    if (isActive()) {
                        loopStop();
                    } 
                    else {
                        if(isFinished){
                            setCurrentTime(0);
                            setStart(Date.now());
                        }
                        else{
                            setStart(Date.now() - currentTime);
                        }
                        loopStart();
                    }
                    setIsFinished(false);
                    
                    update();
                }}
            >
                {isActive() ? 'PAUSE' : 'START'}
            </button>
            {isActive() && btnStop}
            <p>{isActive() ? 'playing...' : isFinished ? 'finished' : 'paused'}</p>
            <p>{msg}</p>
        </div>
    );
};
