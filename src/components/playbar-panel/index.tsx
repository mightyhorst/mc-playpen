import {useState, useEffect, useRef} from 'react';
import {useSlider} from 'react-use';
import {
    Timeline,
    PlaybarContainer,
    Playbar,
    Handle,
} from './styles';
  
interface PlaybarPanelProps{

}
export function PlaybarPanel(props: PlaybarPanelProps){
    const ref = useRef(null);
    const {
        isSliding, 
        value, 
    } = useSlider(ref);
    return (
        <Timeline>
            <PlaybarContainer ref={ref}>
                <Playbar />
                <Handle  />
            </PlaybarContainer>
        </Timeline>
    );
}