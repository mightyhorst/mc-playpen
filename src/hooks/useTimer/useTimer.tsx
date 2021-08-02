import {
    ReactNode,
    createContext,
    useState,
    useContext,
} from 'react';
export const CurrentTimeContext = createContext<[number, (currentTime:number)=>void]>([0, ()=>{}]);
export const DurationContext = createContext<[number, (duration:number)=>void]>([0, ()=>{}]);
export const PercentageContext = createContext<number>(0);

export function TimerProvider({
    children,
    initCurrentTime = 0,
    initDuration = 0,
}: {
    children: ReactNode;
    initCurrentTime?: number,
    initDuration?: number,
}){
    const [currentTime, setCurrentTime] = useState<number>(initCurrentTime);
    const [duration, setDuration] = useState<number>(initDuration);
    const [percentage] = useState<number>(currentTime/duration || 0);
    return (
        <CurrentTimeContext.Provider value={[currentTime, setCurrentTime]}>
            <DurationContext.Provider value={[duration, setDuration]}>
                <PercentageContext.Provider value={percentage}>
                    {children}
                </PercentageContext.Provider>
            </DurationContext.Provider>
        </CurrentTimeContext.Provider>
    );
}

export function useTimer(
// {
//     initCurrentTime,
//     initDuration,
// }:{
//     initCurrentTime?: number,
//     initDuration?: number,
// }
):{
    currentTime: number;
    setCurrentTime: (currentTime: number) => void;
    duration: number;
    setDuration: (duration:number)=>void;
    percentage: number;
}{
    const [currentTime, setCurrentTime] = useContext(CurrentTimeContext);
    const [duration, setDuration] = useContext(DurationContext);
    const percentage = useContext(PercentageContext);

    // if(initCurrentTime) setCurrentTime(initCurrentTime);
    // if(initDuration) setDuration(initDuration);

    return {
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        percentage,
    }
}