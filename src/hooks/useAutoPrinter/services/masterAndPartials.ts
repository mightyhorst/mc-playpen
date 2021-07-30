import { IPartial } from '../../../models';
import {IMasterContents} from '../models';
import { percentageOfPartial } from '.';

/**
 * @function masterAndPartials
 *
 * @description master and partials
 *
 * @param {string[]} masterContentsSplit - masterContents split by partials regex
 * @param {IPartial} partials - id and contents for partials
 * @param {number} percentage - from 0 to 1 for 0 % to 100%, how much of the string to print
 * @param {number} startPercentage - (optional) from 0 to 1 for 0 % to 100%
 */
export function masterAndPartials({
    masterContentsSplit,
    partials,
    percentage,
    startPercentage = 0,
}: {
    // masterContentsSplit: string[];
    masterContentsSplit: IMasterContents[];
    partials: IPartial[];
    percentage: number;
    startPercentage?: number;
}) {
    const masterAndPartials = masterContentsSplit.map((masterPiece:IMasterContents) => {
        console.log({masterPiece});
        /**
         * @step find partial
         */
        const matchedPartial = partials.find((partial) => {
            return masterPiece.text.search(partial.partialId) >= 0;
        });

        /**
         * @step replace the partial tag, with the partial contents
         */
        if (matchedPartial) {
            return percentageOfPartial({
                txtPartial: matchedPartial.compiledContent,
                endPercentage: percentage,
                startPercentage: startPercentage || 0
            });
        } 
        /**
         * @step if we dont have a partial, return the master
         */
        else{
            return masterPiece.text;
        }
    });

    return masterAndPartials;
}
