import { FormMetaField } from "@/interface";
import React from "react";
import { DateFormItem } from "./date";
import { NumberFormItem } from "./number";
import { SelectFormItem } from "./select";
import { TextFormItem } from "./text";
import { TimeFormItem } from "./time";

function renderXFormItem(props: {
  field: FormMetaField;
  value?: any;
  onChange?: (val: any) => void;
}): React.ReactNode {
  const { field } = props;
  const fieldProps = {
    placeholder: field.placeholder || '请输入',
  }
  switch (field.component) {
    case 'Input':
      return (
        <TextFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'TextArea':
    case 'CodeEditor':
    case 'TextEditor':
    case 'FileUpload':
      return (
        <TextFormItem {...props} defaultOperator={'[like]'} fieldProps={fieldProps} />
      );
    case 'UintPicker':
    case 'IntPicker':
      return (
        <NumberFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'FloatPicker':
      return (
        <NumberFormItem {...props} defaultOperator={'[like]'} fieldProps={fieldProps} />
      );
    case 'Switch':
    case 'Checkbox':
      fieldProps['options'] = [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ];
      return (
        <SelectFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      )
    case 'VSelect':
    case 'HSelect':
      try {
        fieldProps['options'] = field.enum ? JSON.parse(field.enum) : [];
      } catch {
        fieldProps['options'] = [];
      };
      return (
        <SelectFormItem {...props} defaultOperator={'[in]'} fieldProps={fieldProps} />
      );
    case 'DateTimePicker':
      fieldProps['showTime'] = true;
      return (
        <DateFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'DatePicker':
      return (
        <DateFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'TimePicker':
      return (
        <TimeFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'WeekPicker':
      fieldProps['picker'] = 'week';
      return (
        <DateFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'MonthPicker':
      fieldProps['picker'] = 'month';
      return (
        <DateFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'QuarterPicker':
      fieldProps['picker'] = 'quarter';
      return (
        <DateFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    case 'YearPicker':
      fieldProps['picker'] = 'year';
      return (
        <DateFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
    default:
      return (
        <TextFormItem {...props} defaultOperator={'[eq]'} fieldProps={fieldProps} />
      );
  }
};

export default renderXFormItem;
