import {
    IContents,
} from '../../../models';
import {
    percentageOfPartial,
} from './percentageOfPartial';

export function percentageOfPartialWithRanges({ 
    partial, 
    endPercentage, 
    startPercentage = 0, 
}:{
    partial: IContents;
    endPercentage: number;
    startPercentage?: number;
}):IContents {
    // const {
    //     text,
    //     startRow,
    //     startCol,
    //     endRow,
    //     endCol,
    // } = partial;

    const txtPercentage = percentageOfPartial({
        txtPartial: partial.text,
        endPercentage,
        startPercentage,
    });

    return {
        ...partial,
        text: txtPercentage,
    }
}
