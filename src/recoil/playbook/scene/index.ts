/**
 * @requires recoil
 */
import { 
    atom,
    selector,
    atomFamily,
    selectorFamily,
} from 'recoil';
import {
    GetProps,
    transformedPlaybookState,
} from '../../../recoil';

/**
 * @requires Models
 */
import {
    IPlaybookScene,
} from '../../../models';

/**
 * @namespace Scenes
 */
export const scenesState = selector<IPlaybookScene[]>({
    key: 'scenesState',
    get: ({ get }: GetProps): IPlaybookScene[] => {
        const { scenes } = get(transformedPlaybookState);
        return scenes;
    }
});
export const getSceneById = atomFamily<IPlaybookScene | null, string>({
    key: 'getSceneById',
    default: selectorFamily<IPlaybookScene | null, string>({
        key: 'getSceneById/default',
        get: (sceneId: string) => ({
            get
        }: GetProps): IPlaybookScene | null => {
            const { scenes } = get(transformedPlaybookState);
            return scenes.find((scene) => scene.id === sceneId) || null;
        }
    })
});
export const currentSceneIdState = atom<string>({
    key: 'currentSceneIdState',
    default: `scene00-define-a-grid-scene`
});
export const currentSceneState = selector<IPlaybookScene | null>({
    key: 'currentSceneState',
    get: ({ get }: GetProps): IPlaybookScene | null => {
        const currentSceneId: string = get(currentSceneIdState);
        return get(getSceneById(currentSceneId));
    }
});
