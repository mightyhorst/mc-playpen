import { atom, atomFamily, selector, GetRecoilValue } from 'recoil';
import axios from 'axios';

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

export const playbookJsonState = selector({
    key: 'playbookJsonState',
    get: async ({ get }: GetProps) => {
        const playbookAuthour = get(playbookAuthourState);
        const playbookName = get(playbookNameState);
        const playbookVersion = get(playbookVersionState);
        try{
            const response = await axios.get(`https://610b8f8a2b6add0017cb392b.mockapi.io/playbookjson`);
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


export const playbookSteps = selector<any>({
    key: 'playbookSteps',
    get: ({ get }: GetProps): any => {
        const playbookJson = get(playbookJsonState);
    },
});

