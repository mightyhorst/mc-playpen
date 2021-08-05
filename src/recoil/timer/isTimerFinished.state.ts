import {
    selector,
    GetRecoilValue,
} from 'recoil';
import {
    currentTimeState,
    durationTimeState,
} from '.';

export const isTimerFinishedState = selector<boolean>({
    key: 'isTimerFinishedState',
    get: ({get}:{get: GetRecoilValue}):boolean => {
        const currentTime = get(currentTimeState);
        const duration = get(durationTimeState);
        return currentTime >= duration;
    },
});
