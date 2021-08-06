import { 
    ReactNode, 
    createContext, 
    useState, 
    useContext,
    useCallback,
} from 'react';
import { 
    useRafLoop, 
    useUpdate, 
} from '..';
import { IRecordHistory } from '../../models';
// import { Range as MonacoRange } from 'monaco-editor';

/**
 * @namespace Recording
 */
const IsRecordingContext = createContext<[boolean, () => void]>([false, () => {}]);
const RecordingStartTimeContext = createContext<[number, (startTime: number) => void]>([0, () => {}]);
const RecordingStartTextContext = createContext<[string, (startText: string) => void]>([0, () => {}]);
const RecordingHistoryContext = createContext<[IRecordHistory[], (recordingHistory: IRecordHistory[]) => void]>([[], () => {}]);
const RecordingToPrintContext = createContext<[IRecordHistory[], (toPrint: IRecordHistory[]) => void]>([[], () => {}]);
const RecordingNotPrintedContext = createContext<[IRecordHistory[], (notPrinted: IRecordHistory[]) => void]>([[], () => {}]);

/**
 * @namespace Timer
 * @todo dedepulicate with useTimer
 */
const StartTimeContext = createContext<[number, (startTime: number) => void]>([0, () => {}]);
const CurrentTimeContext = createContext<[number, (currentTime: number) => void]>([0, () => {}]);
const DurationContext = createContext<[number, (duration: number) => void]>([0, () => {}]);
const PercentageContext = createContext<number>(0);
const IsFinishedContext = createContext<boolean>(false);
const IsFirstPlayContext = createContext<[boolean, (isFirstPlay: boolean) => void]>([false, () => {}]);

export function RecordingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingStartTimestamp, setRecordingStartTimestamp] = useState<number>(0);
    const [recordingStartText, setRecordingStartText,] = useState<string>('');
    const [recordingHistory, setRecordingHistory] = useState<IRecordHistory[]>([]);
    const [recordingToPrint, setRecordingToPrint] = useState<IRecordHistory[]>([]);
    const [recordingNotPrinted, setRecordingNotPrinted] = useState<IRecordHistory[]>([]);
    
    const toggleRecording = useCallback(()=>{
        setIsRecording(!isRecording);
    }, [isRecording]);

    return (
        <IsRecordingContext.Provider value={[isRecording, toggleRecording]}>
            <RecordingStartTimeContext.Provider value={[recordingStartTimestamp, setRecordingStartTimestamp]}>
            <RecordingStartTextContext.Provider value={[recordingStartText, setRecordingStartText,]}>
                <RecordingHistoryContext.Provider value={[recordingHistory, setRecordingHistory]}>
                    <RecordingToPrintContext.Provider value={[recordingToPrint, setRecordingToPrint]}>
                        <RecordingNotPrintedContext.Provider value={[recordingNotPrinted, setRecordingNotPrinted]}>
                            {children}
                        </RecordingNotPrintedContext.Provider>
                    </RecordingToPrintContext.Provider>
                </RecordingHistoryContext.Provider>
            </RecordingStartTextContext.Provider>
            </RecordingStartTimeContext.Provider>
        </IsRecordingContext.Provider>
    );
}

export function useRecording(): {
    isRecording: boolean;
    toggleRecording: () => void;
    recordingStartTimestamp: number;
    setRecordingStartTimestamp: (startTime: number) => void;
    recordingStartText: string;
    setRecordingStartText: (startText: string) => void;
    recordingHistory: IRecordHistory[];
    setRecordingHistory: (recordingHistory: IRecordHistory[]) => void;
} {
    const [
        recordingStartTimestamp, 
        setRecordingStartTimestamp,
    ] = useContext(
        RecordingStartTimeContext,
    );
    const [
        recordingHistory, 
        setRecordingHistory,
    ] = useContext(
        RecordingHistoryContext,
    );
    const [
        isRecording,
        toggleRecording,
    ] = useContext(
        IsRecordingContext,
    );
    const [
        recordingStartText,
        setRecordingStartText,
    ] = useContext(
        RecordingStartTextContext,
    );

    return {
        isRecording,
        toggleRecording,
        recordingStartTimestamp,
        setRecordingStartTimestamp,
        recordingStartText,
        setRecordingStartText,
        recordingHistory,
        setRecordingHistory,
    };
}

export function RecordingTimerProvider({
    children,
    initCurrentTime = 0,
    initDuration = 0
}: {
    children: ReactNode;
    initCurrentTime?: number;
    initDuration?: number;
}) {
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [currentTime, setCurrentTime] = useState<number>(initCurrentTime);
    const [duration, setDuration] = useState<number>(initDuration);
    const [isFirstPlay, setIsFirstPlay] = useState<boolean>(false);
    const percentage:number = currentTime / duration || 0;
    const isFinished:boolean = currentTime >= duration;

    return (
        <StartTimeContext.Provider value={[startTime, setStartTime]}>
            <CurrentTimeContext.Provider value={[currentTime, setCurrentTime]}>
                <DurationContext.Provider value={[duration, setDuration]}>
                    <PercentageContext.Provider value={percentage}>
                        <IsFinishedContext.Provider value={isFinished}>
                            <IsFirstPlayContext.Provider value={[isFirstPlay, setIsFirstPlay]}>
                                {children}
                            </IsFirstPlayContext.Provider>
                        </IsFinishedContext.Provider>
                    </PercentageContext.Provider>
                </DurationContext.Provider>
            </CurrentTimeContext.Provider>
        </StartTimeContext.Provider>
    );
}

