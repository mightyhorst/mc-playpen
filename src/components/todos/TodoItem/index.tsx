/**
 * @requires RecoilJs
 */
import {
    useRecoilState,
} from 'recoil';
import {
    todoListState,
} from '../../../recoil';

/**
 * @requires Services
 */
import {
    replaceItemAtIndex,
    removeItemAtIndex,
} from './services';

/**
 * @requires Models
 */
import {
    ITodo,
} from '../models';

/**
 * @interface TodoItemProps
 */
interface TodoItemProps{
    item: ITodo;
}

/**
 * @component TodoItem
 * @param {TodoItemProps} {item: ITodo} - todo item props
 */
export function TodoItem({item}: TodoItemProps) {
    const [todoList, setTodoList] = useRecoilState<ITodo[]>(todoListState);
    const index = todoList.findIndex((listItem) => listItem === item);
    
    /**
     * @function editItemText
     * @param {target: {value: string}} - event target value
     */
    const editItemText = ({target: {value}}: {target: {value: string}}) => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item,
        text: value,
      });
  
      setTodoList(newList);
    };
    
    /**
     * @function toggleItemCompletion
     */
    const toggleItemCompletion = () => {
      const newList = replaceItemAtIndex<ITodo>(todoList, index, {
        ...item,
        isComplete: !item.isComplete,
      });
  
      setTodoList(newList);
    };
  
    /**
     * @function deleteItem
     */
    const deleteItem = () => {
      const newList = removeItemAtIndex<ITodo>(todoList, index);
  
      setTodoList(newList);
    };
  
    return (
      <div>
        <input type="text" value={item.text} onChange={editItemText} />
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={toggleItemCompletion}
        />
        <button onClick={deleteItem}>X</button>
      </div>
    );
  }
  
  