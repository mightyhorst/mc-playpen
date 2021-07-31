import {IPartial} from '../../../../models';
import {
    masterAndPartialsFactory,
    TMasterAndPartialsFactory as TFactory,
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
