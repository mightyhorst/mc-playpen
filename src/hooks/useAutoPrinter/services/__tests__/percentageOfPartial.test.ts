import {
    percentageOfPartial,
} from '..';

describe('useAutoPrinter', ()=>{
    it('#percentageOfPartial - end percentages', ()=>{
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
        ).toEqual('123');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .4,
            })
        ).toEqual('1234');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .5,
            })
        ).toEqual('12345');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .6,
            })
        ).toEqual('123456');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .6,
            })
        ).toEqual('123456');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .7,
            })
        ).toEqual('1234567');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .8,
            })
        ).toEqual('12345678');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
            })
        ).toEqual('123456789');
    });
    it('#percentageOfPartial - end percentages and start percentages', ()=>{
        const txtPartial = `1234567890`;
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: 1,
                startPercentage: 0,
            })
        ).toEqual(txtPartial);

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .1,
                startPercentage: 0,
            })
        ).toEqual('1');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .2,
                startPercentage: 0,
            })
        ).toEqual('12');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .3,
                startPercentage: 0,
            })
        ).toEqual('123');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .4,
                startPercentage: 0,
            })
        ).toEqual('1234');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .5,
                startPercentage: 0,
            })
        ).toEqual('12345');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .6,
                startPercentage: 0,
            })
        ).toEqual('123456');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .6,
                startPercentage: 0,
            })
        ).toEqual('123456');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .7,
                startPercentage: 0,
            })
        ).toEqual('1234567');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .8,
                startPercentage: 0,
            })
        ).toEqual('12345678');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: 0,
            })
        ).toEqual('123456789');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .1,
            })
        ).toEqual('23456789');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .2,
            })
        ).toEqual('3456789');

        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .3,
            })
        ).toEqual('456789');
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .4,
            })
        ).toEqual('56789');
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .5,
            })
        ).toEqual('6789');
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .6,
            })
        ).toEqual('789');
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .7,
            })
        ).toEqual('89');
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .8,
            })
        ).toEqual('9');
        
        expect(
            percentageOfPartial({
                txtPartial,
                endPercentage: .9,
                startPercentage: .9,
            })
        ).toEqual('');
    });
});