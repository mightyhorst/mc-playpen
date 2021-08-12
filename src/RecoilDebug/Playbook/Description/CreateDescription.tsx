import { 
    memo,
    ReactNode, 
} from 'react';
import {
    useRecoilValue,
    useRecoilState,
    useSetRecoilState,
} from 'recoil';
import { 
    listDescriptionsState, 
    showDescriptionIdState, 
    showDescriptionState, 
    updateDescriptionState, 
} from '../../../recoil';
import {

} from '../../../models';
import {

} from '../../../components';
import {

} from '../../../hooks';
import {
    log,
    TimeForm,
} from '..';

interface CreateDescriptionProps{
    children?: ReactNode;
}
export function CreateDescription({
    children,
}:CreateDescriptionProps){
    const [
        descId,
        setDescId,
    ] = useRecoilState(showDescriptionIdState);
    const descriptionPanels = useRecoilValue(listDescriptionsState);
    const currentDescription = useRecoilValue(showDescriptionState);
    const updateDescription = useSetRecoilState(updateDescriptionState(descId));
    
    return (<>
        <form>
            <TimeForm 
                timeline={currentDescription!}
                changeId={(id: string) => {
                    
                }}
                changeStart={(start: number) => {
                    console.log({start});
                    if(currentDescription){
                        updateDescription({
                            ...currentDescription,
                            start,
                        });
                    }
                }}
                changeDuration={(duration: number) => {
                    console.log({duration});
                    if(currentDescription){
                        updateDescription({
                            ...currentDescription,
                            duration,
                        });
                    }
                }}
            />
            <h3> Current Description: </h3>
            <label >
                <p>
                    currentDescriptionPanelId
                </p>
                <pre> {descId} </pre>
            </label>
            <label >
                <p>
                    currentDescriptionPanelId
                </p>
                <select 
                    onChange={e => setDescId(e.target.value)}
                    value={descId}
                >
                    <option key='NEW' value="NEW">
                        NEW
                    </option>
                    {descriptionPanels.map(desc => {
                        return (
                            <option 
                                key={desc._uuid} 
                                value={desc._uuid}
                            >
                                {desc.id} ({desc._uuid})
                            </option>
                        );
                    })}
                </select>
            </label >
            
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
    </>);
}
export default memo(CreateDescription);
