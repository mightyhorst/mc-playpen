import {
    atom,
} from 'recoil';

export const currentTimeState = atom<number>({
    key: 'currentTimeState',
    default: 0,
});
