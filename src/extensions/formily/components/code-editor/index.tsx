import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import MonacoEditor from 'react-monaco-editor';

export const CodeEditor: React.FC<ISchemaFieldComponentProps> = props => {
  const { schema, mutators, value, } = props;
  const { language = 'json', theme = 'vs', height='200' } = schema['x-component-props'] || {};
  const onChange = (newVal: string) => {
    mutators.change(newVal);
  };
  return (
    <div className="ant-input" style={{ padding: '0px' }}>
      <MonacoEditor
        language={language}
        theme={theme}
        height={height}
        value={value || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
