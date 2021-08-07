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
    blueprintFolderState,
    currentFileState,
} from './recoil';

function log(data:any){
    return JSON.stringify(data, null, 4);
}

export function RecoilDebug(){
    const currentPlaybookStep = useRecoilValue(currentPlaybookStepState);
    const playbookTimeline = useRecoilValue(playbookTimelineState);
    const currentTimelineCodePanels = useRecoilValue(currentTimelineCodePanelsState);
    const blueprintFolder = useRecoilValue(blueprintFolderState);
    const currentFile = useRecoilValue(currentFileState);
    return (<>
        <h3>currentTimelineCodePanels</h3>
        <pre>
            {log(currentTimelineCodePanels)}
        </pre>
        <h3>blueprintFolder</h3>
        <pre>
            {log(blueprintFolder)}
        </pre>
        <h3>currentFile</h3>
        <pre>
            {log(currentFile)}
        </pre>
    </>);
}
export function RecoilDebugSuspense(){
    return (
        <Suspense fallback={<h1> Loading... </h1>}>
            <RecoilDebug />
        </Suspense>
    );
}
export default memo(RecoilDebugSuspense);
