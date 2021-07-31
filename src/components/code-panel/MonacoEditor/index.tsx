import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

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
  return (
   <Editor
     height={height || "90vh"}
     defaultLanguage={language || "javascript"}
     defaultValue={value || "// ball sack monster"}
     theme="vs-dark"
     value={value}
   />
  );
}
