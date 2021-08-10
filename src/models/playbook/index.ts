export interface IPlaybookIdsInProgress {
	categoryId?: string; // -- This is the id of the category being run
	sceneId?: string;    // -- This is the id of the scene being run
	stepId?: string;	 // -- This is the id of the step being run (sets the timeline)
	refreshToken?: number;
	readyToPlay: boolean; // -- If set to false then we are waiting for dependencies otherwise we can go ahead and play
	waitingForAppFiles: boolean;
	waitingForBlueprintFiles: boolean;
}

export interface IPlaybookJson {
	config?: any;
	categories?: IPlaybookCategory[];
}

export interface IPlaybookCategory {
	_uuid?: string; // <--- add a universally unique ID
	id: string;
	duration: number;
	title: string;
	icon?: string;
	colour?: string;
	scenes?: IPlaybookScene[];
}

export interface IPlaybookScene {
	_uuid?: string; // <--- add a universally unique ID
	catId?: string;
	id: string;
	duration: number;
	title: string;
	steps?: IPlaybookStep[];
}

export interface _IStep {
	_uuid?: string; // <--- add a universally unique ID
	catId?: string;
	sceneId?: string;
	id: string;
	duration: number;
	title: string;
	gitData?: IPlaybookGitData;
	windowSettings?: IWindowSettings;
}
export interface IPlaybookStep extends _IStep {
	timeline: ITimeline[];
}
export interface ITransformedStep extends IPlaybookStep {
	descPanels:IDescription[];
	codePanels:ICodePanel[];
	testPanels:ITest[];
	browserPanels:IBrowser[];
	cliPanels:ITerminal[];
	spreadsheetPanels:ISpreadsheet[];
	audioPanels:IAudio[];
	videoPanels:IVideo[];
}

export interface IPlaybookGitData {
	branch?: string
}

export interface IWindowSettings {
	browser?: IWindowSetting,
	code?: IWindowSetting,
	description?: IWindowSetting,
	drawio?: IWindowSetting,
	finder?: IWindowSetting,
	playbar?: IWindowSetting,
	sketch?: IWindowSetting,
	terminal?: IWindowSetting,
	test?: IWindowSetting,
	trash?: IWindowSetting,
	trello?: IWindowSetting,
	video?: IWindowSetting,
	spreadsheet?: IWindowSetting,
}

export interface IWindowSetting {
	isClosed?: boolean;
	isMin?: boolean;
	isMax?: boolean;
	top?: number | string;
	left?: number | string;
	bottom?: number | string;
	right?: number | string;
	width?: number | string;
	height?: number | string;
	transitions?: IWindowSettingTransition[];
}

export interface IWindowSettingTransition {
	start: number;
	end: number;
	isClosed?: boolean;
	isMin?: boolean;
	isMax?: boolean;
	top?: number | string;
	left?: number | string;
	bottom?: number | string;
	right?: number | string;
	width?: number | string;
	height?: number | string;
}


export interface ITimeline {
	_uuid?: string; // <--- add a universally unique ID
	stepUuid?: string; // <--- points to uuid from step ID
	id: string;
	panel: 'description'|'code'|'test'|'audio'|'spreadsheet'|'video'|'browser'|'terminal';
	start: number;
	duration: number;
	end?: number;
	comment?: string;
	description?: IDescriptionHtml[];
	code?: ICodeData;
	test?: ITestData;
	startCode?: IStartCodeData;
	browser?: IBrowserData;
	terminal?: ITerminalData;
	audio?: IAudioData;
	video?: IVideoData;
	spreadsheet?: ISpreadsheetData[];
}
export interface ITime{
	_uuid?: string; // <--- add a universally unique ID
	id: string;
	start: number;
	duration: number;
	end?: number;
}

export interface IDescriptionHtml {
	tag: string;
	txt?: string;
	kids?: IDescriptionHtml[];
}
/**
 * @namespace TimelinePanels 
 * @author Mitchy
 */
export type IDescription = ITime & {
	description: IDescriptionHtml[];
};

