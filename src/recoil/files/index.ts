import axios from 'axios';
import { 
    atom, 
    atomFamily, 
    selector, 
    GetRecoilValue, 
    selectorFamily, 
    waitForAll,
    DefaultValue,
    AtomFamilyOptions,
    AtomEffect,
    RecoilState, 
} from 'recoil';
import {
    playbookAuthourState,
    playbookNameState,
    playbookVersionState,
} from '..';
import {
    /**
     * @namespace Files
     */
    IStorageStatus,
    IFolderList,
    IFileStorageFile,
    IFile,
    IFileResp,
    IFolderListResp,
} from '../../models';

type GetProps = { get: GetRecoilValue };

/**
 * @namespace Files
 */
export const currentBlueprintIdState = selector<string>({
    key: 'currentBlueprintIdState',
    /** 
     * @returns `masterclass/blueprints/css-grid-playbook/1.0.0`,
     */
    get: ({get}: GetProps):string =>{
        const playbookAuthour = get(playbookAuthourState);
        const playbookName = get(playbookNameState);
        const playbookVersion = get(playbookVersionState);
        const blueprintId = `${playbookAuthour}/blueprints/${playbookName}/${playbookVersion}`;
        const DEBUG_id_for_mock_api = `STORAGE_masterclass_blueprintscss_grid-playbook_100`;
        return DEBUG_id_for_mock_api;
    },
});
export const currentAppIdState = selector<string>({
    key: 'currentAppIdState',
    /** 
     * @returns `gbst/apps/doms-gbst-app/1.0.0`,
     */
    get: ({get}: GetProps):string =>{
        const appId = `gbst/apps/doms-gbst-app/1.0.0`;
        const DEBUG_id_for_mock_api = `STORAGE_gbst_apps_doms-gbst-app_100`;
        return DEBUG_id_for_mock_api;
    },
});
export const blueprintFolderState = selector<IFolderList>({
    key: 'blueprintFolderState',
    get: async ({ get }: GetProps):Promise<IFolderList> => {
        const currentBlueprintId = get(currentBlueprintIdState);
        try{    
            const url = `https://610b8f8a2b6add0017cb392b.mockapi.io/${currentBlueprintId}`;
            const {data:response} = await axios.get<IFolderListResp>(url);
            const data:IFolderList = response.data!;
            return data;
        }
        catch(err){
            if(err.response){
                throw err.response;
            }
            throw err;
        }
    }
});
export const appFolderState = selector<IFolderList>({
    key: 'appFolderState',
    get: async ({ get }: GetProps):Promise<IFolderList> => {
        const currentAppId = get(currentAppIdState);
        try{    
            const url = `https://610b8f8a2b6add0017cb392b.mockapi.io/${currentAppId}`;
            const {data: response} = await axios.get<IFolderListResp>(url);
            const data:IFolderList = response.data!;
            return data;
        }
        catch(err){
            if(err.response){
                throw err.response;
            }
            throw err;
        }
    }
});
export const history: Array<{
    label: string,
    undo: () => void,
  }> = [];
const historyAtomEffect = (filePath:string):AtomEffect<IFile> => ({
    node,
    trigger,
    setSelf,
    resetSelf,
    onSet,
}) => {
    console.log('historyAtomEffect', {
        node,
        trigger,
        setSelf,
        resetSelf,
    });
    onSet(
        (newValue:IFile|DefaultValue, oldValue:IFile|DefaultValue) => {

            const isDefault = oldValue instanceof DefaultValue;
            console.log('historyAtomEffect onSet', {
                isDefault,
                newValue,
                oldValue,
                trigger,
            });
            if(isDefault){
                history.push({
                    label: 'Reset',
                    undo: () => {
                        resetSelf();
                    }
                });
            }
            history.push({
                // label: `Undo ${(newValue instanceof DefaultValue ? '': (newValue as IFile).name) }`,
                label: `Undo ${(newValue instanceof DefaultValue ? JSON.stringify(newValue): (newValue as IFile).name) }`,
                undo: () => {
                    setSelf(oldValue);
                },
            })
        }
    );
}
// export const getFile = selectorFamily<IFile, string>({
export const getFile = atomFamily<IFile, string>({
    key: 'getFile',
    effects_UNSTABLE: (filePath:string) => [
        historyAtomEffect(filePath),
    ],
    default: selectorFamily<IFile, string>({
        key: 'getFileById/default',
        get: (filePath:string) => async ():Promise<IFile> => {
            try{
                const url = filePath;
                const {data:response} = await axios.get<IFileResp>(url);
                const data:IFile = response.data!;

                return data;
            }
            catch(err){
                if(err.response){
                    throw err.response;
                }
                throw err;
            }
            /*
            const file: IFile = {
                file_content: "class HelloWorld{ constructor(message){ this.message = message; {{partial01}} } } ",
                name: "cat01-css-grid/scene00-define-a-grid/step00-defining-a-grid/template.hbs",
                path: "/masterclass/blueprints/css-grid-playbook/1.0.0",
                size_of: 88,
                file_extension: ".hbs",
                file_type: "text",
                mime_type: "text/plain",
                md5: "87f385c8e5ca4115b8bd2d3858814f4e",
            };
            return file;
            */
        },
        set: (filePath:string) => ({ 
            set: SetRecoilState, 
            get: GetRecoilValue, 
            reset: ResetRecoilState,
        }, newValue: IFile | DefaultValue) => {
            console.log('👉 setting File via getFile', {
                isDefault: newValue instanceof DefaultValue,
                newValue,
            })
        }
    }),
});
export const currentFileIdState = atom<string>({
    key: 'currentFileIdState',
    // default: `cat01-css-grid/scene00-define-a-grid/step00-defining-a-grid/template.hbs`,
    default: `https://610b8f8a2b6add0017cb392b.mockapi.io/template-hbs`
});
export const currentBlueprintFileIdState = atom<string>({
    key: 'currentBlueprintFileIdState',
    default: `https://610b8f8a2b6add0017cb392b.mockapi.io/template-hbs`,
});
export const currentFileState = selector<IFile>({
    key: 'currentFileState',
    get: ({get}: GetProps):IFile =>{
        const currentFileId:string = get(currentFileIdState);
        const currentFile:IFile = get(getFile(currentFileId));
        return currentFile;
    },
});
export const currentBlueprintFileState = selector<IFile>({
    key: 'currentBlueprintFileState',
    get: ({get}: GetProps):IFile =>{
        const currentBlueprintFileId:string = get(currentBlueprintFileIdState);
        const currentFile:IFile = get(getFile(currentBlueprintFileId));
        return currentFile;
    },
});
