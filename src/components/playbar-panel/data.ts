export const masterContents:string = `class Hello{
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
export interface IPartial{
    id: string;
    contents: string;
}
export const partials:IPartial[] = [
{
  id: 'partial01',
  contents: `  partial01(){
      console.log('hello from partial 01');
  }`,
},
  {
  id: 'partial02',
  contents: `  partial02(){
      console.log('hello from partial 02');
  }`,
},
  {
  id: 'partial03',
  contents: `  partial03(){
      console.log('hello from partial 03');
  }`,
},
];