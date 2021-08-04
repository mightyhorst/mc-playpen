import {
    selector,
    RecoilValueReadOnly,
    GetRecoilValue,
} from 'recoil';

import {
    todoListFilterState,
    todoListState,
} from '.'
import { ITodo } from '../../components/todos/models';

export const filteredTodoListState: RecoilValueReadOnly<ITodo[]> = selector({
    key: 'filteredTodoListState',
    get: ({get}: {get: GetRecoilValue}) => {
      const filter: string = get(todoListFilterState);
      const list: ITodo[] = get(todoListState);
  
      switch (filter) {
        case 'Show Completed':
          return list.filter((item) => item.isComplete);
        case 'Show Uncompleted':
          return list.filter((item) => !item.isComplete);
        default:
          return list;
      }
    },
  });