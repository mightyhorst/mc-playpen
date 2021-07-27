import {ReactNode, useEffect, useState} from 'react';
import "./styles.css";

/**
 * @requires WebWorkers
 */
import { 
  useWorker,
  WORKER_STATUS, 
} from "@koale/useworker";

/**
 * 
 */
import {
  RecoilRoot,
} from 'recoil';

/**
 * @requires Components
 */
import {
  TodoList,
} from './components';


const numbers = [...Array(5000000)].map(e => ~~(Math.random() * 1000000));
const sortNumbers = (nums:number[]) => nums.sort();

export default function App({children}: {children?: ReactNode}) {

  const [
    sortWorker,
  ] = useWorker(sortNumbers);

  const [result, setResult] = useState<number[]>([]);

  const runSort = async () => {
    const result = await sortWorker(numbers); // non-blocking UI
    setResult(result);
  };

  return (
    <RecoilRoot>
      <pre>
        {JSON.stringify(WORKER_STATUS, null, 4)}
        {JSON.stringify(result, null, 4)}
      </pre>
      <button type="button" onClick={runSort}>
        Run Sort
      </button>
      <div className="App">
        <TodoList />
      </div>
    </RecoilRoot>
  );
}
