import {
    useState,
    useEffect,
} from 'react';

/**
 * @requires Models
 */
import {
    IMaster,
    IPartial,
} from '../models';

interface UsePrinterProps{
    master: IMaster;
    partials: IPartial[];
}

export function usePrinter({
    master,
    partials,
}:UsePrinterProps): {
    compiled: string;
}{
    let compiled = ``;

    /**
     * @constant {RegExp} regex - handlebars finder
     */
    const regex: RegExp = /(\{\{[\s]*.*?[\s]*\}\})/g;

    /**
     * @constant {string[]} allPartials - find every partial in the compiled content
     */
    const masterContents = master.compiledContent;
    const allPartials = masterContents.match(regex);

    /**
     * @constant {string} masterContentsSplit - split the master template into master text and partial ids 
     */
    interface IMasterContents{
        isPartial:boolean;
        text: string;
        startRow?: number;
        endRow?: number;
        startCol?: number;
        endCol?: number;
    }
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
    
    let lastModel:IMasterContents;
    masterContentsSplit = 
        masterContentsSplit
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
    
    /**
     * @constant {string} xxx - xxx 
     */

    /**
     * @step 
     */

    /**
     * @step 
     */

    /**
     * @step 
     */

    /**
     * @step 
     */

    return {
        compiled,
    };
}
export default usePrinter;
