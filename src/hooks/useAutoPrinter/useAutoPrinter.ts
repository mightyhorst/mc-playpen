/**
 * @requires Hooks
 */
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
} from '../../models';
import {
    IMasterContents,
} from './models';

/**
 * @requires Services
 */
import{
    hbsRegex,
    // allPartials,
    splitMasterContents,
    splitMasterContentsWithRanges,
} from './services';

interface UsePrinterProps{
    master: IMaster;
    partials: IPartial[];
}

export function useAutoPrinter({
    master,
    partials,
}:UsePrinterProps): {
    compiled: string;
}{
    let compiled = ``;

    /**
     * @constant {string[]} allPartials - find every partial in the compiled content
     */
    const masterContents = master.compiledContent;
    const allPartials = masterContents.match(hbsRegex);

    /**
     * @constant {string} masterContentsSplit - split the master template into master text and partial ids 
     */
    let masterContentsSplit:IMasterContents[] = 
        splitMasterContentsWithRanges(masterContents);
    
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
export default useAutoPrinter;
