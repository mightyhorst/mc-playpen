import {
    atom,
} from 'recoil';
import { ITodo } from '../../components/todos/models';

export const todoListState = atom<ITodo[]>({
    key: 'todoListState',
    default: [],
});
