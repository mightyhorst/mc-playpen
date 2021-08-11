import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {
    atom,
    selector,
    DefaultValue,
    AtomEffect
} from 'recoil';
import {
    /**
     * @namespace Playbook
     */
    IPlaybookJson,
    IPlaybookCategory,
    IPlaybookScene,
    ITimeline,
    ITime,
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
} from '../../../models';

import { GetProps, SetProps } from '../../types';

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

const atomFamilyEffect = (pathId:string):AtomEffect<IPlaybookJson> => ({
    node,
    trigger,
    setSelf,
    resetSelf,
    onSet,
}) => {

};
const atomEffect:AtomEffect<IPlaybookJson> = ({
    node,
    trigger,
    setSelf,
    resetSelf,
    onSet,
}) => {

};

/**
 * @namespace playbookJson
 */
export const playbookJsonState = atom({
    key: 'playbookJsonState',
    default: selector<IPlaybookJson>({
        key: 'playbookJsonState/default',
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
        },
        set: async ({get,set}: SetProps, updatedPlaybook: IPlaybookJson | DefaultValue) => {
            console.log(`%c Set PlaybookJson Should never fire`, 'background: red; color: white');
        },
    }),
    effects_UNSTABLE: [
        atomEffect,
    ],
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
    },
    set: ({get,set}: SetProps, updatedPlaybook: ITransformedPlaybook | DefaultValue) => {

    },
});
