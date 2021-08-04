import {
    memo,
    useMemo,
    useState,
} from 'react';
import {
    useRecordingTimer,
    useRecording,
} from '../../hooks';

export function RecordingTimer(){
    const [msg, setMsg] = useState('');

    /**
     * @hooks
     */
    const {
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
    } = useRecordingTimer({
        callback: ()=> setMsg('stopped...'),
    });
    const {
        recordingStartTimestamp,
        setRecordingStartTimestamp,
        recordingHistory,
        setRecordingHistory,
    } = useRecording();

    const btnStop = useMemo(()=>{
        return (
            <button onClick={onStopClick}>
                STOP
            </button>
        );
    }, [onStopClick]);

    return (
        <div>
            <h4> Recording </h4>
            <div>Recording duration: {duration}</div>
            <div>Recording currentTime: {currentTime}</div>
            <br />
            <button onClick={onPlayPauseClick} >
                {isActive() ? 'PAUSE' : 'START'}
            </button>
            {isActive() && btnStop}
            <p>{isActive() ? 'playing...' : isFinished ? 'finished' : 'paused'}</p>
            <p>{msg}</p>
            <pre>
                {JSON.stringify(recordingHistory, null, 4)}
            </pre>
        </div>
    );
};

export default memo(RecordingTimer);
