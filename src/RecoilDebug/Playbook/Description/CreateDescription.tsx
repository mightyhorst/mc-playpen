import { 
    memo,
    ReactNode, 
    FocusEvent as ReactFocusEvent,
    MouseEvent as ReactMouseEvent,
    useState,
} from 'react';
import {v4 as genUuid} from 'uuid';
import {
    useRecoilValue,
    useRecoilState,
    useSetRecoilState,
} from 'recoil';
import { 
    createDescriptionState,
    listDescriptionsState, 
    showDescriptionIdState, 
    showDescriptionState, 
    updateDescriptionState, 
} from '../../../recoil';
import { 
    IDescriptionHtml, ITimeline,
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
    const createDescription = useSetRecoilState(createDescriptionState);
        
    const [_uuid, setUuid] = useState<string>(genUuid());
    const [id, setId] = useState<string>(_uuid);
    const [start, setStart] = useState<number>(100);
    const [duration, setDuration] = useState<number>(2000);
    const [description, setDescription] = useState<IDescriptionHtml[]>([]);
    const [currentDescription, setCurrentDescription] = useState<ITimeline>({
        _uuid,
        id,
        panel: 'description',
        start,
        duration,
        description,
    });

    const onDescChanged = (event: ReactFocusEvent<HTMLTextAreaElement>)=>{
        const value = event.target.value;
        try{
            const desc:IDescriptionHtml[] = JSON.parse(value);
            setDescription(desc);
            setCurrentDescription({
                ...currentDescription,
                description: desc,
            });
        }
        catch(err){
            console.log('Error: '+ err.message);
        }
    }

    const btnOnClick = () => {
        createDescription(currentDescription);
        window.location.href='#/description';
    }
    
    return (<>
        <form>
            <h3> Current Description: </h3>
            <TimeForm 
                timeline={currentDescription!}
                changeId={(id: string) => {
                    setId(id);
                    setCurrentDescription({
                        ...currentDescription,
                        id,
                    });
                }}
                changeStart={(start: number) => {
                    setStart(start);
                    setCurrentDescription({
                        ...currentDescription,
                        start,
                    });
                }}
                changeDuration={(duration: number) => {
                    setDuration(duration);
                    setCurrentDescription({
                        ...currentDescription,
                        duration,
                    });
                }}
            />
            <label>
                <p>
                    Description
                </p>
                <textarea 
                    defaultValue={log(currentDescription?.description) || ''}
                    onBlur={onDescChanged}
                />
            </label>
            <button onClick={btnOnClick}>
                <span role='img' aria-label='Create Description'>
                    👉 Create Description
                </span>
            </button>
        </form>
        <h3>currentDescription</h3>
        <pre>
            {log(currentDescription)}
        </pre>
    </>);
}
export default memo(CreateDescription);
