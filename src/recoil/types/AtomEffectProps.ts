import { 
    DefaultValue, 
    RecoilState, 
} from 'recoil';

type SetSelfProps<T> = 
    T | 
    DefaultValue | 
    Promise<T | DefaultValue> | 
    ((param: T | DefaultValue) => T | DefaultValue);

// type OnSetProps<T> = (
//     param: (
//         newValue: T | DefaultValue, 
//         oldValue: T | DefaultValue,
//     ) => void
// )
type OnSetProps<T> = {
    newValue: T | DefaultValue, 
    oldValue: T | DefaultValue,
};

interface AtomEffectProps<T>{
    node: RecoilState<T>;
    trigger: 'set' | 'get';
    setSelf: (param: SetSelfProps<T>) => void;
    resetSelf: () => void;
    onSet: OnSetProps<T>;
};
export type AtomEffect<T> = 
    (param: AtomEffectProps<T>) => void | 
    (() => void);
