import {useRef, useState} from 'react';

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
} from './IRecordHistory';
import {files, IFile} from './files';
type IEditor = monaco.editor.IStandaloneCodeEditor;

const getTimestamp = () => (new Date()).getTime();

interface MonacoEditorProps{
    height?: string;
    language?: string;
    value?: string;
}
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
  const [
    recordingStartedTimestamp,
    setRecordingStartedTimestamp,
  ] = useState<number>();
  const [
    recordingHistory, 
    setRecordingHistory,
  ] = useState<IRecordHistory[]>([]);
  const [fileName, setFileName] = useState("script.js");
  const file:IFile = files[fileName];

  /**
   * @event onMount
   * @param {IEditor} editor - editor
   * @param {Monaco} monaco - monanco
   */
  function onMount(
    editor: IEditor, 
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
    if(!recordingStartedTimestamp){
      setRecordingStartedTimestamp(getTimestamp());
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
      const timestamp = (new Date()).getTime();

      const recordingModel:IRecordHistory = {
        fileId: this.state.activeFileId,
        timestamp,
        // timeSinceRecordingStarted: timestamp - recordingStartedTimestamp,
        currentProgressTime: this.props.currentProgressTime,
        startLineNumber,
        endLineNumber,
        startColumn,
        endColumn,
        textChanged
      }
    });

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
   <Editor
     height={height || "90vh"}
     defaultLanguage={language || "typescript"}
     defaultValue={value || "// ball sack monster"}
     theme={'vs-light' || "vs-dark"}
     value={value}
     onMount={onMount}
     onChange={onChange}
     onValidate={onValidate}
   />
  );
}
