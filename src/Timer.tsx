import { useState, useMemo, memo, } from 'react';
import { 
    useRafLoop,
    useUpdate,
    useAutoPrinter,
    useTimer,
    useTimerRecoil,
} from './hooks';
import {
    IMaster,
    IPartial,
} from './models';
import {
    MonacoEditor,
} from './components';

/*
const txtMaster = `class Hello{
    {{partial01}}
  
  method(){
  
  }
  
  {{partial02}}
  
  help(){
  
  }
  
  {{partial03}}
  
  something(){
  
  }
}`;
const txtMasterCompiled = txtMaster;


export const Editor = memo(function Editor(){
    const {percentage} = useTimer();

    const master: IMaster<{className:string}> = {
        fileName: 'template.hbs', 
        filePath: 'cat01/scene01/step01', 
        contents: txtMaster, 
        compiledContent: txtMasterCompiled,
        data: {
            className: 'Hello',
        },
    };
    const partials: IPartial<{}>[] = [
        {
            partialId: 'partial01',
            fileName: '',
            filePath: '',
            contents: ``,
            compiledContent: `partial01(){
                console.log('hello from partial 01');
            }`,
            data: {}
        },
        {
            partialId: 'partial02',
            fileName: '',
            filePath: '',
            contents: ``,
            compiledContent: `partial02(){
                console.log('hello from partial 02');
            }`,
            data: {}
        },
        {
            partialId: 'partial03',
            fileName: '',
            filePath: '',
            contents: ``,
            compiledContent: `partial03(){
                console.log('hello from partial 03');
            }`,
            data: {}
        },
    ];
    const {
        compiled,
        factory,
    } = useAutoPrinter({
        master,
        partials,
        percentage,
    });

    return (<>
        <MonacoEditor 
            value={compiled}
        />
    </>);
});
*/

export function Timer(){
    const [msg, setMsg] = useState('');
    const update = useUpdate();

    /**
     * @hooks
     */
    const {
        isPlaying,
        isFinished,
        startTime, 
        setStartTime,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        percentage,
        loopStop, 
        loopStart, 
        isActive,
        onStopClick,
        onPlayPauseClick,
    } = useTimer({
        callback: ()=> setMsg('stopped...'),
    });
    
    /*
    const [loopStop, loopStart, isActive] = useRafLoop((time: number) => {
        const now = Date.now();
        setCurrentTime(now - start);

        if (currentTime >= duration) {
            loopStop();
            setMsg('stopped...');
            update();
            // setIsFinished(true);
        }
    }, false);
    */

    const btnStop = useMemo(()=>{
        return (
            <button onClick={onStopClick}>
                STOP
            </button>
        );
    }, [onStopClick]);

    return (
        <div>
            <div>duration: {duration}</div>
            <div>currentTime: {currentTime}</div>
            <br />
            <button onClick={onPlayPauseClick} >
                {isActive() ? 'PAUSE' : 'START'}
            </button>
            {isActive() && btnStop}
            <p>{isActive() ? 'playing...' : isFinished ? 'finished' : 'paused'}</p>
            <p>{msg}</p>
            <p>isPlaying:{isPlaying}</p>
        </div>
    );
};

export default memo(Timer);
