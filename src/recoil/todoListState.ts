import {
    atom,
} from 'recoil';
import { ITodo } from '../components/models';

export const todoListState = atom<ITodo[]>({
    key: 'todoListState',
    default: [],
});
