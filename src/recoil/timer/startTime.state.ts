import {
    atom,
} from 'recoil';

export const startTimeState = atom<number>({
    key: 'startTimeState',
    default: 0,
});
