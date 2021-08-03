import { ReactNode, createContext, useState, useContext } from 'react';
import { IRecordHistory } from '../../models';
export const RecordingStartTimeContext = createContext<
    [number, (startTime: number) => void]
>([0, () => {}]);
export const RecordingHistoryContext = createContext<
    [IRecordHistory[], (recordingHistory: IRecordHistory[]) => void]
>([[], () => {}]);

export function RecordingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [recordingStartTimestamp, setRecordingStartTimestamp] = useState<
        number
    >(0);
    const [recordingHistory, setRecordingHistory] = useState<IRecordHistory[]>(
        []
    );
    return (
        <RecordingStartTimeContext.Provider
            value={[recordingStartTimestamp, setRecordingStartTimestamp]}
        >
            <RecordingHistoryContext.Provider
                value={[recordingHistory, setRecordingHistory]}
            >
                {children}                    
            </RecordingHistoryContext.Provider>
        </RecordingStartTimeContext.Provider>
    );
}

export function useRecording(): {
    recordingStartTimestamp: number;
    setRecordingStartTimestamp: (startTime: number) => void;
    recordingHistory: IRecordHistory[];
    setRecordingHistory: (recordingHistory: IRecordHistory[]) => void;
} {
    const [recordingStartTimestamp, setRecordingStartTimestamp] = useContext(
        RecordingStartTimeContext
    );
    const [recordingHistory, setRecordingHistory] = useContext(
        RecordingHistoryContext
    );

    return {
        recordingStartTimestamp,
        setRecordingStartTimestamp,
        recordingHistory,
        setRecordingHistory
    };
}
