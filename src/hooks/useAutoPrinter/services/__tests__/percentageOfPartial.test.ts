import {
    percentageOfPartial,
} from '..';

describe('useAutoPrinter', ()=>{
    it('#percentageOfPartial', ()=>{
        const txtPartial = `1234567890`;
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: 1,
            })
        ).toEqual(txtPartial);

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .1,
            })
        ).toEqual('1');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .2,
            })
        ).toEqual('12');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .3,
            })
        ).toEqual(123);
    });
});