import {IMasterContents} from './models';
import {hbsRegex} from './hbsRegex';

/**
 * @function splitMasterContents
 * @param {string} masterContents - compiled master contents
 * @returns {IMasterContents} masterContentsSplit - Array<{isPartial:boolean, text:string}>
 */
export function splitMasterContents(masterContents: string): IMasterContents[] {
    let masterContentsSplit: IMasterContents[] = masterContents
        .split(hbsRegex)
        .map((text, index) => {
            const isPartial = text.search(hbsRegex) >= 0;
            return {
                isPartial,
                text
            };
        });
    return masterContentsSplit;
}