export function useRecordingTimer(props?:{
    callback?: ()=>void;
    callbackPrint?: (toPrint:IRecordHistory[])=>void;
}): {
    startTime: number;
    setStartTime: (startTime: number) => void;
    currentTime: number;
    setCurrentTime: (currentTime: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
    percentage: number;
    isPlaying: boolean;
    isFinished: boolean;
    loopStop: ()=>void;
    loopStart: ()=>void;
    isActive: ()=>boolean;
    onStopClick: ()=>void;
    onPlayPauseClick: ()=>void;
    /**
     * @namespace autoPrint
     */
    toPrint: IRecordHistory[];
    notPrinted: IRecordHistory[];
    setToPrint: (toPrint: IRecordHistory[]) => void;
    setNotPrinted: (notPrinted: IRecordHistory[]) => void;
    isFirstPlay: boolean;
} {
    const [startTime, setStartTime] = useContext(StartTimeContext);
    const [currentTime, setCurrentTime] = useContext(CurrentTimeContext);
    const [duration, setDuration] = useContext(DurationContext);
    const percentage = useContext(PercentageContext);
    const isFinished = useContext(IsFinishedContext);
    const [isFirstPlay, setIsFirstPlay] = useContext(IsFirstPlayContext);

    /**
     * @todo deduplicate
     */
    const [
        isRecording, 
        setIsRecording,
    ] = useContext(
        IsRecordingContext,
    );
    const [
        recordingHistory, 
        setRecordingHistory,
    ] = useContext(
        RecordingHistoryContext,
    );
    const [
        recordingStartText,
        setRecordingStartText,
    ] = useContext(
        RecordingStartTextContext,
    );
    const [
        notPrinted,
        setNotPrinted,
    ] = useContext(
        RecordingToPrintContext,
    );
    const [
        toPrint,
        setToPrint,
    ] = useContext(
        RecordingNotPrintedContext,
    );

    const update = useUpdate();

    /**
     * @function add print range
     */
    const addPrintRange = useCallback((_currentTime:number) => {
        /**
         * @fastest loop
         * @see https://stackoverflow.com/a/7252102/457156
         */
        const _toPrint = [...toPrint], _notPrinted = [];
        for(let i = 0; i < notPrinted.length; i++){
            const record = notPrinted[i];
            if(record.timestamp <= _currentTime){
                _toPrint.push(record);
            }
            else{
                _notPrinted.push(record);
            }
        }
        setNotPrinted(_notPrinted);
        setToPrint(_toPrint);
    },[
        notPrinted,
        setNotPrinted,
        toPrint,
        setToPrint,
    ]);
    
    /**
     * @step loop every request animation frame (RAF)
     */
    const [loopStop, loopStart, isActive,] = useRafLoop((time: number) => {
        const _currentTime = Date.now() - startTime;
        setCurrentTime(_currentTime);
        addPrintRange(_currentTime);
        setIsFirstPlay(false);

        if (currentTime >= duration) {
            loopStop();
            if(props?.callback) props.callback();
            update();
        }
    }, false);
    const isPlaying = isActive();

    /**
     * @event stop
     */
    const onStopClick = useCallback(()=>{
        if (isActive()) {
            loopStop();
        }
        else {
            setStartTime(Date.now());
        }
        setCurrentTime(0);
        // setNotPrinted(recordingHistory);
        update();
    }, [
        isActive,
        loopStop,
        setStartTime,
        setCurrentTime,
        update,
        // setNotPrinted,
        // recordingHistory,
    ]);

    /**
     * @event play/pause
     */
    const onPlayPauseClick = useCallback(()=>{
        if (isActive()) {
            loopStop();
        } 
        else {
            if(isFinished){
                setCurrentTime(0);
                setStartTime(Date.now());
                setIsFirstPlay(true);
                setNotPrinted(recordingHistory);
            }
            else{
                if(currentTime === 0){
                    console.log(`%c Start`, `background: black; color: white`, {currentTime});
                    console.log(`%c recordingStartText`, `background: black; color: white`, recordingStartText);
                    setNotPrinted(recordingHistory);
                    setIsFirstPlay(true);
                }
                // else{
                //     setIsFirstPlay(false);
                // }
                setStartTime(Date.now() - currentTime);
            }
            loopStart();
        }
        update();
    }, [
        isActive,
        isFinished,
        loopStart,
        loopStop,
        setStartTime,
        currentTime,
        setCurrentTime,
        update,
        recordingHistory,
        recordingStartText,
        setNotPrinted,
        setIsFirstPlay,
    ]);

    return {
        startTime, 
        setStartTime,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        percentage,
        isFinished,
        isPlaying,
        loopStop,
        loopStart,
        isActive,
        onStopClick,
        onPlayPauseClick,
        /**
         * @namespace autoPrint
         */
        toPrint,
        notPrinted,
        setNotPrinted,
        setToPrint,
        isFirstPlay,
    };
}
