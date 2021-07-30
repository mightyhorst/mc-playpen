interface IMasterContents{
    isPartial:boolean;
    text: string;
    startRow?: number;
    endRow?: number;
    startCol?: number;
    endCol?: number;
}

/**
 * @constant {RegExp} regex - handlebars finder
 */
const regex: RegExp = /(\{\{[\s]*.*?[\s]*\}\})/g;

/**
 * @function splitMasterContents
 * @param {string} masterContents - compiled master contents
 * @returns {IMasterContents} masterContentsSplit - {isPartial:boolean, text:string}
 */
export function splitMasterContents(
    masterContents: string
):IMasterContents[]{
    let masterContentsSplit:IMasterContents[] = 
        masterContents
            .split(regex)
            .map((text, index) => {
                const isPartial = text.search(regex) >= 0;
                return {
                    isPartial,
                    text,
                };
            });
    return masterContentsSplit;
}
export function splitMasterContentsWithRowsAndCols(
    masterContents: string
):IMasterContents[]{
    let masterContentsSplit:IMasterContents[] = splitMasterContents(
        masterContents,
    );

    let lastModel:IMasterContents;
    masterContentsSplit = masterContentsSplit
        .map(({isPartial, text}, index) => {
            let lastRow:number = 0;
            let lastCol:number = 0;
            if(index > 0){
                lastModel = masterContentsSplit[index - 1];
                lastRow = lastModel.endRow || 0;
                lastCol = lastModel.endCol || 0;
            }
            
            const textRows = text.split('\n');
            const lastTextRow = textRows[textRows.length-1];
            const startRow:number = lastRow;
            const endRow:number = lastRow + textRows.length;
            const startCol:number = lastCol;
            const endCol:number = lastCol  + lastTextRow.length;
            return {
                isPartial,
                text,
                startRow,
                endRow,
                startCol,
                endCol,
            };
        });
    console.log(masterContentsSplit);
    return masterContentsSplit;
}