/**
 * @function percentageOfPartial
 * @param {string} txtPartial - partial contents text
 * @param {number} endPercentage - as a fraction of 1, where 1 is 100%
 * @param {number?} startPercentage - (optional) where to start from, as a fraction of 1, where 1 is 100%. This defaults to 0 i.e. 0% (or all the string up to the ened percentage)
 */
export function percentageOfPartial({ 
    txtPartial, 
    endPercentage, 
    startPercentage = 0, 
}:{
    txtPartial: string;
    endPercentage: number;
    startPercentage?: number;
}): string {
    const startIndex = startPercentage
        ? txtPartial.length * startPercentage
        : 0;
    const endIndex = txtPartial.length * endPercentage;
    const txtPercentage = txtPartial.substring(startIndex, endIndex);
    return txtPercentage;
}
