import React from "react";
import { Input, Select } from "antd";
import { parseSearchForm } from "@/utils/utils";
import { FormMetaItemProps } from "./data";
const { Option } = Select;

export const TextFormItem: React.FC<FormMetaItemProps> = (props) => {
  const { fieldProps, defaultOperator = '[eq]' } = props;

  return (
    <Input.Group compact>
      <Select
        defaultValue={parseSearchForm(props.value)[0] || defaultOperator}
        style={{ width: '28%', textAlign: 'center' }}
        onChange={(v) => {
          const fieldVal = parseSearchForm(props.value)[1];
          props.onChange?.(v + fieldVal || '');
        }}
      >
        <Option value="[eq]">{'='}</Option>
        <Option value="[ne]">{'!='}</Option>
        <Option value="[like]">{'LIKE'}</Option>
        <Option value="[ilike]">{'ILIKE'}</Option>
        <Option value="[nlike]">{'NOT LIKE'}</Option>
        <Option value="[nilike]">{'NOT ILIKE'}</Option>
      </Select>
      <Input
        {...fieldProps}
        allowClear
        style={{ width: '72%' }}
        value={parseSearchForm(props.value)[1]}
        onChange={(e) => {
          const fieldVal = e.target.value || '';
          const opVal = parseSearchForm(props.value)[0];
          props.onChange?.(opVal + fieldVal);
        }}
      />
    </Input.Group>
  );
};
