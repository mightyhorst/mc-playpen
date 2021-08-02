import { useState, useMemo, } from 'react';
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


export function Editor(
    {
        currentTime,
        duration,
    }: {
        currentTime:number,
        duration:number,
    }
){
    const percentage = (currentTime / duration);

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

    // setCompiled(factory(1).map(t=>t.text).join(''))

    return (<>
        {/* <pre>
            {compiled}
        </pre> */}
        <MonacoEditor 
            value={compiled}
        />
    </>);
}


export default function Timer(){
    // const [ticks, setTicks] = useState(0);
    // const [lastCall, setLastCall] = useState(0);
    const [start, setStart] = useState(Date.now());
    const [isFinished, setIsFinished] = useState(false);
    const [msg, setMsg] = useState('');

    /**
     * @hooks
     */
    const {
        currentTime,
        setCurrentTime,
        duration,
    } = useTimer();
    // const [currentTime, setCurrentTime] = useState(0);
    // const duration = 2000;
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
    }, [isActive, loopStop, update, setCurrentTime]);

    const editor = useMemo(()=>{
        return <Editor 
            // percentage={percentage} 
            currentTime={currentTime}
            duration={duration}
        />
    }, [currentTime, duration]);

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
            {editor}
            <p>{msg}</p>
        </div>
    );
};


