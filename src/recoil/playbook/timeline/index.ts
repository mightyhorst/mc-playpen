import {
    atom,
    atomFamily,
    selector,
    selectorFamily,
    DefaultValue,
} from 'recoil';
import {
    GetProps,
    SetProps,
} from '../../../recoil';
import {
    ITransformedStep,
    ITimeline,
} from '../../../models';
import { isDefault } from '../../types';
import { 
    showStepState, 
    updateStepState,
} from '../';

/**
 * @namespace Timeline
 */
export const listTimelineState = selector<ITimeline[]>({
    key: 'listTimelineState',
    get: ({ get }: GetProps): ITimeline[] => {
        const currentStep: ITransformedStep | null = get(
            showStepState,
        );
        if (currentStep) {
            return currentStep.timeline.map(
                (panel) => {
                    panel.stepUuid = currentStep._uuid;
                    return panel;
                }
            );
        } else {
            return [];
        }
    },
    set: (
        { get, set, reset, }: SetProps, 
        updatedTimelines: ITimeline[] | DefaultValue,
    ) => {
        const currentStep = get(showStepState);
        if(currentStep && !isDefault(updatedTimelines)){
            const updatedStep:ITransformedStep = {
                ...currentStep,
                timeline: <ITimeline[]>updatedTimelines,
            }
            console.log(`listTimelineState`, {
                updatedTimelines,
                updatedStep,
            });
            set(updateStepState(currentStep._uuid!), updatedStep);
        }
    },
});

export const findTimelineById = selectorFamily<ITimeline | null, string>({
    key: 'findTimelineById',
    get: (timelineUuid: string) => ({ get }: GetProps): ITimeline | null => {
        const timelines = get(listTimelineState);
        return timelines.find((timeline) => timeline._uuid?.toString() === timelineUuid.toString()) || null;
    },
    set: (stepUuid: string) => (
        { get, set }: SetProps,
        updatedTimeline: ITimeline | DefaultValue | null,
    ) => {
        if (updatedTimeline && !isDefault(updatedTimeline)) {
            console.log(`findTimelineById`, {
                stepUuid,
                updatedTimeline,
            });
            const timelines = get(listTimelineState);
            const updatedTimelines = timelines.filter((timeline) => timeline._uuid !== stepUuid);
            updatedTimelines.push(<ITimeline>updatedTimeline);
            set(listTimelineState, updatedTimelines);
        }
    },
});

/**
 * @namespace CRUD
 * @name Show
 */
export const showTimelineIdState = atom<string>({
    key: 'showTimelineIdState',
    default: '',
});
export const showTimelineState = selector<ITimeline | null>({
    key: `showTimelineState`,
    get: ({ get }: GetProps): ITimeline | null => {
        const timelineId = get(showTimelineIdState);
        const timeline = get(findTimelineById(timelineId));
        return timeline;
    },
});
/**
 * @namespace CRUD
 * @name Create
 */
export const createTimelineState = selector<ITimeline | null>({
    key: `createTimelineState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        addedTimeline: ITimeline | DefaultValue | null,
    ): void => {
        if(!isDefault(addedTimeline)){
            const timelines = get(listTimelineState);
            timelines.push(<ITimeline>addedTimeline);
            set(listTimelineState, timelines);
        }
    },
});
/**
 * @namespace CRUD
 * @name Update
 */
export const updateTimelineState = selectorFamily<ITimeline | null, string>({
    key: `updateTimelineState`,
    get: () => () => null,
    set: (timelineId:string) => (
        { get, set }: SetProps,
        updatedTimeline: ITimeline | DefaultValue | null,
    ): void => {
        if(updatedTimeline && !isDefault(updatedTimeline)){
            console.log(`updateTimelineState`, {
                timelineId,
                updatedTimeline,
            });
            set(findTimelineById(timelineId), updatedTimeline);
        }
    },
});

/**
 * @namespace CRUD
 * @name Delete
 */
export const deleteTimelineState = selector<string | null>({
    key: `deleteTimelineState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        timelineId: string | DefaultValue | null,
    ): void => {
        if(!isDefault(timelineId)){
            const timelines = get(listTimelineState);
            const updatedTimelines = timelines.filter(
                desc => desc._uuid !== timelineId
            );
            set(listTimelineState, updatedTimelines);
        }
    },
});
