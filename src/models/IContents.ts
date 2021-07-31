export interface IContents {
    isPartial: boolean;
    text: string;
    startRow?: number;
    endRow?: number;
    startCol?: number;
    endCol?: number;
    abs?: {
        startRow?: number;
        endRow?: number;
        startCol?: number;
        endCol?: number;
    };
}
