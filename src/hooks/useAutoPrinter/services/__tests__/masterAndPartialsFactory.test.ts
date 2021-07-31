import {IPartial} from '../../../../models';
import {
    masterAndPartialsFactory,
    masterAndPartialsWithRangesFactory,
    TMasterAndPartialsFactory as TFactory,
    TMasterAndPartialsWithRangesFactory as TFactoryRange,
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
const partials:IPartial[] = [
{
  partialId: 'partial01',
  fileName: '',
  filePath: '',
  contents: '',
  compiledContent: `partial01(){
      console.log('hello from partial 01');
  }`,
},
{
  partialId: 'partial02',
  fileName: '',
  filePath: '',
  contents: '',
  compiledContent: `partial02(){
      console.log('hello from partial 02');
  }`,
},
{
  partialId: 'partial03',
  fileName: '',
  filePath: '',
  contents: '',
  compiledContent: `partial03(){
      console.log('hello from partial 03');
  }`,
},
];

const checks = [
`class Hello{`,
`partial01(){
      console.log('hello from partial 01');
  }`,
`method(){
  
  }`,
`partial02(){
      console.log('hello from partial 02');
  }`,
`help(){
  
  }`,
`partial03(){
      console.log('hello from partial 03');
  }`,
`something(){
  
  }
}`
];
const txtCompiled = `class Hello{
  partial01(){
      console.log('hello from partial 01');
  }
  
  method(){
  
  }
  
  partial02(){
      console.log('hello from partial 02');
  }
  
  help(){
  
  }
  
  partial03(){
      console.log('hello from partial 03');
  }
  
  something(){
  
  }
}`;



describe('useAutoPrinter', ()=>{

    let factory:TFactory;

    beforeAll(()=>{
      factory = masterAndPartialsFactory({
        masterContents,
        partials,
      });
    });

    it('#masterAndPartialsFactory - 100%', ()=>{
        const percentage = 1;
        const txtMasterAndPartials:string[] = factory(percentage);

        expect(txtMasterAndPartials.map(t => t.trim())).toEqual(checks);
        expect(txtMasterAndPartials.join('')).toEqual(txtCompiled);
    });
});

describe('useAutoPrinter', ()=>{

    let factory:TFactoryRange;

    beforeAll(()=>{
      factory = masterAndPartialsWithRangesFactory({
        masterContents,
        partials,
      });
    });

    it('#masterAndPartialsWithRangesFactory - 100%', ()=>{
        const percentage = 1;
        const txtMasterAndPartials = factory(percentage);

        expect(txtMasterAndPartials.map(t => t.text.trim())).toEqual(checks);
        expect(txtMasterAndPartials.map(t => t.text).join('')).toEqual(txtCompiled);
        
        expect(txtMasterAndPartials[0]).toEqual({
          isPartial: false,
          text: `class Hello{\n  `,
          startRow: 1,
          endRow: 2,
          startCol: 1,
          endCol: 2,
        });
        
        expect(txtMasterAndPartials[1]).toEqual({
          isPartial: true,
          text: `partial01(){\n      console.log('hello from partial 01');\n  }`,
          startRow: 1,
          endRow: 3,
          startCol: 1,
          endCol: 3,
        });

        expect(txtMasterAndPartials[2]).toEqual({
          isPartial: false,
          text: `\n  \n  method(){\n  \n  }\n  \n  `,
          startRow: 1,
          endRow: 7,
          startCol: 1,
          endCol: 2,
        });
    });
});
