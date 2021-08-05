import {
    atom,
} from 'recoil';

export const isTimerPlayingState = atom<boolean>({
    key: 'isTimePlayingState',
    default: false,
});
