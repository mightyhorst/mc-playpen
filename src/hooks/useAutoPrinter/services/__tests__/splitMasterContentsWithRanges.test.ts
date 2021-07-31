import {
    splitMasterContentsWithRanges,
} from '..';

const masterContents = `class Hello{
    {{partial01}}
  
  method(){
  
  }
  
  {{partial02}}
  
  help(){
  
  }
  
  {{partial03}}
  
  something(){
  
  }
}`;

describe('useAutoPrinter', ()=>{
    it('splitMasterContentsWithRanges', ()=>{
        
        const masterContentsArr = splitMasterContentsWithRanges(masterContents);
        const arr = masterContentsArr.map(t => ({...t, text: t.text.trim().split('\n').join('')}));
        console.log({arr});
        expect(arr).toEqual([
            {
                isPartial: false,
                text: "class Hello{",
                startRow: 1,
                endRow: 2,
                startCol: 1,
                endCol: 4,
            },
            {
                isPartial: true,
                text: "{{partial01}}",
                startRow: 1,
                endRow: 1,
                startCol: 1,
                endCol: 13,
                abs: {
                    startRow: 3,
                    startCol: 5,
                    endRow: 3,
                    endCol: 17,
                },
            },
            {
                isPartial: false,
                text: "method(){    }",
                startRow: 1,
                endRow: 7,
                startCol: 1,
                endCol: 2,
                abs: {
                    startRow: 4,
                    endRow: 10,
                    startCol: 18,
                    endCol: 19,
                },
            },
            {
                isPartial: true,
                text: "{{partial02}}",
                startRow: 1,
                endRow: 1,
                startCol: 1,
                endCol: 13,
                abs: {
                    startRow: 11,
                    endRow: 11,
                    startCol: 20,
                    endCol: 32,
                }
            },
            {
                isPartial: false,
                text: "help(){    }",
                startRow: 1,
                endRow: 7,
                startCol: 1,
                endCol: 2,
                abs: {
                    startRow: 12,
                    endRow: 18,
                    startCol: 33,
                    endCol: 34,
                },
            },
            {
                isPartial: true,
                text: "{{partial03}}",
                startRow: 1,
                endRow: 1,
                startCol: 1,
                endCol: 13,
                abs: {
                    startRow: 19,
                    endRow: 19,
                    startCol: 35,
                    endCol: 47,
                },
            },
            {
                isPartial: false,
                text: "something(){    }}",
                startRow: 1,
                endRow: 6,
                startCol: 1,
                endCol: 1,
                abs: {
                    startRow: 20,
                    endRow: 25,
                    startCol: 48,
                    endCol: 48,
                }
            }
        ])

        expect(masterContentsArr[0].text.trim()).toEqual(`class Hello{`);
        expect(masterContentsArr[0].isPartial).toBe(false);

        const partial01 = masterContentsArr[1];
        expect(partial01.text.trim()).toEqual(`{{partial01}}`);
        expect(partial01.isPartial).toBe(true);
        expect(partial01.startRow).toBe(1);
        expect(partial01.endRow).toBe(1);
        expect(partial01.abs!.startRow).toBe(3);
        expect(partial01.abs!.endRow).toBe(3);
        expect(partial01.startCol).toBe(1);
        expect(partial01.endCol).toBe(13);
        expect(partial01.abs!.startCol).toBe(5);
        expect(partial01.abs!.endCol).toBe(17);
        
        expect(masterContentsArr[3].text.trim()).toEqual(`{{partial02}}`);
        expect(masterContentsArr[3].isPartial).toBe(true);
        
        expect(masterContentsArr[5].text.trim()).toEqual(`{{partial03}}`);
        expect(masterContentsArr[5].isPartial).toBe(true);

    });
});