import { 
    memo,
} from 'react';
import { 
    useAutoPrinter,
    useTimer,
} from '../../hooks';
import {
    IMaster,
    IPartial,
} from '../../models';
import {
    MonacoEditor,
} from './';

const txtMaster = `class Hello{
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
const txtMasterCompiled = txtMaster;

const master: IMaster<{className:string}> = {
    fileName: 'template.hbs', 
    filePath: 'cat01/scene01/step01', 
    contents: txtMaster, 
    compiledContent: txtMasterCompiled,
    data: {
        className: 'Hello',
    },
};
const partials: IPartial<{}>[] = [
    {
        partialId: 'partial01',
        fileName: '',
        filePath: '',
        contents: ``,
        compiledContent: `partial01(){
            console.log('hello from partial 01');
        }`,
        data: {}
    },
    {
        partialId: 'partial02',
        fileName: '',
        filePath: '',
        contents: ``,
        compiledContent: `partial02(){
            console.log('hello from partial 02');
        }`,
        data: {}
    },
    {
        partialId: 'partial03',
        fileName: '',
        filePath: '',
        contents: ``,
        compiledContent: `partial03(){
            console.log('hello from partial 03');
        }`,
        data: {}
    },
];

export const CodePanel = memo(function Editor(){
    const {percentage} = useTimer();
    const {
        compiled,
    } = useAutoPrinter({
        master,
        partials,
        percentage,
    });

    return (<>
        <MonacoEditor 
            value={compiled}
        />
    </>);
});
