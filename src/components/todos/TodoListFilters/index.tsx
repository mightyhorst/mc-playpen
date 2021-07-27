import {
    useRecoilState,
} from 'recoil';

import {
    todoListFilterState,
} from '../../../recoil';

export function TodoListFilters() {
    const [filter, setFilter] = useRecoilState(todoListFilterState);
  
    const updateFilter = ({target: {value}}: {target: {value: string}}) => {
      setFilter(value);
    };
  
    return (
      <section>
        <label>
            Filter:
        </label>
        <select value={filter} onChange={updateFilter}>
          <option value="Show All">
              All
            </option>
          <option value="Show Completed">
              Completed
        </option>
          <option value="Show Uncompleted">
              Uncompleted
            </option>
        </select>
      </section>
    );
  }