import { atom, atomFamily, selector, GetRecoilValue } from 'recoil';
import axios from 'axios';
import {
    IPlaybookJson,
    IPlaybookCategory,
    IPlaybookScene,
    IPlaybookStep,
    
} from '../../models';

type GetProps = { get: GetRecoilValue };

export const playbookAuthourState = atom<string>({
    key: 'playbookAuthourState',
    default: `masterclass`
});
export const playbookNameState = atom<string>({
    key: 'playbookNameState',
    default: `css-grid-playbook`
});
export const playbookVersionState = atom<string>({
    key: 'playbookVersionState',
    default: `1.0.0`
});

/**
 * @namespace playbookJson
 */
export const playbookJsonState = selector<IPlaybookJson>({
    key: 'playbookJsonState',
    get: async ({ get }: GetProps):Promise<IPlaybookJson> => {
        const playbookAuthour = get(playbookAuthourState);
        const playbookName = get(playbookNameState);
        const playbookVersion = get(playbookVersionState);
        try{
            const response = await axios.get<IPlaybookJson>(`https://610b8f8a2b6add0017cb392b.mockapi.io/playbookjson`);
            return response.data;
        }
        catch(err){
            if(err.response){
                throw err.response;
            }
            throw err;
        }
    }
});

/**
 * @namespace Categories
 */
export const playbookCategoriesState = selector<IPlaybookCategory[]>({
    key: 'playbookCategoriesState',
    get: ({ get }: GetProps): IPlaybookCategory[] => {
        const playbookJson:IPlaybookJson = get(playbookJsonState);
        return playbookJson.categories || [];
    },
});

export const currentPlaybookCategoryIdState = atom<string>({
    key: 'currentPlaybookCategoryIdState',
    default: `cat00-css-grid`,
});
/*
export const playbookCategoryIdsState = selector<string[]>({
    key: 'playbookCategoryIds',
    get: ({get}: GetProps): string[] => {
        const playbookCategories:IPlaybookCategory[] = get(playbookCategoriesState);
        return playbookCategories.map(cat => cat.id);
    }
});
*/
export const currentPlaybookCategoryState = selector<IPlaybookCategory|null>({
    key: 'currentPlaybookCategoryState',
    get: ({get}: GetProps): IPlaybookCategory|null => {
        const currentPlaybookCategoryId:string = get(currentPlaybookCategoryIdState);
        const playbookCategories:IPlaybookCategory[] = get(playbookCategoriesState);
        return playbookCategories.find(cat => cat.id === currentPlaybookCategoryId) || null;
    }
});

/**
 * @namespace Scenes
 */
export const playbookScenesState = selector<IPlaybookScene[]>({
    key: 'playbookScenesState',
    get: ({get}: GetProps): IPlaybookScene[] => {
        const curentPlaybookCategory:IPlaybookCategory|null = get(currentPlaybookCategoryState);
        if(curentPlaybookCategory){
            return curentPlaybookCategory.scenes;
        }
        else{
            return [];
        }
    }
});
export const currentPlaybookSceneIdState = atom<string>({
    key: 'currentPlaybookSceneIdState',
    default: `scene00-define-a-grid-scene`,
});
export const currentPlaybookSceneState = selector<IPlaybookScene|null>({
    key: 'currentPlaybookSceneState',
    get: ({get}: GetProps): IPlaybookScene|null => {
        const currentPlaybookSceneId:string = get(currentPlaybookSceneIdState);
        const playbookScenes:IPlaybookScene[] = get(playbookScenesState);
        return playbookScenes.find(scene => scene.id === currentPlaybookSceneId) || null;
    }
});

/**
 * @namespace Steps
 */
export const playbookStepsState = selector<IPlaybookStep[]>({
    key: 'playbookStepsState',
    get: ({get}: GetProps): IPlaybookStep[] => {
        const curentPlaybookScene:IPlaybookScene|null = get(currentPlaybookSceneState);
        if(curentPlaybookScene){
            return curentPlaybookScene.steps;
        }
        else{
            return [];
        }
    }
});
export const currentPlaybookStepIdState = atom<string>({
    key: 'currentPlaybookStepIdState',
    default: `step00-define-a-grid`,
});
export const currentPlaybookStepState = selector<IPlaybookStep|null>({
    key: 'currentPlaybookStepState',
    get: ({get}: GetProps): IPlaybookStep|null => {
        const currentPlaybookStepId:string = get(currentPlaybookStepIdState);
        const playbookSteps:IPlaybookStep[] = get(playbookStepsState);
        return playbookSteps.find(step => step.id === currentPlaybookStepId) || null;
    }
});
