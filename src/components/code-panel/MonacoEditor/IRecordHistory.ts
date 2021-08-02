/**
 * @author Mitchy 
 * The change history recorded by the change event from Monaco Editor
 * This is captured when the recording button is on 
 *
 * @export
 * @interface IRecordHistory
 */
export interface IRecordHistory{
	fileId: string;
	timestamp: number;
	timeSinceRecordingStarted?: number;
	currentProgressTime?: number;
	startLineNumber: number;
	endLineNumber: number;
	startColumn: number;
	endColumn: number;
	textChanged: string;
}
