import {
  useRef, 
  useState,
} from 'react';

/**
 * @requires Monaco
 */
import Editor, { 
  DiffEditor, 
  useMonaco, 
  loader, 
  Monaco,
} from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * @requires Services
 */
import {
  md5,
} from './md5';

/**
 * @requires Models
 */
import {
  IRecordHistory,
} from '../../../models';
import {IFile} from './IFile';
import {files} from './files';
import { useRecording, useRecordingTimer } from '../../../hooks';
const fileIds:string[] = Object.keys(files);

const getTimestamp = () => (new Date()).getTime();

/**
 * @interface MonacoEditorProps
 */
interface MonacoEditorProps{
    height?: string;
    language?: string;
    value?: string;
}
/**
 * @function MonacoEditor
 * @param height 
 * @param language 
 * @param value 
 */
export function MonacoEditor({
    height,
    language,
    value,
}: MonacoEditorProps) {

  /**
   * @refs
   */
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  /**
   * @state
   */
  // const [
  //   recordingStartedTimestamp,
  //   setRecordingStartedTimestamp,
  // ] = useState<number>();
  // const [
  //   recordingHistory, 
  //   setRecordingHistory,
  // ] = useState<IRecordHistory[]>([]);
  const {
    recordingStartTimestamp,
    setRecordingStartTimestamp,
    recordingHistory,
    setRecordingHistory,
  } = useRecording();
  const {
    setDuration,
  } = useRecordingTimer();

  /**
   * @namespace files
   */
  const [fileId, setFileId] = useState("script.js");
  const file:IFile = files[fileId];

  /**
   * @event onMount
   * @param {IEditor} editor - editor
   * @param {Monaco} monaco - monanco
   */
  function onMount(
    editor: monaco.editor.IStandaloneCodeEditor, 
    monaco: Monaco,
  ) {
    editorRef.current = editor; 
    monacoRef.current = monaco; 

    const KeyMod = monaco.KeyMod;
    const KeyCode = monaco.KeyCode;
    
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, () => {
			const textContents = editor.getModel().getValue();
      console.log('CTRL-S', {
        textContents,
        md5: md5(textContents),
      });
    });
  }
  /**
   * @event onChange
   * @param value - value of the IDE
   * @param modelChangedEvent - model content changed event
   */
  function onChange(
    value:string|undefined, 
    modelChangedEvent:monaco.editor.IModelContentChangedEvent,
  ){
    console.log({value});
    console.log({event: modelChangedEvent});
    let recordingStarted:number;
    if(!recordingStartTimestamp){
      recordingStarted = getTimestamp();
      setRecordingStartTimestamp(recordingStarted);
    }
    else{
      recordingStarted = recordingStartTimestamp;
    }

    const changes: monaco.editor.IModelContentChange[] = modelChangedEvent.changes;
    changes.forEach((change:monaco.editor.IModelContentChange) => {
      /**
       * @model capture the changed text, position and time 
       */
      const { 
        startLineNumber,
        endLineNumber,
        startColumn,
        endColumn
      } = change.range;
      const textChanged = change.text;
      const timestamp = getTimestamp() - recordingStarted;

      const recordingModel:IRecordHistory = {
        fileId,
        timestamp,
        startLineNumber,
        endLineNumber,
        startColumn,
        endColumn,
        textChanged
      };
      recordingHistory.push(recordingModel);
    });
    setRecordingHistory(recordingHistory);
    if(recordingHistory.length > 0){
      setDuration(recordingHistory[recordingHistory.length - 1].timestamp);
    }
  }
  /**
   * @event onValidate
   * @param markers - list of errors
   */
  function onValidate(markers: monaco.editor.IMarker[]){
    if(markers.length > 0)
      console.log({
        markers,
      });
  }

  /**
   * @render
   */
  return (
    <section>
      <pre>
        {JSON.stringify(recordingStartTimestamp, null, 4)}
        {JSON.stringify(recordingHistory, null, 4)}
      </pre>
      <div className="btnFiles">
        {
          fileIds.map(fileId => {
            return (
              <button 
                key={fileId}
                onClick={()=>setFileId(fileId)}
              >
                {fileId}
              </button>
            );
          })
        }
      </div>
      <Editor
        height={height || "90vh"}
        theme={'vs-light' || "vs-dark"}
        onMount={onMount}
        onChange={onChange}
        onValidate={onValidate}
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        value={value}
      />
    </section>
  );
}
