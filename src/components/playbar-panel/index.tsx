import {
    MouseEvent as ReactMouseEvent,
    useState, 
    useEffect, 
    useRef,
} from 'react';
import clsx from 'clsx';
import {
    // useSlider,
    // useRaf,
} from 'react-use';
import {
    useSlider,
    useRaf,
    usePlay,
} from '../../hooks';
import {
    Timeline,
    PlaybarContainer,
    Playbar,
    Handle,
} from './components';
import LineIcon from 'react-lineicons';
  
interface PlaybarPanelProps{

}
export function PlaybarPanel(props: PlaybarPanelProps){
    const {
        isPlaying,
        isStopped,
        status,
        play,
        pause,
        stop,
        currentTime,
        currentPercentage,
        setCurrentTime,
    } = usePlay({
        start: 0,
        duration: 10000,
    })
    const playbarContainerRef = useRef(null);
    const playbarRef = useRef(null);
    const handleRef = useRef(null);
    
    const state = useSlider(playbarContainerRef, {
        onScrubStop: (value) => {
            console.log('onScrubStop', value);
        },
    });

    const left = isPlaying ? 
        100 * currentPercentage : 
        100 * state.value;

    const btnPlayPauseClick = (evt: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(isPlaying){
            pause();
        }
        else{
            play();
        }
    };
    const btnStopClick = (evt: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
        stop();
    };

    const elapsed = useRaf(5000, 1000);

    return (<>
        <p>Elapsed: {elapsed}</p>
        <Timeline>
            <div>
                <button onClick={btnPlayPauseClick}>
                    <LineIcon name={isPlaying? 'pause': 'play'} />
                </button>
                <button onClick={btnStopClick}>
                    <LineIcon name={'stop'} />
                </button>
            </div>
            <PlaybarContainer ref={playbarContainerRef}>
                <Playbar 
                    ref={playbarRef} 
                    className={clsx({notSliding: !state.isSliding})}
                    style={{
                        width: left + '%',
                        transition: state.isSliding ? '' : 'width 0.16s linear',
                    }} 
                />
                <Handle ref={handleRef} 
                    style={{
                        left: `calc(${left}% - 5px)`,
                    }}
                />
            </PlaybarContainer>
        </Timeline>
    </>);
}