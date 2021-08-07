import {
    memo,
    Suspense,
} from 'react';
import { 
    useRecoilValue, 
} from 'recoil';
import {
    playbookScenesState,
    currentPlaybookSceneIdState,
    currentPlaybookSceneState,
    playbookStepsState,
    currentPlaybookStepIdState,
    currentPlaybookStepState,
    playbookTimelineState,
    currentTimelineCodePanelsState,
} from './recoil';

function log(data:any){
    return JSON.stringify(data, null, 4);
}

export function RecoilDebug(){
    const currentPlaybookStep = useRecoilValue(currentPlaybookStepState);
    const playbookTimeline = useRecoilValue(playbookTimelineState);
    const currentTimelineCodePanels = useRecoilValue(currentTimelineCodePanelsState);
    return (
        <pre>
            {log(currentTimelineCodePanels)}
        </pre>
    );
}
export function RecoilDebugSuspense(){
    return (
        <Suspense fallback={<h1> Loading... </h1>}>
            <RecoilDebug />
        </Suspense>
    );
}
export default memo(RecoilDebugSuspense);
