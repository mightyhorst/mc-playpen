import {
    IContents,
} from '../../../models';
import {
    // IMasterContents
} from '../models';
import {
    getRanges,
    splitMasterContents,
} from '.';

/**
 * @function splitMasterContentsWithRanges
 * @param {string} masterContents - compiled master contents
 * @returns {IContents} masterContentsSplit - Array<{isPartial:boolean, text:string}>
 */
export function splitMasterContentsWithRanges(
    masterContents: string
): IContents[] {
    let txtMasterSplit: IContents[] = splitMasterContents(masterContents);
    const txtMasterWithStats: IContents[] = [];

    txtMasterSplit
        .map((model: IContents, index: number) => {
            const { 
                isPartial,
                text,
            } = model;

            // const textRows = text.split('\n');
            // const lastTextRow = textRows[textRows.length - 1];
            // const startRow: number = 1;
            // const endRow: number = textRows.length;
            // const startCol: number = 1;
            // const endCol: number = lastTextRow.length;

            // /**
            //  * @return {IContents} model
            //  */
            // const masterContents: IContents = {
            //     isPartial,
            //     text,
            //     startRow,
            //     endRow,
            //     startCol,
            //     endCol,
            // };
            const masterContents: IContents = getRanges(isPartial, text);

            if (index === 0) {
                txtMasterWithStats.push(masterContents);
            }
            return masterContents;
        })
        .reduce(
            (
                lastModel: IContents,
                model: IContents,
                index: number
            ) => {
                console.log({
                    index,
                    lastModel,
                    model
                });
                const { 
                    //isPartial,
                    text,
                } = model;

                const lastRow = (lastModel.abs ? lastModel.abs.endRow : lastModel.endRow) || 0;
                const lastCol = (lastModel.abs ? lastModel.abs.endCol : lastModel.endCol) || 0;
                // const lastCol = lastModel.endCol || 0;

                const textRows = text.split('\n');
                const lastTextRow = textRows[textRows.length - 1];
                const startRow: number = lastRow + 1;
                const endRow: number = lastRow + textRows.length;
                const startCol: number = lastCol + 1;
                const endCol: number = lastCol + lastTextRow.length;

                /**
                 * @return {IMasterContents} model
                 */
                const masterContents: IContents = {
                    ...model,
                    abs: {
                        startRow,
                        endRow,
                        startCol,
                        endCol,
                    }
                };
                txtMasterWithStats.push(masterContents);
                return masterContents;
            }
        );
    console.log({ txtMasterWithStats });
    return txtMasterWithStats;
}
