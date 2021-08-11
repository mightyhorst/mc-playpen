/**
 * @requires Recoil
 */
import {
    GetProps, 
    SetProps,
    isDefault,
} from '../../types';
import { 
    getStepById, 
    stepsState, 
    timelineState,
    transformedPlaybookState, 
} from '..';
import {
    atom,
    DefaultValue,
    selector,
    selectorFamily,
} from 'recoil';

/**
 * @requires Models
 */
import {
    ITransformedStep,
} from '../../../models';

/**
 * @namespace Step
 */
export const listStepsState = selector<ITransformedStep[]>({
    key: `listStepsState`,
    get: ({ get }: GetProps): ITransformedStep[] => {
        const { steps } = get(transformedPlaybookState);
        return steps;
    },
    set: ({ get, set, reset, }:SetProps, updatedStep:ITransformedStep[]) => {
        set(transformedPlaybookState, updatedStep);
    },
});

export const StepById = selectorFamily<ITimeline | null, string>({
    key: 'StepById',
    get: (descPanelId: string) => ({ get }: GetProps): ITimeline | null => {
        const StepTimelines: ITimeline[] = get(listStepsState);
        return StepTimelines.find((descPanel) => descPanel.id.toString() === descPanelId.toString()) || null;
    },
    set: (descPanelId: string) => (
        { get, set }: SetProps,
        newValue: ITimeline | DefaultValue | null,
    ) => {
        const steps = get(stepsState);
        if (newValue && !(newValue instanceof DefaultValue)) {
            const step = steps.find((step) => step._uuid === newValue.stepUuid);
            const filteredTimelines =
                step?.timeline.filter(
                    (timeline) => timeline.panel === 'Step' && timeline.id !== newValue.id
                ) || [];
            const updatedTimelines = [...filteredTimelines, newValue];
            console.log(`getStepTimelineById set--->`, {
                step,
                filteredTimelines,
                updatedTimelines
            });
            if (step) {
                set(getStepById(step.id), {
                    ...step,
                    timeline: updatedTimelines
                });
            }
        }
        else{

        }
    },
});

/**
 * @namespace CRUD
 * @name Show
 */
export const showStepIdState = atom<string>({
    key: 'showStepIdState',
    default: null,
});
export const showStepState = selector<ITimeline | null>({
    key: `showStepState`,
    get: ({ get }: GetProps): ITimeline | null => {
        const StepId = get(showStepIdState);
        const Step = get(StepById(StepId));
        return Step;
    },
});
/**
 * @namespace CRUD
 * @name Create
 */
export const createStepState = selector<ITimeline | null>({
    key: `createStepState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        addDesc: ITimeline | DefaultValue,     
    ): void => {
        if(!isDefault(addDesc)){
            const Steps = get(listStepsState);
            const updatedSteps = [
                ...Steps,
                addDesc,
            ]; 
            set(listStepsState, updatedSteps);
        }
    },
});
/**
 * @namespace CRUD
 * @name Update
 */
export const updateStepState = selectorFamily<ITimeline | null, string>({
    key: `updateStepState`,
    get: () => null,
    set: (descId:string) => (
        { get, set }: SetProps,
        updateValue: ITimeline | DefaultValue,     
    ): void => {
        set(StepById(descId), updateValue);
    },
});

/**
 * @namespace CRUD
 * @name Delete
 */
export const deleteStepState = selector<string | null>({
    key: `deleteStepState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        descId: string | DefaultValue,     
    ): void => {
        if(!isDefault(descId)){
            const Steps = get(listStepsState);
            const updatedSteps = Steps.filter(
                desc => desc._uuid !== descId
            );
            set(listStepsState, updatedSteps);
        }
    },
});
