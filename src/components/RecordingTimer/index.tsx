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
        isRecording,
        toggleRecording,
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

    const recordingCss = {
        padding: `2px 10px`,
        border: `1px solid ${!isRecording ? `rgb(255, 255, 254)`: `rgba(250, 0, 0, .9)`}`,
        borderRadius: `2px`,
        backgroundColor: (!isRecording ? `rgb(239, 239, 239)`: `rgba(250, 0, 0, 0.8)`),
        color: (!isRecording ? `#4c4c4c`: `white`),
        width: `140px`,
        marginRight: `4px`,
    }
    
    return (
        <div>
            <h4> {'Recording'} </h4>
            <div>Recording duration: {duration}</div>
            <div>Recording currentTime: {currentTime}</div>
            <br />
            <button style={recordingCss} onClick={toggleRecording}>
                {isRecording ? '🔴 Stop Recording': '⏺ Start Recording'}
            </button>
            <button onClick={onPlayPauseClick} >
                {isActive() ? '⏸ PAUSE' : '▶️ START'}
            </button>
            {isActive() && btnStop}
            <p>{isActive() ? '▶️ playing...' : isFinished ? '🔄 finished' : '⏸ paused'}</p>
            {/* <p>{msg}</p> */}
            {/* 
            <pre>
                {isActive() ?
                    recordingHistory
                    .filter(record => {
                        return record.timestamp <= currentTime;
                    })
                    .map(record => {
                        let text = record.textChanged;
                        return text;
                    }).join(''):
                    JSON.stringify(recordingHistory, null, 4)
                }
            </pre> 
            */}
        </div>
    );
};

export default memo(RecordingTimer);
