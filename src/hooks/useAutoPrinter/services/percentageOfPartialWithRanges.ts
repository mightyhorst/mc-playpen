import {
    IContents,
} from '../../../models';
import {
    percentageOfPartial,
    getRanges,
} from '.';

export function percentageOfPartialWithRanges({ 
    partial, 
    endPercentage, 
    startPercentage = 0, 
}:{
    partial: IContents;
    endPercentage: number;
    startPercentage?: number;
}):IContents {

    const txtPercentage = percentageOfPartial({
        txtPartial: partial.text,
        endPercentage,
        startPercentage,
    });

    return getRanges(true, txtPercentage);
}