export interface IStartCodeData {
	start: string;
	findReplace: string;
}

export interface ICodeData {
    // -- The master file that we will be printing to the screen. Contains handlebar data points that are to be defined in template_data
    template: string; 
    /* -- 
        Data we will use when compiling the template. handlebarId will be {{handlebarId}} and it may have the data of:

            template_data : {
                title : "Just a unique title" // -- This is a hard coded string to be instantly added to the template
                partial_1 : "{{partial_1}}"   // -- This is a partial re-applying the handlebar partial id to allow the code panel to manually compile
            }
        
        by using the partial_1 example above, we can compile while maintaining the original handlebar points that we want to slow print later. Everything
        else will apply as if it were part of the template file
    */
	template_data: { [handlebarId: string]: string }; 
	// -- An array of all partials to slow print to the master
	partial_sections: ICodePartialData[];
	// -- The output file name (file name in fileStorage.app)
	output: string;
}

export interface ICodePartialData {
	partial_id: string;    // -- The handle bar id wrapped in {{}} that we will need to search for in the master file
	start: number; // -- The start time to print this partial
	duration: number; 		// -- Duration of printing this partial
	template: string; 		// -- The file we should use as a template to compile
	template_data: { [handlebarId: string]: string }; // -- The data we will use to compile the template
}

/**
 * @namespace TimelinePanels 
 * @author Mitchy
 */
export interface ICodePanel extends ITime{
	template: string; 
	template_data: { [handlebarId: string]: string }; 
	partial_sections: ICodePartialData[];
	output: string;
}
export interface ICodeWithContent{
    id: string;
    start: number;
    duration: number;
    // templateFile:IFile;
    // partialFiles:IFile[];
    templateContent: string;
    // partialContents: string[];
    partials:IPartial[];
}
export interface IPartial{
    partialId: string;
    start: number;
    duration: number;
    template?: string;
    template_data?: {
        [handlebarId: string]: string;
    };
    partialContent: string;
}
/**
 * @todo Add a test interface
 */
export interface ITestData{
	todo?: string; 
}
export interface ITest extends ITime{
	todo?: string; 
}

export interface IBrowserData {
	url: string;
	start?: number | string;
}
/**
 * @namespace TimelinePanels 
 * @author Mitchy
 */
export type IBrowser = ITime & {
	url: string;
};

export interface ITerminalData {
	commands: string[];
}
/**
 * @namespace TimelinePanels 
 * @author Mitchy
 */
export type ITerminal = ITerminalData & ITime;

export interface IAudioData {
	url?: string;
}
export interface IVideoData {
	url?: string;
}
/**
 * @namespace TimelinePanels 
 * @author Mitchy
 */
export type IAudio = IAudioData & ITime;
export type IVideo = IVideoData & ITime;

export interface ISpreadsheetData{
	row: number;
	col: number;
	cellText?: string;
	styles?: ISpreadsheetStyles[];
}
export interface ISpreadsheetStyles{
	bgcolor?: string;
	textwrap?: boolean;
	color?: string;
	border?: {
		top?: string[];
		bottom?: string[];
		left?: string[];
		right?: string[];
	},
}
/**
 * @namespace TimelinePanels 
 * @author Mitchy
 */
export type ISpreadsheet = ITime & {
	spreadsheet: ISpreadsheetData[];
};

/**
 * @namespace Dashboard
 */
export interface IPlaybookJsonOutline {
	_id: string;
	workspace: string;
	name : string;
	version: string;
	categories: IPlaybookJsonOutlineCategory[];
}

export interface IPlaybookJsonOutlineCategory {
	_id: string;
	title: string;
	duration: number; // -- Time in ms
	scenes: IPlaybookJsonOutlineScene[];
}

export interface IPlaybookJsonOutlineScene {
	_id : string;
	title: string;
	duration: number; // -- Time in ms
	steps : IPlaybookJsonOutlineSteps[];
}

export interface IPlaybookJsonOutlineSteps {
	_id: string;
	title : string;
	total_tests: number;
}
