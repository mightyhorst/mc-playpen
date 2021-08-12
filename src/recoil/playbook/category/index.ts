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
    IPlaybookCategory,
} from '../../../models';

/**
 * @namespace Categories
 */
export const categoriesState = atom<IPlaybookCategory[]>({
    key: 'categoriesState',
    default: selector<IPlaybookCategory[]>({
        key: 'categoriesState/default',
        get: ({ get }: GetProps): IPlaybookCategory[] => {
            const { cats } = get(transformedPlaybookState);
            return cats;
        }
    })
});
export const getCategoryById = atomFamily<IPlaybookCategory | null, string>({
    key: 'getCategoryById',
    default: selectorFamily<IPlaybookCategory | null, string>({
        key: 'getCategoryById/default',
        get: (catId: string) => ({
            get
        }: GetProps): IPlaybookCategory | null => {
            const { cats } = get(transformedPlaybookState);
            return cats.find((cat) => cat.id === catId) || null;
        }
    })
});
export const currentCatIdState = atom<string>({
    key: 'currentCatIdState',
    default: `cat00-css-grid`
});
export const currentCatState = selector<IPlaybookCategory | null>({
    key: 'currentCatState',
    get: ({ get }: GetProps): IPlaybookCategory | null => {
        const categoryId: string = get(currentCatIdState);
        return get(getCategoryById(categoryId));
    }
});
