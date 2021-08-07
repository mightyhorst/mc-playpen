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
	id: string;
	duration: number;
	title: string;
	icon?: string;
	colour?: string;
	scenes: IPlaybookScene[];
}

export interface IPlaybookScene {
	id: string;
	duration: number;
	title: string;
	steps: IPlaybookStep[];
}

export interface IPlaybookStep {
	id: string;
	duration: number;
	title: string;
	gitData: IPlaybookGitData,
	windowSettings?: IPlaybookJsonWindowSettings,
	timeline: IPlaybookTimeline[];
}


export interface IPlaybookGitData {
	branch?: string
}

export interface IPlaybookJsonWindowSettings {
	browser?: IPlaybookJsonWindowSetting,
	code?: IPlaybookJsonWindowSetting,
	description?: IPlaybookJsonWindowSetting,
	drawio?: IPlaybookJsonWindowSetting,
	finder?: IPlaybookJsonWindowSetting,
	playbar?: IPlaybookJsonWindowSetting,
	sketch?: IPlaybookJsonWindowSetting,
	terminal?: IPlaybookJsonWindowSetting,
	test?: IPlaybookJsonWindowSetting,
	trash?: IPlaybookJsonWindowSetting,
	trello?: IPlaybookJsonWindowSetting,
	video?: IPlaybookJsonWindowSetting,
	spreadsheet?: IPlaybookJsonWindowSetting,
}

export interface IPlaybookJsonWindowSetting {
	isClosed?: boolean;
	isMin?: boolean;
	isMax?: boolean;
	top?: number | string;
	left?: number | string;
	bottom?: number | string;
	right?: number | string;
	width?: number | string;
	height?: number | string;
	transitions?: IPlaybookJsonWindowSettingTransition[];
}

export interface IPlaybookJsonWindowSettingTransition {
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

export interface IPlaybookTimeline {
	id: string;
	panel: string;
	start: number | string;
	duration: number;
	end?: number;
	description?: IPlaybookTimelineDescriptionHtml[];
	code?: IPlaybookTimelineCodeData;
	startCode?: IPlaybookTimelineStartCodeData;
	browser?: IPlaybookTimelineBrowserData;
	terminal?: IPlaybookTimelineTerminalData;
	audio?: IPlaybookTimelineAudioData;
	spreadsheet?: IPlaybookTimelineSpreadsheetData[];
}

export interface IPlaybookTimelineDescriptionHtml {
	tag: string;
	txt?: string;
	kids?: IPlaybookTimelineDescriptionHtml[];
}

export interface IPlaybookTimelineStartCodeData {
	start: string;
	findReplace: string;
}

export interface IPlaybookTimelineCodeData {
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
	partial_sections: IPlaybookTimelineCodePartialData[];
	// -- The output file name (file name in fileStorage.app)
	output: string;
}

export interface IPlaybookTimelineCodePartialData {
	partial_id: string;    // -- The handle bar id wrapped in {{}} that we will need to search for in the master file
	start: number; // -- The start time to print this partial
	duration: number; 		// -- Duration of printing this partial
	template: string; 		// -- The file we should use as a template to compile
	template_data: { [handlebarId: string]: string }; // -- The data we will use to compile the template
}


export interface IPlaybookTimelineBrowserData {
	url: string;
	start?: number | string;
}

export interface IPlaybookTimelineTerminalData {
	commands: string[];
}

export interface IPlaybookTimelineAudioData {
	url?: string;
}

export interface IPlaybookTimelineSpreadsheetData{
	row: number;
	col: number;
	cellText?: string;
	styles?: SpreadsheetStyles[];
}
export interface SpreadsheetStyles{
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
