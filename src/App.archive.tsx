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
  MonacoEditor,
} from './components';


const numbers = [...Array(5000000)].map(e => ~~(Math.random() * 1000000));
const sortNumbers = (nums:number[]) => nums.sort();

export default function App({children}: {children?: ReactNode}) {

  const [
    sortWorker,
    { 
      status: sortStatus, 
      kill: killSortWorker, 
    }
  ] = useWorker(sortNumbers);

  const [result, setResult] = useState<number[]>([]);

  const runSort = async () => {
    const result = await sortWorker(numbers); // non-blocking UI
    setResult(result);
  };

  return (
    <RecoilRoot>
      <pre>
        {JSON.stringify(result.slice(0, 100), null, 4)}
      </pre>
      <button type="button" onClick={runSort}>
        Run Sort: {sortStatus}
      </button>
      <div className="App">
        <TodoList />
        <MonacoEditor />
      </div>
    </RecoilRoot>
  );
}
