import {
    splitMasterContents,
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

describe('useAutoPlayer', ()=>{
    it('splitMasterContents', ()=>{
        
        const masterContentsArr = splitMasterContents(masterContents);

        expect(masterContentsArr[0].text.trim()).toEqual(`class Hello{`);
        expect(masterContentsArr[0].isPartial).toBe(false);

        expect(masterContentsArr[1].text.trim()).toEqual(`{{partial01}}`);
        expect(masterContentsArr[1].isPartial).toBe(true);
        
        expect(masterContentsArr[3].text.trim()).toEqual(`{{partial02}}`);
        expect(masterContentsArr[3].isPartial).toBe(true);
        
        expect(masterContentsArr[5].text.trim()).toEqual(`{{partial03}}`);
        expect(masterContentsArr[5].isPartial).toBe(true);

    });
});