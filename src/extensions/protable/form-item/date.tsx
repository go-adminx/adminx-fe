import React, { useState } from "react";
import moment from 'moment';
import { DatePicker, Input, Select } from "antd";
import { parseSearchForm } from "@/utils/utils";
import { FormMetaItemProps } from "./data";
const { Option } = Select;

declare type IRangeDate = [moment.Moment, moment.Moment] | null;

export const DateFormItem: React.FC<FormMetaItemProps> = (props) => {
  const { fieldProps = {}, defaultOperator = '[eq]' } = props;
  const [operator, setOperator] = useState(defaultOperator);

  const combineRangeDates = (toTimestamp: boolean, dates0?: moment.Moment, dates1?: moment.Moment) => {
    if (dates0 && !dates1) {
      return toTimestamp ? `${Math.round(moment(dates0).valueOf()/1000)},""` : `${moment(dates1)},""`;
    } else if (dates1 && !dates0) {
      return toTimestamp ? `"",${Math.round(moment(dates1).valueOf()/1000)}` : `"",${moment(dates1)}`;
    } else if (dates0 && dates1) {
      return toTimestamp ? `${Math.round(moment(dates0).valueOf()/1000)},${Math.round(moment(dates1).valueOf()/1000)}` : `${moment(dates0)},${moment(dates1)}`;
    } else {
      return '';
    }
  }

  const parseRangeDates = () => {
    const rawVal = parseSearchForm(props.value)[1];
    if (rawVal && rawVal.split(',').length === 2) {
      const val = rawVal.split(',');
      const dates: IRangeDate = [
        fieldProps.showTime ? moment(parseInt(val[0])*1000) : moment(val[0]),
        fieldProps.showTime ? moment(parseInt(val[1])*1000) : moment(val[1])
      ]
      return dates;
    }
    return null;
  }

  const parseDate = () => {
    const rawVal = parseSearchForm(props.value)[1];
    if (rawVal && rawVal.split(',').length === 1) {
      const val = rawVal.split(',');
      return fieldProps.showTime ? moment(parseInt(val[0])*1000) : moment(val[0])
    }
    return undefined;
  }

  const PickerWithOp: React.FC<{
    type: string;
  }> = (rest) => {
    if (['[btwn]', '[nbtwn]'].includes(rest.type)) {
      return (
        <DatePicker.RangePicker
          {...fieldProps}
          placeholder={['开始时间', '结束时间']}
          style={{ width: '72%' }}
          defaultValue={parseRangeDates()}
          onChange={(dates) => {
            const fieldVal = combineRangeDates(fieldProps.showTime, dates ? dates[0] || undefined : undefined, dates ? dates[1] || undefined : undefined);
            props.onChange?.(operator + fieldVal || '');
          }}
        />
      );
    }
    return (
      <DatePicker
        {...fieldProps}
        style={{ width: '72%' }}
        defaultValue={parseDate()}
        onChange={(v) => {
          const fieldVal = fieldProps.showTime ? Math.round(moment(v).valueOf() / 1000).toString() : String(v);
          props.onChange?.(operator + fieldVal || '');
        }}
      />
    );
  };

  return (
    <Input.Group compact>
      <Select
        defaultValue={operator}
        style={{ width: '28%', textAlign: 'center' }}
        onChange={(v) => {
          const fieldVal = parseSearchForm(props.value)[1];
          setOperator(v);
          props.onChange?.(v + fieldVal || '');
        }}
      >
        <Option value="[eq]">{'='}</Option>
        <Option value="[ne]">{'!='}</Option>
        <Option value="[gt]">{'>'}</Option>
        <Option value="[lt]">{'<'}</Option>
        <Option value="[gte]">{'>='}</Option>
        <Option value="[lte]">{'<='}</Option>
        <Option value="[btwn]">{'BETWEEN'}</Option>
        <Option value="[nbtwn]">{'NOT BETWEEN'}</Option>
      </Select>
      <PickerWithOp type={operator} />
    </Input.Group>
  );
};
