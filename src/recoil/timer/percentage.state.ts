import {
    selector,
    GetRecoilValue,
} from 'recoil';
import {
    currentTimeState,
    durationTimeState,
} from '.';

export const percentageState = selector<number>({
    key: 'percentageState',
    get: ({get}:{get: GetRecoilValue}):number => {
        const currentTime = get(currentTimeState);
        const duration = get(durationTimeState);
        return currentTime/duration;
    },
});
