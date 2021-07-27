/**
 * @requires RecoilJs
 */
import {
    useRecoilValue,
} from 'recoil';
import {
    todoListState,
    filteredTodoListState,
} from '../../../recoil';

/**
 * @requires Components
 */
import {
    TodoItemCreator,
    TodoItem,
    TodoListStats,
    TodoListFilters,
} from '../';

/**
 * 
 */
export function TodoList() {
    // const todoList = useRecoilValue(todoListState);
    const todoList = useRecoilValue(filteredTodoListState);
  
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