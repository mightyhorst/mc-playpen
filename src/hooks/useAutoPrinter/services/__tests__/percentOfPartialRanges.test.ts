import {
    IContents,
} from '../../../../models';
import {
    percentageOfPartialWithRanges,
} from '..';

const text = `1234567890`;
const partial:IContents = {
    isPartial: true,
    text,
};
const expected:IContents = {
    "isPartial": true, 
    "startRow": 1, 
    "startCol": 1, 
    "endRow": 1, 
    "endCol": 10, 
    "text": "1234567890",
}

describe('useAutoPrinter', ()=>{
    it('#percentageOfPartialWithRanges - end percentages', ()=>{
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: 1,
            })
        ).toEqual({
            ...expected,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .1,
            })
        ).toEqual({
            ...expected,
            text: '1',
            endCol: 1,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .2,
            })
        ).toEqual({
            ...expected,
            text: '12',
            endCol: 2,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .3,
            })
        ).toEqual({
            ...expected,
            text: '123',
            endCol: 3,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .4,
            })
        ).toEqual({
            ...expected,
            text: '1234',
            endCol: 4,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .5,
            })
        ).toEqual({
            ...expected,
            text: '12345',
            endCol: 5,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .6,
            })
        ).toEqual({
            ...expected,
            text: '123456',
            endCol: 6,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .7,
            })
        ).toEqual({
            ...expected,
            text: '1234567',
            endCol: 7,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .8,
            })
        ).toEqual({
            ...expected,
            text: '12345678',
            endCol: 8,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
            })
        ).toEqual({
            ...expected,
            text: '123456789',
            endCol: 9,
        });
    });
    it('#percentageOfPartialWithRanges - end percentages and start percentages', ()=>{
        const txtPartial = `1234567890`;
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: 1,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '1234567890',
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .1,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '1',
            endCol: 1,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .2,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '12',
            endCol: 2,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .3,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '123',
            endCol: 3,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .4,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '1234',
            endCol: 4,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .5,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '12345',
            endCol: 5,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .6,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '123456',
            endCol: 6,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .6,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '123456',
            endCol: 6,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .7,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '1234567',
            endCol: 7,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .8,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '12345678',
            endCol: 8,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: 0,
            })
        ).toEqual({
            ...expected,
            text: '123456789',
            endCol: 9,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .1,
            })
        ).toEqual({
            ...expected,
            text: '23456789',
            endCol: 8,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .2,
            })
        ).toEqual({
            ...expected,
            text: '3456789',
            endCol: 7,
        });

        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .3,
            })
        ).toEqual({
            ...expected,
            text: '456789',
            endCol: 6,
        });
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .4,
            })
        ).toEqual({
            ...expected,
            text: '56789',
            endCol: 5,
        });
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .5,
            })
        ).toEqual({
            ...expected,
            text: '6789',
            endCol: 4,
        });
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .6,
            })
        ).toEqual({
            ...expected,
            text: '789',
            endCol: 3,
        });
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .7,
            })
        ).toEqual({
            ...expected,
            text: '89',
            endCol: 2,
        });
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .8,
            })
        ).toEqual({
            ...expected,
            text: '9',
            endCol: 1,
        });
        
        expect(
            percentageOfPartialWithRanges({
                partial,
                endPercentage: .9,
                startPercentage: .9,
            })
        ).toEqual({
            ...expected,
            text: '',
            endCol: 0,
        });
    });
});
