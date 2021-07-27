/**
 * @requires RecoilJs
 */
import {
    useRecoilValue,
} from 'recoil';
import {
    todoListState,
} from '../../recoil';

/**
 * @requires Components
 */
import {
    TodoItemCreator,
    TodoItem,
    TodoListStats,
    TodoListFilters,
} from '../../components';

/**
 * 
 */
export function TodoList() {
    const todoList = useRecoilValue(todoListState);
  
    return (
      <>
        <TodoListStats />
        <TodoListFilters />
        <TodoItemCreator />
  
        {todoList.map((todoItem) => (
          <TodoItem key={todoItem.id} item={todoItem} />
        ))}
      </>
    );
}