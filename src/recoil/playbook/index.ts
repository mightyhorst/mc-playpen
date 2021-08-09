import axios from 'axios';
import {compile as hbsCompile} from 'handlebars';
import { 
    atom, 
    atomFamily, 
    selector, 
    GetRecoilValue, 
    selectorFamily, 
    waitForAll, 
} from 'recoil';
import {
    currentBlueprintIdState,
    currentAppIdState,
    blueprintFolderState,
    appFolderState,
    getFile,
    currentFileIdState,
    currentBlueprintFileIdState,
    currentFileState,
    currentBlueprintFileState,
} from '../';
import {
    /**
     * @namespace Playbook
     */
    IPlaybookJson,
    IPlaybookCategory,
    IPlaybookScene,
    IPlaybookStep,
    IPlaybookTimeline,
    IPlaybookTimelineCodeData,
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

export const playbookAuthourState = atom<string>({
    key: 'playbookAuthourState',
    default: `masterclass`
});
export const playbookNameState = atom<string>({
    key: 'playbookNameState',
    default: `css-grid-playbook`
});
export const playbookVersionState = atom<string>({
    key: 'playbookVersionState',
    default: `1.0.0`
});

/**
 * @namespace playbookJson
 */
export const playbookJsonState = selector<IPlaybookJson>({
    key: 'playbookJsonState',
    get: async ({ get }: GetProps):Promise<IPlaybookJson> => {
        const playbookAuthour = get(playbookAuthourState);
        const playbookName = get(playbookNameState);
        const playbookVersion = get(playbookVersionState);
        try{    
            
            const response = await axios.get<IPlaybookJson>(`https://610b8f8a2b6add0017cb392b.mockapi.io/playbookjson`);
            const data = response.data;
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
type ITransformedPlaybook = {
    cats: IPlaybookCategory[];
    scenes: IPlaybookScene[];
    steps: IPlaybookStep[];
}
export const transformedPlaybookState = selector<ITransformedPlaybook>({
    key: 'transformedPlaybookState',
    get: ({ get }: GetProps): ITransformedPlaybook => {
        const playbookJson:IPlaybookJson = get(playbookJsonState);
        const playbookCats = playbookJson.categories || [];
        const cats:IPlaybookCategory[] = [];
        const scenes:IPlaybookScene[] = [];
        const steps:IPlaybookStep[] = [];
        if(playbookCats){
            for(let catIndex = 0; catIndex < playbookCats.length; catIndex++){
                const cat = playbookCats[catIndex];
                const catScenes = cat.scenes;
                if(catScenes){
                    for (let sceneIndex = 0; sceneIndex < catScenes.length; sceneIndex++) {
                        const scene = catScenes[sceneIndex];
                        scene.catId = cat.id;

                        const sceneSteps = scene.steps;
                        if(sceneSteps){
                            for (let sceneIndex = 0; sceneIndex < sceneSteps.length; sceneIndex++) {
                                const step = sceneSteps[sceneIndex];
                                step.catId = cat.id;
                                step.sceneId = scene.id;
                                const transformedStep:IPlaybookStep = {
                                    catId: cat.id,
                                    sceneId: scene.id,
                                    id: step.id,
                                    title: step.title,
                                    duration: step.duration,
                                    timeline: step.timeline,
                                    gitData: step.gitData,
                                    windowSettings: step.windowSettings,
                                };
                                steps.push(transformedStep);
                            }
                        }

                        delete scene.steps;
                        scenes.push(scene);
                    }
                }
                delete cat.scenes;
                cats.push(cat);
            }
        }
        
        return {
            cats,
            scenes,
            steps,
        }
    },
});

/**
 * @namespace Categories
 */
export const playbookCategoriesState = selector<IPlaybookCategory[]>({
    key: 'playbookCategoriesState',
    get: ({ get }: GetProps): IPlaybookCategory[] => {
        const playbookJson:IPlaybookJson = get(playbookJsonState);
        console.log({playbookJson});
        console.log({'playbookJson.categories':playbookJson.categories});
        
        return playbookJson.categories || [];
    },
});
/*
export const transformedCategoriesState = selector<IPlaybookCategory[]>({
    key: 'transformedCategoriesState',
    get: ({ get }: GetProps): IPlaybookCategory[] => {
        const playbookJson:IPlaybookJson = get(playbookJsonState);
        console.log({playbookJson});
        console.log({'playbookJson.categories':playbookJson.categories});
        
        return playbookJson.categories?.map(cat => {
            delete cat.scenes;
            return cat;
        }) || [];
    },
});
*/

export const currentPlaybookCategoryIdState = atom<string>({
    key: 'currentPlaybookCategoryIdState',
    default: `cat00-css-grid`,
});
/*
export const playbookCategoryIdsState = selector<string[]>({
    key: 'playbookCategoryIds',
    get: ({get}: GetProps): string[] => {
        const playbookCategories:IPlaybookCategory[] = get(playbookCategoriesState);
        return playbookCategories.map(cat => cat.id);
    }
});
*/
export const currentPlaybookCategoryState = selector<IPlaybookCategory|null>({
    key: 'currentPlaybookCategoryState',
    get: ({get}: GetProps): IPlaybookCategory|null => {
        const currentPlaybookCategoryId:string = get(currentPlaybookCategoryIdState);
        const playbookCategories:IPlaybookCategory[] = get(playbookCategoriesState);
        return playbookCategories.find(cat => cat.id === currentPlaybookCategoryId) || null;
    }
});

/**
 * @namespace Scenes
 */
export const playbookScenesState = selector<IPlaybookScene[]>({
    key: 'playbookScenesState',
    get: ({get}: GetProps): IPlaybookScene[] => {
        const curentPlaybookCategory:IPlaybookCategory|null = get(currentPlaybookCategoryState);
        if(curentPlaybookCategory){
            return curentPlaybookCategory.scenes.map(scene => {
                scene.catId = curentPlaybookCategory.id;
                return scene;
            });
        }
        else{
            return [];
        }
    }
});

export const currentPlaybookSceneIdState = atom<string>({
    key: 'currentPlaybookSceneIdState',
    default: `scene00-define-a-grid-scene`,
});
export const currentPlaybookSceneState = selector<IPlaybookScene|null>({
    key: 'currentPlaybookSceneState',
    get: ({get}: GetProps): IPlaybookScene|null => {
        const currentPlaybookSceneId:string = get(currentPlaybookSceneIdState);
        const playbookScenes:IPlaybookScene[] = get(playbookScenesState);
        return playbookScenes.find(scene => scene.id === currentPlaybookSceneId) || null;
    }
});

/**
 * @namespace Steps
 */
export const playbookStepsState = selector<IPlaybookStep[]>({
    key: 'playbookStepsState',
    get: ({get}: GetProps): IPlaybookStep[] => {
        const curentPlaybookScene:IPlaybookScene|null = get(currentPlaybookSceneState);
        if(curentPlaybookScene){
            return curentPlaybookScene.steps.map(step => {
                step.catId = curentPlaybookScene.catId;
                step.sceneId = curentPlaybookScene.id;
                return step;
            });
        }
        else{
            return [];
        }
    }
});
export const currentPlaybookStepIdState = atom<string>({
    key: 'currentPlaybookStepIdState',
    default: `step00-define-a-grid`,
});
export const currentPlaybookStepState = selector<IPlaybookStep|null>({
    key: 'currentPlaybookStepState',
    get: ({get}: GetProps): IPlaybookStep|null => {
        const currentPlaybookStepId:string = get(currentPlaybookStepIdState);
        const playbookSteps:IPlaybookStep[] = get(playbookStepsState);
        return playbookSteps.find(step => step.id === currentPlaybookStepId) || null;
    }
});

/**
 * @namespace Timeline
 */
export const playbookTimelineState = selector<IPlaybookTimeline[]>({
    key: 'playbookTimelineState',
    get: ({get}: GetProps): IPlaybookTimeline[] => {
        const currentPlaybookStep:IPlaybookStep|null = get(currentPlaybookStepState);
        if(currentPlaybookStep){
            return currentPlaybookStep.timeline;
        }
        else{
            return [];
        }
    },
});
interface ICode{
    id: string;
    start: number;
    duration: number;
    // templateFile:IFile;
    // partialFiles:IFile[];
    templateContent: string;
    // partialContents: string[];
    partials:IPartial[];
}
interface IPartial{
    partialId: string;
    start: number;
    duration: number;
    template?: string;
    template_data?: {
        [handlebarId: string]: string;
    };
    partialContent: string;
}
export const currentTimelineCodePanelsState = selector<ICode[]>({
    key: `currentTimelineCodePanelsState`,
    get: ({get}: GetProps): ICode[] => {
        const currentTimeline:IPlaybookTimeline[] = get(playbookTimelineState);
        const codeTimelines:IPlaybookTimeline[] = 
            currentTimeline.filter(timeline => timeline.hasOwnProperty('code'));
        
        const codeBlocks:ICode[] = codeTimelines.map(codePanel => {
            const {
                id,
                start,
                duration,
                code,
            } = codePanel;

            const {
                template,
                template_data,
                partial_sections,
                output,
            } = code!;
            const DEBUG_templateUrl = `https://610b8f8a2b6add0017cb392b.mockapi.io/template-hbs` || template;
            const DEBUG_partialUrl = `https://610df94348beae001747b98c.mockapi.io/partial-01_hbs`;
            const templateFile:IFile = get(getFile(DEBUG_templateUrl));

            /**
             * @step handlebars
             */
            let templateContent:string = templateFile.file_content;
            if(template_data){
                const hbsTemplate = hbsCompile(templateFile.file_content);
                templateContent = hbsTemplate(template_data);
            }
            
            /*
            const getPartialFiles = partial_sections.map(partial => getFile(DEBUG_partialUrl || partial.template))
            const partialFiles:IFile[] = get(waitForAll(getPartialFiles));
            const partialContents:string[] = partialFiles.map(file => file.file_content);
            */
           const partials:IPartial[] = partial_sections.map(partial => {
               const partialFile:IFile = get(getFile(DEBUG_partialUrl || partial.template));

                /**
                 * @step handlebars
                 */
                let partialContent:string = partialFile.file_content;
                if(partial.template_data){
                    const hbsTemplate = hbsCompile(partialFile.file_content);
                    partialContent = hbsTemplate(partial.template_data);
                }

               return {
                    partialId: partial.partial_id,
                    start: partial.start,
                    duration: partial.duration,
                    // template: partial.template,
                    partialContent,
               }
           });

            return <ICode>{
                id,
                start,
                duration,
                templateContent,
                partials,
            }
        });
        return codeBlocks;
    },
});
