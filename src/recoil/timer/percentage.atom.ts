import {
    selector,
    GetRecoilValue,
} from 'recoil';
import {
    currentTimeState,
    durationTimeState,
} from '.';

export const percentageState = selector({
    key: 'percentageState',
    get: ({get}:{get: GetRecoilValue}) => {
        const currentTime = get(currentTimeState);
        const duration = get(durationTimeState);
        return currentTime/duration;
    },
});
