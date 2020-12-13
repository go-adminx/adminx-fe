import { FRWidgetProps } from 'form-render/lib/antd';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export const CodeEditor: React.FC<FRWidgetProps> = props => {
  const onChange = (newVal: string) => {
    props.onChange(props.name, newVal);
  };
  return (
    <div className="ant-input" style={{ padding: '0px' }}>
      <MonacoEditor
        language="json"
        theme="vs"
        height="80"
        value={props.value || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
