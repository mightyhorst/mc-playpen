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
    DefaultValue,
    AtomEffect
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
    listTimelineState,
    getStepById,
    stepsState
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

import { GetProps, SetProps } from '../types';

import {
    transformedPlaybookState,
} from './playbookjson';


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
 * @exports playbookJson
 */
export * from './playbookjson';
export * from './category';
export * from './scene';
export * from './step';
export * from './timeline';
/**
 * @exports Timelines
 */
export * from './description';
// export * from './audio';
// export * from './browser';
// export * from './cli';
// export * from './code';
// export * from './spreadsheet';
// export * from './test';
// export * from './video';





/**
 * @namespace DescriptionTimelines
 *
export const descriptionsState = selector<ITimeline[]>({
    key: `descriptionsState`,
    get: ({ get }: GetProps): ITimeline[] => {
        const stepTimeline: ITimeline[] = get(timelineState);
        const descriptionPanels: ITimeline[] = stepTimeline.filter((timeline) =>
            timeline.hasOwnProperty('description')
        );
        return descriptionPanels;
    }
});
export const currentDescriptionIdState = atom<string>({
    key: 'currentDescriptionIdState',
    default: '1'
});
export const getDescriptionById = selectorFamily<ITimeline | null, string>({
    key: 'getDescriptionById',
    get: (descPanelId: string) => ({ get }: GetProps): ITimeline | null => {
        const descriptionTimelines: ITimeline[] = get(descriptionsState);
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
export const currentDescriptionState = selector<ITimeline | null>({
    key: 'currentDescriptionState',
    get: ({ get }: GetProps): ITimeline | null => {
        const currentDescriptionPanelId = get(currentDescriptionIdState);
        const descTimeline = get(getDescriptionById(currentDescriptionPanelId));
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
        const currentDescriptionPanelId = get(currentDescriptionIdState);
        set(getDescriptionById(currentDescriptionPanelId), newValue);
    },
});
*/
/**
 * @namespace CodeTimeline
 */
export const codeTimelinesState = selector<ITimeline[]>({
    key: `codeTimelinesState`,
    get: ({ get }: GetProps): ITimeline[] => {
        const currentTimeline: ITimeline[] = get(listTimelineState);
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
