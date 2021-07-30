import { IMaster } from './IMaster';

export interface IPartial<T = any> extends IMaster<T>{
    partialId: string;
}