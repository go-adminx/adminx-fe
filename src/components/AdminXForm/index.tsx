import React from 'react';
import { history, useParams } from 'umi';
import { Button } from 'antd';
import {
  registerFormFields,
  ISchema,
  SchemaForm,
  FormButtonGroup,
  Submit,
  Reset
} from '@formily/antd';
import {
  Input,
  Select,
  Password,
  NumberPicker,
  Switch,
  Checkbox,
  Radio,
  DatePicker,
  TimePicker,
  Range,
  Rating,
  ArrayCards,
  ArrayTable
} from '@formily/antd-components';
import {
  CodeEditor,
  TextEditor,
  Link,
  FileUpload,
} from '@/extensions/formily/components';
import 'antd/dist/antd.css';
import { IAdminXFormField, IAdminXForm } from './data';
import camelCase from 'lodash/camelCase';

const setup = () => {
  registerFormFields({
    Input,
    TextArea: Input.TextArea,
    CodeEditor,
    TextEditor,
    Password,
    UintPicker: NumberPicker,
    IntPicker: NumberPicker,
    FloatPicker: NumberPicker,
    Switch,
    Checkbox,
    VSelect: Select,
    HSelect: Radio.Group,
    CheckboxGroup: Checkbox.Group,
    DateTimePicker: DatePicker,
    DatePicker,
    TimePicker,
    WeekPicker: DatePicker.WeekPicker,
    MonthPicker: DatePicker.MonthPicker,
    QuarterPicker: DatePicker,
    YearPicker: DatePicker.YearPicker,
    Slider: Range,
    Rating,
    ArrayCards,
    ArrayTable,
    Link,
    FileUpload,
  })
}
setup();

const trans2Prop = (field: IAdminXFormField) => {
  let defaultComp = field.component;
  if (field.component === 'HSelect' && field.multiple) {
    defaultComp = 'CheckboxGroup';
  } else if (field.component === 'Section') {
    defaultComp = 'card';
  } else if (field.component === 'UnassociatedLink' || field.component === 'AssociatedLink') {
    defaultComp = 'Link';
  }

  // const customizeCompProps = {}
  let defaultCompProps = {}
  if (defaultComp === 'UintPicker') {
    defaultCompProps = {
      min: 0,
    }
  } else if (defaultComp === 'FloatPicker') {
    defaultCompProps = {
      precision: 1,
    }
  } else if (defaultComp === 'VSelect' && field.multiple) {
    defaultCompProps = {
      mode: 'multiple',
    }
  } else if (defaultComp === 'DateTimePicker') {
    defaultCompProps = {
      showTime: true,
    }
  } else if (defaultComp === 'QuarterPicker') {
    defaultCompProps = {
      picker: 'quarter',
    }
  } else if (defaultComp === 'Link') {
    defaultCompProps = {
      multiple: field.multiple,
      configID: field.id,
      fieldComponent: field.component,
      fieldType: field.type,
      linkModel: field.linkModel,
      linkValueField: field.linkValueField,
      linkLableField: field.linkLabelField,
    }
  } else if (defaultComp === 'FileUpload') {
    const { module, app, name } = useParams<{module: string, app: string, name: string}>();
    if (name) {
      defaultCompProps = {
        module: 'settings',
        app: name,
      }
    } else {
      defaultCompProps = {
        module,
        app,
      }
    }
    if (field.multiple) {
      defaultCompProps['limit'] = field.maximum;
    } else {
      defaultCompProps['limit'] = 1;
    }
  }
  const propObj: ISchema = {
    title: field.label || undefined,
    description: field.description || undefined,
    default: field.default ? (field.type && ['float', 'int', 'uint'].includes(field.type) ? parseFloat(field.default) : field.default) : undefined,
    maximum: field.type && ['float', 'int', 'uint'].includes(field.type) ? field.maximum || undefined : undefined,
    minimum: field.type && ['float', 'int', 'uint'].includes(field.type) ? field.minimum || undefined : undefined,
    maxLength: field.type === 'string' ? field.maximum || undefined : undefined,
    minLength: field.type === 'string' ? field.minimum || undefined : undefined,
    maxItems: field.maximum || undefined,
    minItems: field.minimum || undefined,
    uniqueItems: field.uniqueItems,
    pattern: field.pattern,
    required: field.required,
    format: field.format || undefined,
    editable: field.status === 'Edit',
    readOnly: field.status === 'Disabled',
    visible: field.status !== 'Hidden',
    'x-component': defaultComp,
    'x-mega-props': {
      span: field.span,
    },
    'x-rules': field.rules || undefined,
  }

  if (field.component === 'HSelect' || field.component === 'VSelect') {
    try {
      propObj.enum = JSON.parse(field.enum);
    } catch (error) {
      console.error(`"${field.key}"字段相关的枚举选项书写错误，请检查！`);
    }
  }

  if (field.linkages) {
    try {
      propObj['x-linkages'] = JSON.parse(field.linkages);
    } catch (error) {
      console.error(`"${field.key}"字段联动规则书写错误，请检查！`);
    }
  }

  let componentProps: object = {};
  if (field.componentProps) {
    try {
      componentProps = JSON.parse(field.componentProps);
    } catch (error) {
      console.error(`"${field.key}"字段组件属性书写错误，请检查！`);
    }
  }

  if (defaultComp !== 'ArrayTable') {
    propObj['x-component-props'] = {
      title: field.label || undefined,
      description: field.description || undefined,
      placeholder: field.placeholder || undefined,
      style: field.style || undefined,
      className: field.className || undefined,
      ...defaultCompProps,
      ...componentProps,
    };
    propObj['x-props'] = {
      triggerType: field.triggerType || undefined,
      // addonBefore: field.addonBefore,
      addonAfter: field.addonAfter || undefined,
    };
  }

  // if (field.multiple && hasListComp.includes(field.component)) {
  //   return {

  //   }
  // }

  return propObj;
}

