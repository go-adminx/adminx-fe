import React from "react";
import moment from 'moment';
import { TimePicker, Input, Select } from "antd";
import { parseSearchForm } from "@/utils/utils";
import { FormMetaItemProps } from "./data";
const { Option } = Select;

export const TimeFormItem: React.FC<FormMetaItemProps> = (props) => {
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
      <TimePicker
        {...fieldProps}
        style={{ width: '72%' }}
        defaultValue={moment(parseSearchForm(props.value)[1])}
        onChange={(v) => {
          const fieldVal = String(v) || '';
          const opVal = parseSearchForm(props.value)[0];
          props.onChange?.(opVal + fieldVal);
        }}
      />
    </Input.Group>
  );
};
