import React from 'react';
import {
  // SchemaForm,
  SchemaField,
  FormPath,
} from '@formily/antd';
import { Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const SelfList = ({ schema, value, path, mutators }) => {
  // const props = schema.getExtendsComponentProps();
  // const dataSource = schema.enum || []
  return (
    <>
      {value.map((val, key) => {
        return (
          <div key={key} style={{ display: 'flex' }}>
            <SchemaField
              path={FormPath.parse(path).concat(key)}
              schema={schema.items}
            />
            <MinusCircleOutlined
              style={{ margin: '0 8px' }}
              onClick={() => {
                mutators.remove(key)
              }}
            />
          </div>
        )
      })}
      <Button
        type="dashed"
        onClick={() => {
          mutators.push(schema.items.getEmptyValue())
        }}
      >
        <PlusOutlined /> Add
      </Button>
    </>
  )
};
SelfList.isFieldComponent = true;

export default SelfList;
