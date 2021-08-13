import { log } from '.';
import {
    ChangeEvent as ReactChangeEvent, Suspense
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ITimeline, ITransformedStep } from '../../models';
import { listStepsState, showStepIdState, showStepState } from '../../recoil';

interface TimeFormProps{
    timeline: ITimeline;
    changeId: (id: string) => void;
    changeStart: (start: number) => void;
    changeDuration: (start: number) => void;
}
export function TimeForm({
    timeline,
    changeId,
    changeStart,
    changeDuration,
}: TimeFormProps){
    const {
        _uuid,
        id,
        start,
        duration,
    } = timeline;
    
    return (<>
        <label >
            <p>
                _uuid 
            </p>
            <pre>
                {_uuid}
            </pre>
        </label>
        <label >
            <p>
                ID 
            </p>
            <input type="text" defaultValue={id} onChange={(e) => changeId(e.target.value)} />
        </label>
        <label >
            <p>
                start 
            </p>
            <input type="text" defaultValue={start} onChange={(e) => changeStart(parseInt(e.target.value, 10))} />
        </label>
        <label >
            <p>
                duration 
            </p>
            <input type="text" defaultValue={duration} onChange={(e) => changeDuration(parseInt(e.target.value, 10))} />
        </label>
    </>)
}

export default function TimeFormContainer(props:TimeFormProps){
    const timeForm = (
        props.timeline ? 
            <TimeForm {...props} />: 
            <label> <pre> 'loading...' </pre> </label>
    );

    const [currentStepId, setStepId]= useRecoilState(showStepIdState);
    const currentStep: ITransformedStep | null = useRecoilValue(showStepState);
    const steps: ITransformedStep[] = useRecoilValue(listStepsState);

    return (
        <>
            <label>
                <p> 
                    Select a Step
                </p>
                <select 
                    defaultValue={currentStepId}
                    onChange={(event: ReactChangeEvent<HTMLSelectElement>)=> {
                        const {value} = event.target;
                        setStepId(value);
                    }}
                >
                    <option value="NEW" key={'NEW'}>
                        NEW 
                    </option>
                    {
                        steps.map((step:ITransformedStep) => {
                            return (
                                <option 
                                    key={step._uuid}
                                    value={step._uuid}
                                >
                                    {step.id} {step.title}
                                </option>
                            )
                        })
                    }
                </select>
            </label>
            {/* <pre>
                {log(currentStep)}
            </pre> */}
            {timeForm}
        </>
    );
}
