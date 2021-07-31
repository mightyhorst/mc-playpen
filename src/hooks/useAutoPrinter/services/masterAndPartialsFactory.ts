import { IPartial } from '../../../models';
import { IMasterContents } from '../models';
import { 
    splitMasterContents, 
    masterAndPartials, 
} from '.';

export type TMasterAndPartialsFactory = (percentage: number, startPercentage?: number) => string[];

export function masterAndPartialsFactory({
    masterContents,
    partials,
}: {
    // masterContentsSplit: IMasterContents[];
    masterContents: string;
    partials: IPartial[];
}):TMasterAndPartialsFactory {

    const masterContentsSplit:IMasterContents[] = splitMasterContents(masterContents);
    
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
