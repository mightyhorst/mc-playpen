export interface IMaster<T = any>{
    fileName: string;
    filePath: string;
    contents: string;
    compiledContent: string;
    data?: T;
}
