import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import BraftEditor, { EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';

export const TextEditor: React.FC<ISchemaFieldComponentProps> = props => {
  const onChange = (newVal: EditorState) => {
    props.mutators.change(newVal.toHTML());
  };
  const editorState = BraftEditor.createEditorState(props.value || '');
  return (
    <div className="ant-input" style={{ padding: '0px' }}>
      <BraftEditor
        contentStyle={{ height: '300px' }}
        value={editorState}
        onChange={onChange}
      />
    </div>
  );
};

export default TextEditor;
