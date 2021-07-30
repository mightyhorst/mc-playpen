import { useState } from 'react';
import { useRafLoop, useUpdate } from './hooks';

export const Demo = () => {
    const [ticks, setTicks] = useState(0);
    const [lastCall, setLastCall] = useState(0);
    const [start, setStart] = useState(Date.now());
    const [currentTime, setCurrentTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [msg, setMsg] = useState('');
    const duration = 5000;
    const update = useUpdate();

    const [loopStop, loopStart, isActive] = useRafLoop((time: number) => {
        const now = Date.now();
        setCurrentTime(now - start);
        setTicks((ticks) => ticks + 1);
        setLastCall(time);

        if (currentTime >= duration) {
            loopStop();
            setMsg('stopped...');
            update();
            setIsFinished(true);
        }
    }, false);

    return (
        <div>
            {/* <div>RAF triggered: {ticks} (times)</div> */}
            {/* <div>Last high res timestamp: {lastCall}</div> */}
            {/* <div>start: {start}</div> */}
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
            <button
                onClick={() => {
                    if (isActive()) {
                        loopStop();
                    } 
                    else {
                        setStart(Date.now());
                    //     loopStart();
                    }
                    setCurrentTime(0);
                    setIsFinished(false);
                    update();
                }}
            >
                {isActive() ? 'STOP' : '......'}
            </button>
            <p>{isActive() ? 'active' : 'not active'}</p>
            <p>{msg}</p>
        </div>
    );
};
