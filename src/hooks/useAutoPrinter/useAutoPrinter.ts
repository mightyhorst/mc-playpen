/**
 * @requires Hooks
 */
import {
    useCallback, 
    useEffect, 
    useMemo,
    useState,
} from 'react';

/**
 * @requires Models
 */
import {
    IMaster,
    IPartial,
    IContents,
} from '../../models';

/**
 * @requires Services
 */
import{
    // hbsRegex,
    // allPartials,
    // splitMasterContents,
    // splitMasterContentsWithRanges,
    // masterAndPartialsFactory,
    masterAndPartialsWithRangesFactory,
    // TMasterAndPartialsWithRangesFactory,
} from './services';

interface UsePrinterProps{
    master: IMaster;
    partials: IPartial[];
    percentage?: number;
}

export function useAutoPrinter({
    master,
    partials,
    percentage = 1,
}:UsePrinterProps): {
    // factory: () => TMasterAndPartialsWithRangesFactory;
    factory: (percentage: number, startPercentage?: number) => IContents[];
    compiled: string;
}{
    // const [percentage, setPercentage] = useState(initPercentage);
    const [compiled, setCompiled] = useState(``);

    /**
     * @constant {string[]} allPartials - find every partial in the compiled content
     */
    const masterContents = master.compiledContent;
    
    /**
     * @constant {TMasterAndPartialsWithRangesFactory} factory - xxx 
     */
    const factory = useMemo(() => {
        return masterAndPartialsWithRangesFactory({
            masterContents,
            partials,
        });
    }, [masterContents, partials]);

    /**
     * @step 
     */
    useEffect(()=>{
        const contents:IContents[] = factory(percentage);
        setCompiled( 
            contents.map(t=>t.text).join('')
        );
    }, [percentage, factory]);
    

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
        factory,
        compiled,
    };
}
export default useAutoPrinter;
