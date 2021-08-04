import {
    atom, 
    atomFamily,
    GetRecoilValue,
} from 'recoil';
import {
    IRecordHistory,
} from '../../models';

// export const recordingHistory = atomFamily<IRecordHistory[], string>({
export const recordingHistory = atomFamily<IRecordHistory[],string>({
    key: 'recordingHistory',
    // default: [],
    // default: (stepId:string) => async ({get}:{get:GetRecoilValue}) => {
    default: (stepId:string) => {
        return <IRecordHistory[]>[
            <IRecordHistory>{
                fileId: 'fileId',
                timestamp: (new Date()).getTime(),
                startLineNumber: 1,
                endLineNumber: 1,
                startColumn: 1,
                endColumn: 1,
                textChanged: 'textChanged',
            }
        ];
    }

});
