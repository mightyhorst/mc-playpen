export interface IFile{
    name: string;
    language: string;
    value: string;
}
export interface IFiles{
    [key:string]: IFile;
}
