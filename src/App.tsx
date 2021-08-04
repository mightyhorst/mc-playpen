import {
  ReactNode,
  useState,
} from 'react';
import './styles.css';

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
 * @requires Hooks
 */
import {
  TimerProvider,
  RecordingProvider,
  RecordingTimerProvider,
} from './hooks';

 /**
 * @requires Components
 */
import {
  // TodoList,
  MonacoEditor,
  PlaybarPanel,
  RecordingTimer,
} from './components';
import Timer from './Timer';


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
      <RecordingProvider>
        <RecordingTimerProvider>
          <TimerProvider
            initCurrentTime={0}
            initDuration={2000}
            >
            <Timer />
            <RecordingTimer />
          </TimerProvider>
        </RecordingTimerProvider>
      </RecordingProvider>
    </RecoilRoot>
  );
}
