declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';

// google analytics interface
interface GAFieldsObject {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
}
interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
}

declare let ga: Function;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare module 'form-render/lib/antd' {
  import React from 'react';
  export interface FRProps {
    schema: object;
    formData: object;
    onChange(data?: object): void;
    name?: string;
    column?: number;
    uiSchema?: object;
    widgets?: any;
    FieldUI?: any;
    fields?: any;
    mapping?: object;
    showDescIcon?: boolean;
    showValidate?: boolean;
    displayType?: string;
    onValidate: any;
    readOnly?: boolean;
    labelWidth?: number | string;
  }
  export interface FRWidgetProps {
    default?: any;
    description?: string;
    displayType?: string;
    disabled?: boolean;
    hidden?: boolean;
    name: string;
    onChange(name: string, valaue: any): void;
    options?: string;
    readonly?: boolean;
    required?: boolean;
    rootValue?: any;
    schema?: object;
    value?: any;
  }
  class FormRender extends React.Component<FRProps> {}
  export default FormRender;
}
