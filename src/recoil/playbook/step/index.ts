/**
 * @requires Recoil
 */
import {
    GetProps, 
    SetProps,
    isDefault,
} from '../../types';
import {
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
    ITransformedPlaybook,
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
    set: ({ get, set, reset, }:SetProps, updatedSteps:ITransformedStep[] | DefaultValue) => {
        if(updatedSteps && !isDefault(updatedSteps) ){
            console.log(`listStepsState`, {
                updatedSteps,
            });
            const playbook = get(transformedPlaybookState);
            playbook.steps = <ITransformedStep[]>updatedSteps;
            const updatedPlaybook:ITransformedPlaybook = {
                ...playbook,
                steps: <ITransformedStep[]>updatedSteps,
            };
            set(transformedPlaybookState, updatedPlaybook);
        }
    },
});

export const findStepById = selectorFamily<ITransformedStep | null, string>({
    key: 'findStepById',
    get: (stepUuid: string) => ({ get }: GetProps): ITransformedStep | null => {
        const steps = get(listStepsState);
        return steps.find((step) => {
            console.log({
                'step._uuid': step._uuid,
                stepUuid,
                'step._uuid?.toString() === stepUuid.toString()': step._uuid?.toString() === stepUuid.toString(),
                step,
            });
            
            return step._uuid?.toString() === stepUuid.toString();
        }) || null;
    },
    set: (stepUuid: string) => (
        { get, set }: SetProps,
        updatedStep: ITransformedStep | DefaultValue | null,
    ) => {
        if (updatedStep && !isDefault(updatedStep)) {
            console.log(`findStepById`, {
                stepUuid,
                updatedStep,
            });
            const steps = get(listStepsState);
            const updatedSteps = steps.filter((step) => step._uuid !== stepUuid);
            updatedSteps.push(<ITransformedStep>updatedStep);
            set(listStepsState, updatedSteps);
        }
    },
});

/**
 * @namespace CRUD
 * @name Show
 */
export const showStepIdState = atom<string>({
    key: 'showStepIdState',
    default: '',
});
export const showStepState = selector<ITransformedStep | null>({
    key: `showStepState`,
    get: ({ get }: GetProps): ITransformedStep | null => {
        const stepId = get(showStepIdState);
        const step = get(findStepById(stepId));
        return step;
    },
});
/**
 * @namespace CRUD
 * @name Create
 */
export const createStepState = selector<ITransformedStep | null>({
    key: `createStepState`,
    get: () => null,
    set: (
        { get, set }: SetProps,
        addDesc: ITransformedStep | DefaultValue | null,
    ): void => {
        if(!isDefault(addDesc)){
            const steps = get(listStepsState);
            steps.push(<ITransformedStep>addDesc);
            set(listStepsState, steps);
        }
    },
});
/**
 * @namespace CRUD
 * @name Update
 */
export const updateStepState = selectorFamily<ITransformedStep | null, string>({
    key: `updateStepState`,
    get: () => () => null,
    set: (descId:string) => (
        { get, set }: SetProps,
        updatedStep: ITransformedStep | DefaultValue | null,
    ): void => {
        if(updatedStep && !isDefault(updatedStep)){
            console.log(`updateStepState`, {
                updatedStep
            });
            set(findStepById(descId), updatedStep);
        }
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
        descId: string | DefaultValue | null,
    ): void => {
        if(!isDefault(descId)){
            const steps = get(listStepsState);
            const updatedSteps = steps.filter(
                desc => desc._uuid !== descId
            );
            set(listStepsState, updatedSteps);
        }
    },
});
