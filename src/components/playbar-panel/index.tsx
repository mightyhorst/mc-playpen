import {useState, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {useSlider} from 'react-use';
import {useScrub} from '../../hooks';
import {
    Timeline,
    PlaybarContainer,
    Playbar,
    Handle,
} from './components';
  
interface PlaybarPanelProps{

}
export function PlaybarPanel(props: PlaybarPanelProps){
    const playbarContainerRef = useRef(null);
    const playbarRef = useRef(null);
    const handleRef = useRef(null);
    /*
    const {
        isSliding, 
        value, 
    } = useSlider(playbarContainerRef);
    // const {

    // } = useScrub({
    //     handle: handleRef,
    //     playbar: playbarRef,
    // });
    return (
        <Timeline>
            <PlaybarContainer ref={playbarContainerRef}>
                <Playbar ref={playbarRef} />
                <Handle ref={handleRef}  />
            </PlaybarContainer>
        </Timeline>
    );
    */
    const ref = useRef(null);
    const state = useSlider(playbarContainerRef, {
        onScrubStop: (value) => {
        console.log('onScrubStop', value);
        },
    });

    const left = 100 * state.value;

    return (
        // <div>
        // <div ref={ref} style={{ position: 'relative', background: 'yellow', padding: 4 }}>
        //     <p style={{ margin: 0, textAlign: 'center' }}>Slide me</p>
        //     <div
        //     style={{
        //         position: 'absolute',
        //         top: 0,
        //         left: 100 * state.value + '%',
        //         transform: 'scale(2)',
        //     }}>
        //     {state.isSliding ? '🏂' : '🎿'}
        //     </div>
        // </div>
        // <pre>{JSON.stringify(state, null, 2)}</pre>
        // </div>
        <Timeline>
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
                        left: (left - 2) + '%',
                    }}
                />
            </PlaybarContainer>
        </Timeline>
    );
}