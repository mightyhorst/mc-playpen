import {
    atom,
} from 'recoil';

export const durationTimeState = atom<number>({
    key: 'durationTimeState',
    default: 0,
});
