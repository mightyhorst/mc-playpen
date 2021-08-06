import { useCallback, useEffect, useRef, useState } from 'react';
import {
  usePrevious,
} from '../../../hooks';

/**
 * @requires Monaco
 */
import Editor, {
    DiffEditor,
    useMonaco,
    loader,
    Monaco
} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import * as monaco from 'monaco-editor';

/**
 * @requires Services
 */
import { md5 } from './md5';

/**
 * @requires Models
 */
import { IRecordHistory } from '../../../models';
import { IFile } from './IFile';
import { files } from './files';
import { useRecording, useRecordingTimer } from '../../../hooks';
const fileIds: string[] = Object.keys(files);

const getTimestamp = () => new Date().getTime();

/**
 * @interface MonacoEditorProps
 */
interface MonacoEditorProps {
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
export function MonacoEditor({ height, language, value }: MonacoEditorProps) {
    /**
     * @refs
     */
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);

    /**
     * @callback
     */
    const callbackPrint = useCallback((toPrint: IRecordHistory[]) => {
      console.log('%c_toPrint --->', 'background: black; color: #fff', toPrint);
    }, []);

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
        isRecording,
        recordingStartTimestamp,
        setRecordingStartTimestamp,
        recordingStartText,
        setRecordingStartText,
        recordingHistory,
        setRecordingHistory,
    } = useRecording();
    const {
        setDuration,
        isActive,
        currentTime,
        percentage,
        isFinished,
        isPlaying,
        /**
         * @namespace autoPrint
         */
        toPrint,
        notPrinted,
        setToPrint,
        setNotPrinted,
        isFirstPlay,
    } = useRecordingTimer({
      callbackPrint: callbackPrint,
    });
    const [lastTimestamp, setLastTimestamp] = useState<number>(0);

    /**
     * @namespace files
     */
    const [fileId, setFileId] = useState('script.js');
    const file: IFile = files[fileId];

    /**
     * @function convert to range
     */
    const recordToRange = useCallback((record:IRecordHistory)=>{
        let {
            textChanged: text,
            startColumn,
            endColumn,
            startLineNumber,
            endLineNumber
        } = record;
        
        const range = new monaco.Range(
            startLineNumber,
            startColumn,
            endLineNumber,
            endColumn,
        );
        return {
            range,
            text,
        };
    }, []);

    /**
     * @function print the queue 
     */
    const printQueue = useCallback(() => {
      const editor = editorRef.current;
        if (editor) {
          const model = editor.getModel();
          if(model){
            for (let i = 0; i < toPrint.length; i++) {
              const record:IRecordHistory = toPrint[i];
              const textRange = recordToRange(record);
              model.applyEdits([textRange]);
              toPrint.shift();
              setToPrint(toPrint);
            }
          }
        }
    }, [
      toPrint,
      recordToRange,
      setToPrint,
    ]);
    useEffect(()=>{
      printQueue();
    }, [
      printQueue,
    ]);

    /**
     * @step start
     */
    useEffect(()=>{
      if(isFirstPlay && currentTime === 0){
        console.log(`%c isFirstPlay`, `background: #3c3; color: white`, {currentTime});
        console.log(`%c recordingStartText`, `background: #3c3; color: white`, recordingStartText);
        const editor = editorRef.current;
        if (editor) {
          const model = editor.getModel();
          if(model){
              model.setValue(recordingStartText);
          }
        }
      }
      else{
      }
    }, [
      isFirstPlay,
      currentTime,
      recordingStartText,
    ]);
    
     /**
     * @step 
     */
    useEffect(() => {
        if (isActive() || !isFinished) {
            const editor = editorRef.current;
            if (editor) {
                const model = editor.getModel();
                if(model){
                    // model.setValue(recordingStartText);
                    // model.applyEdits(ranges);
                    
                }
            }
        } else {
            // console.log({
            //   currentTime,
            //   isActive: isActive(),
            //   percentage,
            // })
            // --- reset 
            
        }
    }, [isActive, currentTime, recordingHistory, percentage, isFinished, lastTimestamp, setLastTimestamp]);

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
            const textContents = editor.getModel()?.getValue();
            console.log('CTRL-S', {
                textContents,
                md5: md5(textContents),
            });
        });
    }

    /**
     * @event isRecording changes
     */
    const prevIsRecording = usePrevious(isRecording);
    useEffect(()=>{
        if(!prevIsRecording && isRecording){
          console.log('%c Start recording', 'background: red; color: white', {prevIsRecording, isRecording})
          setRecordingStartTimestamp(getTimestamp());
          const textContents = editorRef.current?.getModel()?.getValue();
          if(textContents){
            setRecordingStartText(textContents);
          }
        }
      }, 
      [
        prevIsRecording,
        isRecording,
        setRecordingStartText,
      ]
    );

    /**
     * @event onChange
     * @param value - value of the IDE
     * @param modelChangedEvent - model content changed event
     */
    function onChange(
        value: string | undefined,
        modelChangedEvent: monaco.editor.IModelContentChangedEvent,
    ) {
        if (!isRecording) return;

        let recordingStarted: number;
        if (!recordingStartTimestamp) {
            recordingStarted = getTimestamp();
            setRecordingStartTimestamp(recordingStarted);
           
        } else {
            recordingStarted = recordingStartTimestamp;
        }

        const changes: monaco.editor.IModelContentChange[] = modelChangedEvent.changes;
        changes.forEach((change: monaco.editor.IModelContentChange) => {
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

            const recordingModel: IRecordHistory = {
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
        if (recordingHistory.length > 0) {
            setDuration(
                recordingHistory[recordingHistory.length - 1].timestamp
            );
        }
    }
    /**
     * @event onValidate
     * @param markers - list of errors
     */
    function onValidate(markers: monaco.editor.IMarker[]) {
        if (markers.length > 0)
            console.log({
                markers
            });
    }

    /**
     * @render
     */
    return (
        <section>
            <div className="btnFiles">
                {fileIds.map((fileId) => {
                    return (
                        <button key={fileId} onClick={() => setFileId(fileId)}>
                            {fileId}
                        </button>
                    );
                })}
            </div>
            <Editor
                height={height || '90vh'}
                theme={'vs-light' || 'vs-dark'}
                onMount={onMount}
                onChange={onChange}
                onValidate={onValidate}
                path={file.name}
                defaultLanguage={file.language}
                defaultValue={file.value}
                value={value}
            />
            <article style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '200px',
              height: '100vh',
              background: 'rgba(0,0,0,.7)',
              color: 'white',
            }}>
              {toPrint.map(t=>t.textChanged).join('')}
            </article>
            <article style={{
              position: 'fixed',
              right: 0,
              top: 0,
              width: '200px',
              height: '100vh',
              background: 'rgba(0,0,0,.7)',
              color: 'white',
            }}>
              {notPrinted.map(t=>t.textChanged).join('')}
            </article>
        </section>
    );
}
