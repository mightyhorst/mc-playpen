import {
    atom,
    RecoilState,
} from 'recoil';

export const todoListFilterState:RecoilState<string> = atom({
    key: 'todoListFilterState',
    default: 'Show All',
});
