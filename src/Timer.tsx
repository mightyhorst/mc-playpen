import { useState, useMemo, memo, } from 'react';
import { 
    useRafLoop,
    useUpdate,
    useAutoPrinter,
    useTimer,
} from './hooks';
import {
    IMaster,
    IPartial,
} from './models';
import {
    MonacoEditor,
} from './components';

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


export function Editor(){
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
    // const [compiled, setCompiled] = useState('');
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
}


export function Timer(){
    // const [ticks, setTicks] = useState(0);
    // const [lastCall, setLastCall] = useState(0);
    // const [start, setStart] = useState(Date.now());
    // const [isFinished, setIsFinished] = useState(false);
    // const [currentTime, setCurrentTime] = useState(0);
    // const duration = 2000;
    const [msg, setMsg] = useState('');
    const update = useUpdate();

    /**
     * @hooks
     */
    const {
        startTime, 
        setStartTime,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        percentage,
        isFinished,
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

    const editor = useMemo(()=>{
        return <Editor />
    }, []);

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
            {editor}
            <p>{msg}</p>
        </div>
    );
};

export default memo(Timer);
