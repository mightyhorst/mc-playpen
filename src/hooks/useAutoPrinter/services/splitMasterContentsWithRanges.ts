import {
    IMasterContents
} from '../models';
import {
    splitMasterContents,
} from '.';

/**
 * @function splitMasterContentsWithRanges
 * @param {string} masterContents - compiled master contents
 * @returns {IMasterContents} masterContentsSplit - Array<{isPartial:boolean, text:string}>
 */
export function splitMasterContentsWithRanges(
    masterContents: string
): IMasterContents[] {
    let txtMasterSplit: IMasterContents[] = splitMasterContents(masterContents);
    const txtMasterWithStats: IMasterContents[] = [];

    txtMasterSplit
        .map((model: IMasterContents, index: number) => {
            const { isPartial, text } = model;

            const textRows = text.split('\n');
            const lastTextRow = textRows[textRows.length - 1];
            const startRow: number = 1;
            const endRow: number = textRows.length;
            const startCol: number = 1;
            const endCol: number = lastTextRow.length;

            /**
             * @return {IMasterContents} model
             */
            const masterContents: IMasterContents = {
                isPartial,
                text,
                startRow,
                endRow,
                startCol,
                endCol
            };
            if (index === 0) {
                txtMasterWithStats.push(masterContents);
            }
            return masterContents;
        })
        .reduce(
            (
                lastModel: IMasterContents,
                model: IMasterContents,
                index: number
            ) => {
                console.log({
                    index,
                    lastModel,
                    model
                });
                const { isPartial, text } = model;

                const lastRow = lastModel.endRow || 0;
                const lastCol = lastModel.endCol || 0;

                const textRows = text.split('\n');
                const lastTextRow = textRows[textRows.length - 1];
                const startRow: number = lastRow + 1;
                const endRow: number = lastRow + textRows.length;
                const startCol: number = lastCol + 1;
                const endCol: number = lastCol + lastTextRow.length;

                /**
                 * @return {IMasterContents} model
                 */
                const masterContents: IMasterContents = {
                    isPartial,
                    text,
                    startRow,
                    endRow,
                    startCol,
                    endCol
                };
                txtMasterWithStats.push(masterContents);
                return masterContents;
            }
        );
    console.log({ txtMasterWithStats });
    return txtMasterWithStats;
}
