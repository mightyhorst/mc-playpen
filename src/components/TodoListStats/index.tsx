import {
    selector,
    RecoilValueReadOnly,
} from 'recoil';
import {
    todoListState,
} from '../../recoil';

interface ITodoListStatsState{
    totalNum: number;
    totalCompletedNum: number;
    totalUncompletedNum: number;
    percentCompleted: number;
}

/**
 * @constant todoListStatsState
 */
export const todoListStatsState: RecoilValueReadOnly<ITodoListStatsState> = selector({
    key: 'todoListStatsState',
    get: ({get}) => {
      const todoList = get(todoListState);
      const totalNum = todoList.length;
      const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
      const totalUncompletedNum = totalNum - totalCompletedNum;
      const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum * 100;
        
      const todoListStats: ITodoListStatsState = {
        totalNum,
        totalCompletedNum,
        totalUncompletedNum,
        percentCompleted,
      };

      return todoListStats;
    },
});
