import {
    memo,
    Suspense,
    ChangeEvent as ReactChangeEvent,
} from 'react';
import { 
    useRecoilState,
    useRecoilValue, 
} from 'recoil';
import { IFile, ITimeline } from './models';
import {
    scenesState,
    currentSceneIdState,
    currentSceneState,
    stepsState,
    currentStepIdState,
    currentStepState,
    timelineState,
    codeWithContentTimelinesState,
    blueprintFolderState,
    currentFileState,
    getFile,
    getCodeTimelineById,
    /**
     * @namespace history
     */
    history,
    currentDescriptionIdState,
    descriptionsState,
    currentDescriptionState,
} from './recoil';

function log(data:any){
    return JSON.stringify(data, null, 4);
}

export function TimelineForm({
    timeline,
    changeId,
    changeStart,
    changeDuration,
}: {
    timeline: ITimeline;
    changeId: (id: string) => void;
    changeStart: (start: number) => void;
    changeDuration: (start: number) => void;
}){
    const {
        id,
        start,
        duration,
    } = timeline;
    return (<>
        <label >
            <p>
                ID 
            </p>
            <input type="text" value={id} onChange={(e) => changeId(e.target.value)} />
        </label>
        <label >
            <p>
                start 
            </p>
            <input type="text" value={start} onChange={(e) => changeStart(parseInt(e.target.value))} />
        </label>
        <label >
            <p>
                duration 
            </p>
            <input type="text" value={duration} onChange={(e) => changeDuration(parseInt(e.target.value))} />
        </label>
    </>)
}
export function DescriptionForm(){
    const [
        currentDescriptionPanelId,
        setCurrentDescriptionPanelId,
    ] = useRecoilState(currentDescriptionIdState);
    const descriptionPanels = useRecoilValue(descriptionsState);
    const [
        currentDescription,
        setCurrentDescription,
    ] = useRecoilState(currentDescriptionState);
    console.log({currentDescription})
    return (<>
        <form>
            <h3> Current Description: </h3>
            <label >
                <p>
                    currentDescriptionPanelId
                </p>
                <pre> {currentDescriptionPanelId} </pre>
            </label>
            <label >
                <p>
                    currentDescriptionPanelId
                </p>
                <select 
                    onChange={e => setCurrentDescriptionPanelId(e.target.value)}
                    value={currentDescriptionPanelId}
                >
                    {descriptionPanels.map(desc => {
                        return (
                            <option 
                                key={desc.id} 
                                defaultChecked={desc.id === currentDescriptionPanelId}
                            >
                                {desc.id}
                            </option>
                        );
                    })}
                </select>
            </label >
            {currentDescription && 
                <TimelineForm 
                    timeline={currentDescription}
                    changeId={(id: string) => {
                        setCurrentDescription({
                            ...currentDescription,
                            id,
                        });
                    }}
                    changeStart= {(start: number) => {
                        setCurrentDescription({
                            ...currentDescription,
                            start,
                        });
                    }}
                    changeDuration={(duration: number)  => {
                        setCurrentDescription({
                            ...currentDescription,
                            duration,
                        });
                    }}
                />
            }
            <label>
                <p>
                    Description
                </p>
                <textarea 
                    defaultValue={log(currentDescription?.description) || ''}
                />
            </label>
        </form>
        <h3>currentDescription</h3>
        <pre>
            {log(currentDescription)}
        </pre>
    </>)
}

export function RecoilDebug(){
    const currentStep = useRecoilValue(currentStepState);
    const timeline = useRecoilValue(timelineState);
    const codePanels = useRecoilValue(codeWithContentTimelinesState);
    const blueprintFolder = useRecoilValue(blueprintFolderState);
    const currentFile = useRecoilValue(currentFileState);
    const [file, setFile] = useRecoilState<IFile>(getFile('https://610b8f8a2b6add0017cb392b.mockapi.io/template-hbs'));
    const [code, setCode] = useRecoilState(getCodeTimelineById( '2' || codePanels[0].id ));
    return (<>
        <DescriptionForm />
        <h3>code</h3>
        <pre>{log(code)}</pre>
        <textarea 
            name="codeId" 
            id="codeId" 
            cols={30} 
            rows={10}
            defaultValue={code?.comment}
            onChange={(event: ReactChangeEvent<HTMLTextAreaElement>)=>{
                console.log('', {code});
                setCode({
                    ...code!,
                    comment: event.target.value || '',
                });
            }}
        />
        <button onClick={()=>{
            if(history.length > 0){
                history[0].undo();
            }
        }}>Reset</button>
        <h3>getFile</h3>
        <pre>{log(file.file_content)}</pre>
        <textarea 
            name="fileId" 
            id="fileId" 
            cols={30} 
            rows={10}
            defaultValue={file.file_content}
            onChange={(event: ReactChangeEvent<HTMLTextAreaElement>)=>{
                console.log('', event.target.value);
                setFile({
                    ...file,
                    file_content: event.target.value || '',
                });
            }}
        />
        <h3>codePanels</h3>
        <pre>
            {log(codePanels)}
        </pre>
        <h3>timeline</h3>
        <pre>
            {log(timeline)}
        </pre>
        <h3>currentStep</h3>
        <pre>
            {log(currentStep)}
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
