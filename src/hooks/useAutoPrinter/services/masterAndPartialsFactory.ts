import { 
    IPartial,
    IContents,
} from '../../../models';
import { 
    splitMasterContents, 
    masterAndPartials, 
    masterAndPartialsWithRanges,
} from '.';

/**
 * @type TMasterAndPartialsFactory 
 */
export type TMasterAndPartialsFactory = (percentage: number, startPercentage?: number) => string[];

/**
 * @function masterAndPartialsFactory
 * 
 * @param masterContents: string;
 * @param partials: IPartial[]; 
 * 
 * @returns {TMasterAndPartialsFactory} (percentage:number) => string;
 */
export function masterAndPartialsFactory({
    masterContents,
    partials,
}: {
    masterContents: string;
    partials: IPartial[];
}):TMasterAndPartialsFactory {

    const masterContentsSplit:IContents[] = splitMasterContents(masterContents);
    
    return (
        percentage: number,
        startPercentage?: number,
    ) => {
        return masterAndPartials({
            masterContentsSplit,
            partials,
            percentage,
            startPercentage,
        });
    }
}

/**
 * @type TMasterAndPartialsWithRangesFactory
 */
export type TMasterAndPartialsWithRangesFactory = (percentage: number, startPercentage?: number) => IContents[];

/**
 * @function masterAndPartialsWithRangesFactory
 * 
 * @param masterContents: string;
 * @param partials: IPartial[]; 
 * 
 * @returns {TMasterAndPartialsFactory} (percentage:number) => IContents[];
 */
export function masterAndPartialsWithRangesFactory({
    masterContents,
    partials,
}: {
    masterContents: string;
    partials: IPartial[];
}):TMasterAndPartialsWithRangesFactory {

    const masterContentsSplit:IContents[] = splitMasterContents(masterContents);
    
    return (
        percentage: number,
        startPercentage?: number,
    ): IContents[] => {
        return masterAndPartialsWithRanges({
            masterContentsSplit,
            partials,
            percentage,
            startPercentage,
        });
    }
}