const trans2Schema = (viewColumns: number, fields: IAdminXFormField[]) => {
  if (viewColumns < 1) {
    viewColumns = 1;
  }
  const rootFieldProp = fields.length && fields[0].component !== 'Section' ? {
    [`${fields[0].key}-layout`]: {
      key: `${fields[0].key}-layout`,
      type: "object",
      name: `${fields[0].key}-layout`,
      "x-component": "mega-layout",
      "x-component-props": {
        autoRow: true,
        grid: true,
        full: true,
        labelAlign: "top",
        columns: viewColumns,
        responsive: { lg: viewColumns, m: Math.round(viewColumns/2), s: 1 }
      },
      properties: {}
    }
  } : {};
  const filedProp: any = {};
  let filedPropTemp: any = {};
  let filedPropTempName: string = '';
  fields.forEach((field) => {
    if (field.key) {
      if (field.component === 'Section') {
        if (Object.keys(filedPropTemp).length) {
          filedProp[filedPropTempName] = filedPropTemp
        }
        filedPropTempName = field.key
        filedPropTemp = {
          ...trans2Prop(field),
          properties: {
            [`${filedPropTempName}-layout`]: {
              key: `${filedPropTempName}-layout`,
              type: "object",
              name: `${filedPropTempName}-layout`,
              "x-component": "mega-layout",
              "x-component-props": {
                autoRow: true,
                grid: true,
                full: true,
                labelAlign: "top",
                columns: viewColumns,
                responsive: { lg: viewColumns, m: Math.round(viewColumns/2), s: 1 }
              },
              properties: {}
            }
          }
        }
      } else if (!Object.keys(filedPropTemp).length) {
        rootFieldProp[`${fields[0].key}-layout`].properties[field.key]  = trans2Prop(field)
        if (field.childFields) {
          const itemProp: any = {
            type: 'object',
            properties: {}
          }
          field.childFields.forEach((f) => {
            itemProp.properties[f.key] = trans2Prop(f);
          });
          rootFieldProp[`${fields[0].key}-layout`].properties[field.key].items = itemProp;
        }
      } else {
        filedPropTemp.properties[`${filedPropTempName}-layout`].properties[field.key] = trans2Prop(field)
        if (field.childFields) {
          const itemProp: any = {
            type: 'object',
            properties: {}
          }
          field.childFields.forEach((f) => {
            itemProp.properties[f.key] = trans2Prop(f);
          });
          filedPropTemp.properties[`${filedPropTempName}-layout`].properties[field.key].items = itemProp;
        }
      }
    }
  })
  if (Object.keys(filedPropTemp).length) {
    filedProp[filedPropTempName] = filedPropTemp;
  }
  return {
    type: 'object',
    properties: {
      ...rootFieldProp,
      ...filedProp,
    }
  }
}

interface AdminXFormProps {
  formmeta?: Partial<IAdminXForm>;
  formdata?: any;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  showLoading?: boolean;
}

const AdminXForm: React.FC<AdminXFormProps> = (props) => {
  const { formmeta, formdata = {}, onSubmit, onCancel, showLoading } = props;
  const { viewColumns = 2, fields = [] } = formmeta || {};
  const schema = trans2Schema(viewColumns, fields);
  // console.info(formmeta);
  // console.log(JSON.stringify(schema));
  // console.log(formdata);
  return (
    <SchemaForm
      schema={schema}
      initialValues={formdata}
    >
      <FormButtonGroup align="right" sticky>
        {formmeta?.viewMode === "Page" ?
          <Button onClick={() => history.goBack()}>返回</Button> :
          <Button onClick={onCancel}>取消</Button>}
        <Reset>重置</Reset>
        <Submit
          onSubmit={onSubmit}
          showLoading={showLoading}
        >
          保存
        </Submit>
      </FormButtonGroup>
    </SchemaForm>
  )
}

export default AdminXForm;
