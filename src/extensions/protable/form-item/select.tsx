import React from "react";
import { Input, Select } from "antd";
import { parseSearchForm } from "@/utils/utils";
import { FormMetaItemProps } from "./data";
const { Option } = Select;

export const SelectFormItem: React.FC<FormMetaItemProps> = (props) => {
  const { fieldProps, defaultOperator = '[eq]' } = props;
  const { options = [], ...others } = fieldProps || {};

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
        <Option value="[in]">{'IN'}</Option>
        <Option value="[nin]">{'NOT IN'}</Option>
      </Select>
      <Select
        {...others}
        allowClear
        style={{ width: '72%' }}
        value={parseSearchForm(props.value)[1]}
        onChange={(v) => {
          const fieldVal = v ? String(v) : '';
          const opVal = parseSearchForm(props.value)[0] || defaultOperator;
          props.onChange?.(opVal + fieldVal);
        }}
      >
        {
          options.map((opt: { value: React.ReactText; label: React.ReactNode; }, idx: number) => <Option key={idx} value={String(opt.value)}>{opt.label}</Option>)
        }
      </Select>
    </Input.Group>
  );
};
