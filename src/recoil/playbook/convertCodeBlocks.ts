import {v4 as uuid} from 'uuid';
import {compile as hbsCompile} from 'handlebars';
import {
    selectorFamily,
} from 'recoil';
import {
    ITimeline,
    ICodeWithContent,
    IFile,
    IPartial,
} from '../../models';
import {
    GetProps,
} from '.';
import {
    getFile,
} from '../files';

export const convertCodeBlock = selectorFamily<ICodeWithContent, ITimeline>({
    key: 'convertCodeBlock',
    get: (codePanel:ITimeline) => ({get}: GetProps):ICodeWithContent => {
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
        
        /**
         * @step Partials
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

        return <ICodeWithContent>{
            id,
            start,
            duration,
            templateContent,
            partials,
        }
        
    }
});
export const convertCodeBlocks = selectorFamily({
    key: 'convertCodeBlocks',
    get: (codePanels:ITimeline[]) => ({get}: GetProps) => {
        const codeBlocks:ICodeWithContent[] = codePanels.map((codePanel:ITimeline) => {
            return get(convertCodeBlock(codePanel));
        });
        return codeBlocks;
    }
});