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
    ITimeline,
} from '../../../models';

/**
 * @namespace DescriptionTimelines
 */
export const listDescriptionsState = selector<ITimeline[]>({
    key: `listDescriptionsState`,
    get: ({ get }: GetProps): ITimeline[] => {
        const stepTimeline: ITimeline[] = get(timelineState);
        const descriptionPanels: ITimeline[] = stepTimeline.filter((timeline) =>
            timeline.hasOwnProperty('description') && timeline.panel === 'description'
        );
        return descriptionPanels;
    },
    set: ({ get, set, reset, }:SetProps, updatedTimeline:ITimeline[]) => {
        set(timelineState, updatedTimeline);
    },
});

export const descriptionById = selectorFamily<ITimeline | null, string>({
    key: 'descriptionById',
    get: (descPanelId: string) => ({ get }: GetProps): ITimeline | null => {
        const descriptionTimelines: ITimeline[] = get(listDescriptionsState);
        return descriptionTimelines.find((descPanel) => descPanel.id.toString() === descPanelId.toString()) || null;
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
                    (timeline) => timeline.panel === 'description' && timeline.id !== newValue.id
                ) || [];
            const updatedTimelines = [...filteredTimelines, newValue];
            console.log(`getDescriptionTimelineById set--->`, {
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
export const showDescriptionIdState = atom<string>({
    key: 'showDescriptionIdState',
    default: null,
});
export const showDescriptionState = selector<ITimeline | null>({
    key: `showDescriptionState`,
    get: ({ get }: GetProps): ITimeline | null => {
        const descriptionId = get(showDescriptionIdState);
        const description = get(descriptionById(descriptionId));
        return description;
    },
});
/**
 * @namespace CRUD
 * @name Create
 */
export const createDescriptionState = selector<ITimeline | null>({
    key: `createDescriptionState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        addDesc: ITimeline | DefaultValue,     
    ): void => {
        if(!isDefault(addDesc)){
            const descriptions = get(listDescriptionsState);
            const updatedDescriptions = [
                ...descriptions,
                addDesc,
            ]; 
            set(listDescriptionsState, updatedDescriptions);
        }
    },
});
/**
 * @namespace CRUD
 * @name Update
 */
export const updateDescriptionState = selectorFamily<ITimeline | null, string>({
    key: `updateDescriptionState`,
    get: () => null,
    set: (descId:string) => (
        { get, set }: SetProps,
        updateValue: ITimeline | DefaultValue,     
    ): void => {
        set(descriptionById(descId), updateValue);
    },
});

/**
 * @namespace CRUD
 * @name Delete
 */
export const deleteDescriptionState = selector<string | null>({
    key: `deleteDescriptionState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        descId: string | DefaultValue,     
    ): void => {
        if(!isDefault(descId)){
            const descriptions = get(listDescriptionsState);
            const updatedDescriptions = descriptions.filter(
                desc => desc._uuid !== descId
            );
            set(listDescriptionsState, updatedDescriptions);
        }
    },
});
