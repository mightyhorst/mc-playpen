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

/**
 * @namespace Recording
 */
const IsRecordingContext = createContext<[boolean, () => void]>([false, () => {}]);
const RecordingStartTimeContext = createContext<[number, (startTime: number) => void]>([0, () => {}]);
const RecordingHistoryContext = createContext<[IRecordHistory[], (recordingHistory: IRecordHistory[]) => void]>([[], () => {}]);

/**
 * @namespace Timer
 * @todo dedepulicate with useTimer
 */
const StartTimeContext = createContext<[number, (startTime: number) => void]>([0, () => {}]);
const CurrentTimeContext = createContext<[number, (currentTime: number) => void]>([0, () => {}]);
const DurationContext = createContext<[number, (duration: number) => void]>([0, () => {}]);
const PercentageContext = createContext<number>(0);
const IsFinishedContext = createContext<boolean>(false);

export function RecordingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingStartTimestamp, setRecordingStartTimestamp] = useState<number>(0);
    const [recordingHistory, setRecordingHistory] = useState<IRecordHistory[]>([]);
    
    const toggleRecording = useCallback(()=>{
        setIsRecording(!isRecording);
    }, [isRecording]);

    return (
        <IsRecordingContext.Provider value={[isRecording, toggleRecording]}>
            <RecordingStartTimeContext.Provider value={[recordingStartTimestamp, setRecordingStartTimestamp]}>
                <RecordingHistoryContext.Provider value={[recordingHistory, setRecordingHistory]}>
                    {children}                    
                </RecordingHistoryContext.Provider>
            </RecordingStartTimeContext.Provider>
        </IsRecordingContext.Provider>
    );
}

export function useRecording(): {
    isRecording: boolean;
    toggleRecording: () => void;
    recordingStartTimestamp: number;
    setRecordingStartTimestamp: (startTime: number) => void;
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

    return {
        isRecording,
        toggleRecording,
        recordingStartTimestamp,
        setRecordingStartTimestamp,
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
    const percentage:number = currentTime / duration || 0;
    const isFinished:boolean = currentTime >= duration;

    return (
        <StartTimeContext.Provider value={[startTime, setStartTime]}>
            <CurrentTimeContext.Provider value={[currentTime, setCurrentTime]}>
                <DurationContext.Provider value={[duration, setDuration]}>
                    <PercentageContext.Provider value={percentage}>
                        <IsFinishedContext.Provider value={isFinished}>
                            {children}
                        </IsFinishedContext.Provider>
                    </PercentageContext.Provider>
                </DurationContext.Provider>
            </CurrentTimeContext.Provider>
        </StartTimeContext.Provider>
    );
}

export function useRecordingTimer(props? :{
    callback?: ()=>void;
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
} {
    const [startTime, setStartTime] = useContext(StartTimeContext);
    const [currentTime, setCurrentTime] = useContext(CurrentTimeContext);
    const [duration, setDuration] = useContext(DurationContext);
    const percentage = useContext(PercentageContext);
    const isFinished = useContext(IsFinishedContext);

    /**
     * @step loop every request animation frame (RAF)
     */
    const update = useUpdate();
    const [loopStop, loopStart, isActive] = useRafLoop((time: number) => {
        const now = Date.now();
        setCurrentTime(now - startTime);

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
        update();
    }, [
        isActive,
        loopStop,
        setStartTime,
        setCurrentTime,
        update,
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
            }
            else{
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
    };
}
