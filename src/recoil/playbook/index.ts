import axios from 'axios';
import { compile as hbsCompile } from 'handlebars';
import { v4 as uuid } from 'uuid';
import {
    atom,
    atomFamily,
    selector,
    GetRecoilValue,
    selectorFamily,
    waitForAll,
    SetRecoilState,
    ResetRecoilState,
    DefaultValue
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
    currentBlueprintFileState
} from '../';
import {
    /**
     * @namespace Playbook
     */
    IPlaybookJson,
    IPlaybookCategory,
    IPlaybookScene,
    IPlaybookStep,
    ITimeline,
    ITime,
    ICodeWithContent,
    IPartial,
    IDescription,
    IBrowser,
    ITerminal,
    IAudio,
    ISpreadsheet,
    /**
     * @namespace Files
     */
    IFile,
    ITest,
    ICodePanel,
    IVideo,
    ITransformedStep
} from '../../models';

import { GetProps } from './GetProps';
export * from './GetProps';

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
    get: async ({ get }: GetProps): Promise<IPlaybookJson> => {
        const playbookAuthour = get(playbookAuthourState);
        const playbookName = get(playbookNameState);
        const playbookVersion = get(playbookVersionState);
        try {
            const response = await axios.get<IPlaybookJson>(
                `https://610b8f8a2b6add0017cb392b.mockapi.io/playbookjson`
            );
            const data = response.data;
            return data;
        } catch (err) {
            if (err.response) {
                throw err.response;
            }
            throw err;
        }
    }
});
type ITransformedPlaybook = {
    cats: IPlaybookCategory[];
    scenes: IPlaybookScene[];
    steps: ITransformedStep[];
};
export const transformedPlaybookState = selector<ITransformedPlaybook>({
    key: 'transformedPlaybookState',
    get: ({ get }: GetProps): ITransformedPlaybook => {
        const playbookJson: IPlaybookJson = get(playbookJsonState);
        const cats: IPlaybookCategory[] = [];
        const scenes: IPlaybookScene[] = [];
        const steps: ITransformedStep[] = [];

        /**
         * @step Categories
         */
        const playbookCats = playbookJson.categories || [];
        if (playbookCats) {
            for (let catIndex = 0; catIndex < playbookCats.length; catIndex++) {
                const cat = playbookCats[catIndex];
                cat._uuid = uuid();

                /**
                 * @step Scenes
                 */
                const catScenes = cat.scenes;
                if (catScenes) {
                    for (
                        let sceneIndex = 0;
                        sceneIndex < catScenes.length;
                        sceneIndex++
                    ) {
                        const scene = catScenes[sceneIndex];
                        scene.catId = cat.id;
                        scene._uuid = uuid();

                        /**
                         * @step Steps
                         */
                        const sceneSteps = scene.steps;
                        if (sceneSteps) {
                            for (
                                let sceneIndex = 0;
                                sceneIndex < sceneSteps.length;
                                sceneIndex++
                            ) {
                                const step = sceneSteps[sceneIndex];
                                step.catId = cat.id;
                                step.sceneId = scene.id;
                                step._uuid = uuid();

                                /**
                                 * @step Timelines
                                 */
                                const stepTimeline = step.timeline;
                                const descPanels: IDescription[] = [];
                                const codePanels: ICodePanel[] = [];
                                const testPanels: ITest[] = [];
                                const browserPanels: IBrowser[] = [];
                                const cliPanels: ITerminal[] = [];
                                const spreadsheetPanels: ISpreadsheet[] = [];
                                const audioPanels: IAudio[] = [];
                                const videoPanels: IVideo[] = [];
                                for (
                                    let timelineIndex = 0;
                                    timelineIndex < stepTimeline.length;
                                    timelineIndex++
                                ) {
                                    const panel: ITimeline =
                                        stepTimeline[timelineIndex];
                                    let time: ITime = {
                                        _uuid: uuid(),
                                        id: panel.id, // <--- @todo override the id with a universally unique id
                                        start: panel.start,
                                        duration: panel.duration
                                    };
                                    if (panel.end) {
                                        time.end = panel.end;
                                    }
                                    switch (panel.panel) {
                                        case 'description':
                                            if (
                                                !panel.hasOwnProperty(
                                                    'description'
                                                )
                                            )
                                                throw new Error(
                                                    'Description panel is missing the description block'
                                                );
                                            descPanels.push({
                                                ...time,
                                                description: panel.description!
                                            });
                                            break;
                                        case 'code':
                                            if (!panel.hasOwnProperty('code'))
                                                throw new Error(
                                                    'Code panel is missing the code block'
                                                );
                                            codePanels.push({
                                                ...time,
                                                ...panel.code!
                                            });
                                            break;
                                        case 'test':
                                            if (!panel.hasOwnProperty('test'))
                                                throw new Error(
                                                    'Test panel is missing the test block'
                                                );
                                            testPanels.push({
                                                ...time,
                                                ...panel.test!
                                            });
                                            break;
                                        case 'browser':
                                            if (
                                                !panel.hasOwnProperty('browser')
                                            )
                                                throw new Error(
                                                    'Browser panel is missing the browser block'
                                                );
                                            if (
                                                !panel.browser!.hasOwnProperty(
                                                    'url'
                                                )
                                            )
                                                throw new Error(
                                                    'Browser panel is missing a "url" for the browser block'
                                                );
                                            browserPanels.push({
                                                ...time,
                                                url: panel.browser!.url
                                            });
                                            break;
                                        case 'terminal':
                                            if (
                                                !panel.hasOwnProperty(
                                                    'terminal'
                                                )
                                            )
                                                throw new Error(
                                                    'Terminal panel is missing the terminal block'
                                                );
                                            cliPanels.push({
                                                ...time,
                                                ...panel.terminal!
                                            });
                                            break;
                                        case 'audio':
                                            if (!panel.hasOwnProperty('audio'))
                                                throw new Error(
                                                    'Audio panel is missing the audio block'
                                                );
                                            audioPanels.push({
                                                ...time,
                                                ...panel.audio!
                                            });
                                            break;
                                        case 'video':
                                            if (!panel.hasOwnProperty('video'))
                                                throw new Error(
                                                    'Video panel is missing the video block'
                                                );
                                            videoPanels.push({
                                                ...time,
                                                ...panel.video!
                                            });
                                            break;
                                        case 'spreadsheet':
                                            if (
                                                !panel.hasOwnProperty(
                                                    'spreadsheet'
                                                )
                                            )
                                                throw new Error(
                                                    'Spreadsheet panel is missing the spreadsheet block'
                                                );
                                            spreadsheetPanels.push({
                                                ...time,
                                                spreadsheet: panel.spreadsheet!
                                            });
                                            break;
                                        default:
                                            throw new Error(
                                                'The Playbook Json has a panel that I do not recognize: ' +
                                                    panel.panel
                                            );
                                    }
                                }

                                /**
                                 * @step Step
                                 */
                                const transformedStep: ITransformedStep = {
                                    catId: cat.id,
                                    sceneId: scene.id,
                                    id: step.id,
                                    title: step.title,
                                    duration: step.duration,
                                    gitData: step.gitData,
                                    windowSettings: step.windowSettings,
                                    timeline: step.timeline,
                                    /**
                                     * @timeline
                                     */
                                    descPanels,
                                    codePanels,
                                    testPanels,
                                    browserPanels,
                                    cliPanels,
                                    spreadsheetPanels,
                                    audioPanels,
                                    videoPanels
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
            steps
        };
    }
});

/**
 * @namespace Categories
 */
// export const playbookCategoriesState = selector<IPlaybookCategory[]>({
export const categoriesState = atom<IPlaybookCategory[]>({
    key: 'categoriesState',
    default: selector<IPlaybookCategory[]>({
        key: 'categoriesState/default',
        get: ({ get }: GetProps): IPlaybookCategory[] => {
            const { cats } = get(transformedPlaybookState);
            return cats;
        }
    })
});
export const getCategoryById = atomFamily<IPlaybookCategory | null, string>({
    key: 'getCategoryById',
    default: selectorFamily<IPlaybookCategory | null, string>({
        key: 'getCategoryById/default',
        get: (catId: string) => ({
            get
        }: GetProps): IPlaybookCategory | null => {
            const { cats } = get(transformedPlaybookState);
            return cats.find((cat) => cat.id === catId) || null;
        }
    })
});
export const currentCatIdState = atom<string>({
    key: 'currentCatIdState',
    default: `cat00-css-grid`
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
export const currentCatState = selector<IPlaybookCategory | null>({
    key: 'currentCatState',
    get: ({ get }: GetProps): IPlaybookCategory | null => {
        const categoryId: string = get(currentCatIdState);
        // const playbookCategories:IPlaybookCategory[] = get(playbookCategoriesState);
        // return playbookCategories.find(cat => cat.id === currentPlaybookCategoryId) || null;
        return get(getCategoryById(categoryId));
    }
});

/**
 * @namespace Scenes
 */
export const scenesState = selector<IPlaybookScene[]>({
    key: 'scenesState',
    get: ({ get }: GetProps): IPlaybookScene[] => {
        const { scenes } = get(transformedPlaybookState);
        return scenes;
    }
});
export const getSceneById = atomFamily<IPlaybookScene | null, string>({
    key: 'getSceneById',
    default: selectorFamily<IPlaybookScene | null, string>({
        key: 'getSceneById/default',
        get: (sceneId: string) => ({
            get
        }: GetProps): IPlaybookScene | null => {
            const { scenes } = get(transformedPlaybookState);
            return scenes.find((scene) => scene.id === sceneId) || null;
        }
    })
});
export const currentSceneIdState = atom<string>({
    key: 'currentSceneIdState',
    default: `scene00-define-a-grid-scene`
});
export const currentSceneState = selector<IPlaybookScene | null>({
    key: 'currentSceneState',
    get: ({ get }: GetProps): IPlaybookScene | null => {
        const currentSceneId: string = get(currentSceneIdState);
        return get(getSceneById(currentSceneId));
    }
});

/**
 * @namespace Steps
 */
export const stepsState = selector<ITransformedStep[]>({
    key: 'stepsState',
    get: ({ get }: GetProps): ITransformedStep[] => {
        const { steps } = get(transformedPlaybookState);
        return steps;
    }
});
export const getStepById = atomFamily<ITransformedStep | null, string>({
    key: 'getStepById',
    default: selectorFamily<ITransformedStep | null, string>({
        key: 'getStepById/default',
        get: (stepId: string) => ({
            get
        }: GetProps): ITransformedStep | null => {
            const { steps } = get(transformedPlaybookState);
            return steps.find((step) => step.id === stepId) || null;
        }
    })
});
export const currentStepIdState = atom<string>({
    key: 'currentStepIdState',
    default: `step00-define-a-grid`
});
export const currentStepState = selector<ITransformedStep | null>({
    key: 'currentStepState',
    get: ({ get }: GetProps): ITransformedStep | null => {
        const currentStepId: string = get(currentStepIdState);
        return get(getStepById(currentStepId));
    }
});

/**
 * @namespace Timeline
 */
export const timelineState = selector<ITimeline[]>({
    key: 'timelineState',
    get: ({ get }: GetProps): ITimeline[] => {
        const currentPlaybookStep: ITransformedStep | null = get(
            currentStepState
        );
        if (currentPlaybookStep) {
            return currentPlaybookStep.timeline.map(
                (panel) =>
                    <ITimeline>{
                        ...panel,
                        stepUuid: panel._uuid
                    }
            );
        } else {
            return [];
        }
    }
});
/**
 * @namespace DescriptionTimelines
 */
export const descriptionTimelinesState = selector<ITimeline[]>({
    key: `descriptionTimelinesState`,
    get: ({ get }: GetProps): ITimeline[] => {
        const stepTimeline: ITimeline[] = get(timelineState);
        const descriptionPanels: ITimeline[] = stepTimeline.filter((timeline) =>
            timeline.hasOwnProperty('description')
        );
        return descriptionPanels;
    }
});
export const currentDescriptionPanelIdState = atom<string>({
    key: 'currentDescriptionPanelIdState',
    default: '1'
});
export const getDescriptionTimelineById = selectorFamily<ITimeline | null, string>({
    key: 'getDescriptionTimelineById',
    get: (descPanelId: string) => ({ get }: GetProps): ITimeline | null => {
        const descriptionTimelines: ITimeline[] = get(descriptionTimelinesState);
        return descriptionTimelines.find((descPanel) => descPanel.id.toString() === descPanelId.toString()) || null;
    },
    set: (descPanelId: string) => (
        {
            get,
            set
        }: {
            set: SetRecoilState;
            get: GetRecoilValue;
            reset: ResetRecoilState;
        },
        newValue: ITimeline | DefaultValue | null
    ) => {
        const steps = get(stepsState);
        if (newValue && !(newValue instanceof DefaultValue)) {
            const step = steps.find((step) => step._uuid === newValue.stepUuid);
            const filteredTimelines =
                step?.timeline.filter(
                    (timeline) => timeline.panel === 'description' && timeline.id !== newValue.id
                ) || [];
            const updatedTimelines = [...filteredTimelines, newValue];
            console.log(`getDescriptionTimelineById set--->`, {
                step,
                filteredTimelines,
                updatedTimelines
            });
            if (step) {
                set(getStepById(step.id), {
                    ...step,
                    timeline: updatedTimelines
                });
            }
        }
        else{

        }
    },
});
export const currentDescriptionPanelState = selector<ITimeline | null>({
    key: 'currentDescriptionPanelState',
    get: ({ get }: GetProps): ITimeline | null => {
        const currentDescriptionPanelId = get(currentDescriptionPanelIdState);
        const descTimeline = get(getDescriptionTimelineById(currentDescriptionPanelId));
        return descTimeline;
    },
    set: ({
        get,
        set,
    }: { 
        set: SetRecoilState; 
        get: GetRecoilValue; 
        reset: ResetRecoilState; 
    }, 
    newValue: ITimeline | DefaultValue | null) =>{
        const currentDescriptionPanelId = get(currentDescriptionPanelIdState);
        set(getDescriptionTimelineById(currentDescriptionPanelId), newValue);
    },
});
/**
 * @namespace CodeTimeline
 */
export const codeTimelinesState = selector<ITimeline[]>({
    key: `codeTimelinesState`,
    get: ({ get }: GetProps): ITimeline[] => {
        const currentTimeline: ITimeline[] = get(timelineState);
        const codeTimelines: ITimeline[] = currentTimeline.filter((timeline) =>
            timeline.hasOwnProperty('code')
        );
        return codeTimelines;
    }
});
export const currentCodePanelIdState = atom<string>({
    key: 'currentCodePanelId',
    default: '1'
});
export const getCodeTimelineById = selectorFamily<ITimeline | null, string>({
    // export const getCodeTimelineById = atomFamily<ITimeline|null, string>({
    key: 'getCodeTimelineById',
    // default: selectorFamily<ITimeline|null, string>({
    // key: 'getCodeTimelineById/default',
    get: (panelId: string) => ({ get }: GetProps): ITimeline | null => {
        const codeTimelines: ITimeline[] = get(codeTimelinesState);
        return codeTimelines.find((panel) => panel.id.toString() === panelId.toString()) || null;
    },
    set: (panelId: string) => (
        {
            get,
            set
        }: {
            set: SetRecoilState;
            get: GetRecoilValue;
            reset: ResetRecoilState;
        },
        newValue: ITimeline | DefaultValue | null
    ) => {
        const steps = get(stepsState);
        if (newValue && !(newValue instanceof DefaultValue)) {
            const step = steps.find((step) => step._uuid === newValue.stepUuid);
            const filteredTimelines =
                step?.timeline.filter(
                    (timeline) => timeline.panel === 'code' && timeline.id !== newValue.id
                ) || [];
            const updatedTimelines = [...filteredTimelines, newValue];
            console.log(`getCodeTimelineById set--->`, {
                step,
                filteredTimelines,
                updatedTimelines
            });
            if (step) {
                set(getStepById(step.id), {
                    ...step,
                    timeline: updatedTimelines
                });
            }
        } else {
        }
    }
    // }),
});
export const codeWithContentTimelinesState = selector<ICodeWithContent[]>({
    key: `codeWithContentTimelinesState`,
    get: ({ get }: GetProps): ICodeWithContent[] => {
        const codeTimelines: ITimeline[] = get(codeTimelinesState);

        const codeBlocks: ICodeWithContent[] = codeTimelines.map(
            (codePanel: ITimeline) => {
                const { id, start, duration, code } = codePanel;

                const {
                    template,
                    template_data,
                    partial_sections,
                    output
                } = code!;
                const DEBUG_templateUrl =
                    `https://610b8f8a2b6add0017cb392b.mockapi.io/template-hbs` ||
                    template;
                const DEBUG_partialUrl = `https://610df94348beae001747b98c.mockapi.io/partial-01_hbs`;
                const templateFile: IFile = get(getFile(DEBUG_templateUrl));

                /**
                 * @step handlebars
                 */
                let templateContent: string = templateFile.file_content;
                if (template_data) {
                    const hbsTemplate = hbsCompile(templateFile.file_content);
                    templateContent = hbsTemplate(template_data);
                }

                /*
            const getPartialFiles = partial_sections.map(partial => getFile(DEBUG_partialUrl || partial.template))
            const partialFiles:IFile[] = get(waitForAll(getPartialFiles));
            const partialContents:string[] = partialFiles.map(file => file.file_content);
            */
                const partials: IPartial[] = partial_sections.map((partial) => {
                    const partialFile: IFile = get(
                        getFile(DEBUG_partialUrl || partial.template)
                    );

                    /**
                     * @step handlebars
                     */
                    let partialContent: string = partialFile.file_content;
                    if (partial.template_data) {
                        const hbsTemplate = hbsCompile(
                            partialFile.file_content
                        );
                        partialContent = hbsTemplate(partial.template_data);
                    }

                    return {
                        partialId: partial.partial_id,
                        start: partial.start,
                        duration: partial.duration,
                        // template: partial.template,
                        partialContent
                    };
                });

                return <ICodeWithContent>{
                    id,
                    start,
                    duration,
                    templateContent,
                    partials
                };
            }
        );
        return codeBlocks;
    }
});
export const currentCodePanelState = selector<ITimeline | null>({
    key: 'currentCodePanelState',
    get: ({ get }: GetProps): ITimeline | null => {
        const currentCodePanelId = get(currentCodePanelIdState);
        const codeTimeline = get(getCodeTimelineById(currentCodePanelId));
        return codeTimeline;
    }
});
