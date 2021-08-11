import { 
    SetRecoilState, 
    GetRecoilValue,
    ResetRecoilState,
} from 'recoil';

export type SetProps = { 
    set: SetRecoilState; 
    get: GetRecoilValue; 
    reset: ResetRecoilState; 
}
