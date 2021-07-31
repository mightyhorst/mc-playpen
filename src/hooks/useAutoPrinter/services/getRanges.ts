import {
    IContents,
} from '../../../models';

export function getRanges(
    isPartial: boolean,
    text: string,
): IContents{
    const textRows = text.split('\n');
    const lastTextRow = textRows[textRows.length - 1];
    const startRow: number = 1;
    const endRow: number = textRows.length;
    const startCol: number = 1;
    const endCol: number = lastTextRow.length;

    /**
     * @return {IContents} model
     */
    const masterContents: IContents = {
        isPartial,
        text,
        startRow,
        endRow,
        startCol,
        endCol,
    };
    return masterContents;
}