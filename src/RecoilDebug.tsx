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
    currentDescriptionPanelIdState,
    descriptionTimelinesState,
    currentDescriptionPanelState,
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
        <input type="text" value={id} onChange={(e) => changeId(e.target.value)} />
        <input type="text" value={start} onChange={(e) => changeStart(parseInt(e.target.value))} />
        <input type="text" value={duration} onChange={(e) => changeDuration(parseInt(e.target.value))} />
    </>)
}
export function DescriptionForm(){
    const [
        currentDescriptionPanelId,
        setCurrentDescriptionPanelId,
    ] = useRecoilState(currentDescriptionPanelIdState);
    const descriptionPanels = useRecoilValue(descriptionTimelinesState);
    const [
        currentDescription,
        setCurrentDescription,
    ] = useRecoilState(currentDescriptionPanelState);
    console.log({currentDescription})
    return (<section>
        <input type="text" defaultValue={currentDescriptionPanelId} />
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
        <h3>currentDescription</h3>
        <pre>
            {log(currentDescription)}
        </pre>
    </section>)
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
