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

const StartTimeContext = createContext<
    [number, (startTime: number) => void]
>([0, () => {}]);
const CurrentTimeContext = createContext<
    [number, (currentTime: number) => void]
>([0, () => {}]);
const DurationContext = createContext<
    [number, (duration: number) => void]
>([0, () => {}]);
const PercentageContext = createContext<number>(0);
const IsFinishedContext = createContext<boolean>(false);

export function TimerProvider({
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

export function useTimer(props? :{
    callback?: ()=>void;
}): {
    startTime: number;
    setStartTime: (startTime: number) => void;
    currentTime: number;
    setCurrentTime: (currentTime: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
    percentage: number;
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

    /**
     * @step btn stop callback
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
        loopStop,
        loopStart,
        isActive,
        onStopClick,
        onPlayPauseClick,
    };
}
