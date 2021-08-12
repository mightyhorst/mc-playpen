/**
 * @requires Recoil
 */
import {
    GetProps, 
    SetProps,
    isDefault,
} from '../../types';
import { 
    listTimelineState,
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
import { updateTimelineState } from '../timeline';

/**
 * @namespace DescriptionTimelines
 */
export const listDescriptionsState = selector<ITimeline[]>({
    key: `listDescriptionsState`,
    get: ({ get }: GetProps): ITimeline[] => {
        const stepTimeline: ITimeline[] = get(listTimelineState);
        const descriptionPanels: ITimeline[] = stepTimeline.filter((timeline) =>
            timeline.hasOwnProperty('description') && timeline.panel === 'description'
        );
        return descriptionPanels;
    },
    set: ({ get, set, reset, }:SetProps, updatedTimeline:ITimeline[] | DefaultValue) => {
        set(listTimelineState, updatedTimeline);
    },
});

export const findDescriptionById = selectorFamily<ITimeline | null, string>({
    key: 'descriptionById',
    get: (descPanelId: string) => ({ get }: GetProps): ITimeline | null => {
        const descriptionTimelines: ITimeline[] = get(listDescriptionsState);
        return descriptionTimelines.find((descPanel) => descPanel._uuid?.toString() === descPanelId.toString()) || null;
    },
    set: (descPanelId: string) => (
        { get, set }: SetProps,
        updatedDesc: ITimeline | DefaultValue | null,
    ) => {
        // const steps = get(listStepsState);
        if (updatedDesc && !isDefault(updatedDesc)) {
            console.log(`findDescriptionById`, {
                descPanelId,
                updatedDesc,
            });
            // const step = steps.find((step) => step._uuid === updatedDesc.stepUuid);
            // const filteredTimelines =
            //     step?.timeline.filter(
            //         (timeline) => timeline.panel === 'description' && timeline.id !== updatedDesc.id
            //     ) || [];
            // const descriptions: ITimeline[] = get(listDescriptionsState);
            // const filteredTimelines = descriptions.find((descPanel) => descPanel.id.toString() !== descPanelId.toString()) || null;
            // const timelines = [...filteredTimelines, updatedDesc];
            set(updateTimelineState(descPanelId), updatedDesc);
            // if (step) {
            //     set(findStepById(step.id), {
            //         ...step,
            //         timeline: descriptions
            //     });
            // }
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
    default: '',
});
export const showDescriptionState = selector<ITimeline | null>({
    key: `showDescriptionState`,
    get: ({ get }: GetProps): ITimeline | null => {
        const descriptionId = get(showDescriptionIdState);
        const description = get(findDescriptionById(descriptionId));
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
        createdDesc: ITimeline | DefaultValue | null,     
    ): void => {
        if(!isDefault(createdDesc) && createdDesc){
            const descriptions:ITimeline[] = get(listDescriptionsState);
            descriptions.push(<ITimeline>createdDesc);
            set(listDescriptionsState, descriptions);
        }
    },
});
/**
 * @namespace CRUD
 * @name Update
 */
export const updateDescriptionState = selectorFamily<ITimeline|null, string>({
    key: `updateDescriptionState`,
    get: () => () => null,
    set: (descId:string) => (
        { get, set }: SetProps,
        updatedDesc: ITimeline | DefaultValue | null,     
    ): void => {
        if(!isDefault(updatedDesc) && updatedDesc){
            console.log(`updateDescriptionState`, {
                descId,
                updatedDesc,
            });
            set(findDescriptionById(descId), updatedDesc);
        }
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
        descId: string | DefaultValue | null,     
    ): void => {
        if(!isDefault(descId) && descId){
            const descriptions = get(listDescriptionsState);
            const updatedDescriptions = descriptions.filter(
                desc => desc._uuid !== descId
            );
            set(listDescriptionsState, updatedDescriptions);
        }
    },
});
