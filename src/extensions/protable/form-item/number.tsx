import React from "react";
import { Input, InputNumber, Select } from "antd";
import { parseSearchForm } from "@/utils/utils";
import { IAdminXFormItemProps } from "./data";
const { Option } = Select;

export const NumberFormItem: React.FC<IAdminXFormItemProps> = (props) => {
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
        <Option value="[gt]">{'>'}</Option>
        <Option value="[lt]">{'<'}</Option>
        <Option value="[gte]">{'>='}</Option>
        <Option value="[lte]">{'<='}</Option>
      </Select>
      <InputNumber
        {...fieldProps}
        style={{ width: '72%' }}
        defaultValue={parseFloat(parseSearchForm(props.value)[1]) || undefined}
        onChange={(v) => {
          const fieldVal = String(v);
          const opVal = parseSearchForm(props.value)[0];
          props.onChange?.(opVal + fieldVal || '');
        }}
      />
    </Input.Group>
  );
};
