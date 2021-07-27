import { useState } from 'react';

/**
 * @requires Models
 */
import {
    ITodo,
} from '../models';

/**
 * @requires RecoilJs
 */
import { useSetRecoilState } from 'recoil';
import { todoListState } from '../../../recoil';

export function TodoItemCreator() {
    const [inputValue, setInputValue] = useState<string>('');
    const setTodoList = useSetRecoilState<ITodo[]>(todoListState);

    /**
     * @function addItem
     */
    const addItem = () => {
        if(inputValue.trim() === '') return;
        const newTodo:ITodo = {
            id: Math.floor(Math.random() * 1000000000),
            text: inputValue,
            isComplete: false
        };
        setTodoList((oldTodoList: ITodo[]) => [
            ...oldTodoList,
            newTodo,
        ]);
        setInputValue('');
    };

    /**
     * @event onChange
     * @param {Event} event - event target value
     */
    const onChange = ({ target: { value } }: {target: {value: string} }) => {
        setInputValue(value);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={onChange} />
            <button onClick={addItem}>Add</button>
        </div>
    );
}
