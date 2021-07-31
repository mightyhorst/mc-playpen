import { 
    IPartial,
    IContents,
} from '../../../models';
// import {IMasterContents} from '../models';
import { 
    percentageOfPartialWithRanges, 
    splitMasterContents, 
} from '.';
import { getRanges } from './getRanges';

/**
 * @function masterAndPartialsWithRanges
 *
 * @description master and partials
 *
 * @param {string[]} masterContentsSplit - masterContents split by partials regex
 * @param {IPartial} partials - id and contents for partials
 * @param {number} percentage - from 0 to 1 for 0 % to 100%, how much of the string to print
 * @param {number} startPercentage - (optional) from 0 to 1 for 0 % to 100%
 */
export function masterAndPartialsWithRanges({
    masterContentsSplit,
    partials,
    percentage,
    startPercentage = 0,
}: {
    masterContentsSplit: IContents[];
    partials: IPartial[];
    percentage: number;
    startPercentage?: number;
}): IContents[] {
    const masterAndPartials = masterContentsSplit.map((masterPiece:IContents) => {
        /**
         * @step find partial
         */
        const matchedPartial = partials.find((partial:IPartial) => {
            return masterPiece.text.search(partial.partialId) >= 0;
        });

        /**
         * @step replace the partial tag, with the partial contents
         */
        if (matchedPartial) {
            return percentageOfPartialWithRanges({
                txtPartial: matchedPartial.compiledContent,
                endPercentage: percentage,
                startPercentage: startPercentage || 0,
            });
        } 
        /**
         * @step if we dont have a partial, return the master
         */
        else{
            return getRanges(false, masterPiece.text);
        }
    });

    return masterAndPartials;
}
