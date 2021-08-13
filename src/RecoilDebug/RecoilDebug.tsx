import {
    memo,
    Suspense,
    ChangeEvent as ReactChangeEvent,
} from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { 
    useRecoilState,
    useRecoilValue, 
} from 'recoil';
import { IFile, ITimeline } from '../models';
import {
    listTimelineState,
    codeWithContentTimelinesState,
    blueprintFolderState,
    currentFileState,
    getFile,
    getCodeTimelineById,
    /**
     * @namespace history
     */
    history,
    showStepState,
} from '../recoil';
import {
    log,
    ListDescription,
    CreateDescription,
    ShowDescription,
    UpdateDescription,
} from './Playbook';


export function RecoilDebug(){
    const currentStep = useRecoilValue(showStepState);
    const timeline = useRecoilValue(listTimelineState);
    const codePanels = useRecoilValue(codeWithContentTimelinesState);
    const blueprintFolder = useRecoilValue(blueprintFolderState);
    const currentFile = useRecoilValue(currentFileState);
    const [file, setFile] = useRecoilState<IFile>(getFile('https://610b8f8a2b6add0017cb392b.mockapi.io/template-hbs'));
    const [code, setCode] = useRecoilState(getCodeTimelineById( '2' || codePanels[0].id ));
    return (<Router>
        <nav>
            <div className='accordion'>
                <h3> Description </h3>
                <div className='accordion-body'>
                    <Link to='/description'>
                        List Description 
                    </Link>
                    <Link to='/description/create'>
                        Create Description 
                    </Link>
                    <Link to='/description/update'>
                        Update Description 
                    </Link>
                    <Link to='/description/show'>
                        Show Description 
                    </Link>
                </div>
            </div>
        </nav>
        <main>
                <Route exact path='/description'>
                    <ListDescription /> 
                </Route>
                <Route exact path='/description/create'>
                    <CreateDescription />
                </Route>
                <Route exact path='/description/update'>
                    <UpdateDescription />
                </Route>
                <Route exact path='/description/:id'>
                    <ShowDescription />
                </Route>
        </main>
        <aside>
            <h3>currentStep</h3>
            <pre>{log(currentStep)}</pre>
            <hr/>
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
            {/* <h3>currentStep</h3>
            <pre>
                {log(currentStep)}
            </pre> */}
            <section className='NONE'>
                <h3>blueprintFolder</h3>
                <pre>
                    {log(blueprintFolder)}
                </pre>
                <h3>currentFile</h3>
                <pre>
                    {log(currentFile)}
                </pre>
            </section>
        </aside>
    </Router>);
}
export function RecoilDebugSuspense(){
    return (
        <Suspense fallback={<h1> Loading... </h1>}>
            <RecoilDebug />
        </Suspense>
    );
}
export default memo(RecoilDebugSuspense);
