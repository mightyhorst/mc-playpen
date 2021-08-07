/**
 * State interface for redux
 *
 * @export
 * @interface IFileStorageStore
 */
export interface IFileStorageStore {
	blueprint : IFileStorageEntry;
	app : IFileStorageEntry;
	/**
	 * @author Mitchy
	 * @desc added to debug
	 */
	showBlueprint?: boolean;
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Microservice Storage - API data
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
export interface IMicroserviceStorageSuccess {
	success: boolean;
	data? : any;
	err? : any;
}

export interface IMicroserviceStorageFile {
	name : string;
	path : string;
	is_directory : boolean;
	size_of : number;
	_id : number;
	_parentId? : number;
	file_type? : string;
	file_extension? : string;
}

export interface IMicroserviceStorageFileDetail {
	file_content : string;
	file_extension : string;
	file_type : string;
	mime_type : string;
	name : string;
	path : string;
	size_of : number;
}


export interface IMicroserviceStorageGitCheckout {
	branchChanged : boolean;
	files? : IMicroserviceStorageFile[];
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Models
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
export interface IFileStorageFile {
	id : string; 			 // -- Generated with path + name
	projectId: string | null;// -- The Project id of this file
	path : string; 			 // -- Path directory 
	name : string; 			 // -- Name of either a folder or file
	loading? : boolean; 	 // -- Treebeard property
	fetchComplete : boolean; // -- Flag which determines if the file has attempted a fetch from MS
	content? : any; 		   // -- Raw data for this file downloaded from the file storage MS
	compiledContent? : string; // -- Content that was compiled by handlebars using a .hbs file and json data
	compiledContentMetadata? : { // -- The cat/scene/step that set the compiledContent
		categoryId: string,
		sceneId: string,
		stepId: string
	},
	error? : any;
	errors? : IFileStorageFileErrors;
	dataPending? : IFileStorageFileDataPending;
	toggled? : boolean; 	 // -- Treebeard property
	active? : boolean;	     // -- Treebeard property
	decorators? : any; 		 // -- Treebeard property
	animations? : any;	 	 // -- Treebeard property
	isFolder : boolean; 	 // -- Either a folder or file
	fileType? : string;
	sizeOf? : number;
	children?: IFileStorageFile[];
	editing : boolean;  	 // -- Treebeard Custom property
	isSaved : boolean; 		 // -- Set to false if it was created by the code editor by a blueprint (in which case a * will be added to the name of the file)
	isAwaitingName: boolean;// -- When the file creation button is clicked and the entry appears without a name. A name will be required and if we blur the entry then the file entry will dissappear
	isStarterKit: boolean;  // -- Set when a starter kit is used in place of an app. When this is set to true then we will prevent ALL files being saved (as the data exists in a repo that may not belong to this logged in / guest user)
}

export interface IFileStorageFileErrors {
	name?: string;
	path?: string;
	content?: string;
}

export interface IFileStorageFileDataPending {
	name?: string;
	content?: any;
}

export interface IFileStorageEntry {
	pending: boolean;
	error?: any;
	rootFolder?: IFileStorageFile; // -- This will be reflecting the folder structure stored in storage microservice under projects/{id}/blueprints/{appType}/{app}
	nodeSelected?: IFileStorageFile; // -- This is just an entry inside (or the) rootFolder. This will allow us to unset the folder or file that is currently selected
	doesNotExistInStorage?: boolean;
}



/*
 	{
 		folders : [
 			{
 				folders: [

 				],
 				files : [

 				]
 			},
 			services : {
 				folders : [

 				],
 				files : [

 				]
 			}
 		],
 		files : [
 			{
 				name : '.dsStore',
 				pending : false,
 				content : "some data",
 			}
 		]
 	}

 */