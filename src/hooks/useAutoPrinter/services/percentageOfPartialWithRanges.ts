import {
    IContents,
} from '../../../models';
import {
    percentageOfPartial,
    getRanges,
} from '.';

export function percentageOfPartialWithRanges({ 
    txtPartial, 
    endPercentage, 
    startPercentage = 0, 
}:{
    // partial: IContents;
    txtPartial: string;
    endPercentage: number;
    startPercentage?: number;
}):IContents {

    const txtPercentage = percentageOfPartial({
        // txtPartial: partial.text,
        txtPartial,
        endPercentage,
        startPercentage,
    });

    return getRanges(true, txtPercentage);
}
