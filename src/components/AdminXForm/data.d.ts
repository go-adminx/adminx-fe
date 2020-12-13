export interface IAdminXForm {
  id: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  createdBy: string;
  updatedBy: string;
  title?: string;
  modelName: string;
  status: string;
  viewMode: string;
  viewColumns: number;
  fields?: IAdminXFormField[];
}

export interface IAdminXFormField {
  id: number;
  pid?: number;
  pfd?: string;
  idx?: number;
  key: string;
  label?: string;
  type: string;
  required: boolean;
  component: string;
  componentProps?: any;
  multiple?: boolean;
  enum?: string;
  span?: number;
  width?: string;
  inList?: boolean;
  ellipsis?: boolean;
  copyable?: boolean;
  inQuery?: boolean;
  queryIdx?: number;
  status: string;
  description?: string;
  placeholder?: string;
  addonBefore?: string;
  addonAfter?: string;
  style?: string;
  className?: string;
  triggerType?: string;
  format?: string;
  default?: any;
  maximum?: number;
  minimum?: number;
  pattern?: string;
  rules?: string;
  linkages?: string;
  uniqueItems: boolean;
  linkModel?: string;
  linkLabelField?: string;
  linkValueField?: string;
  ignoreMigrate?: boolean;
  childFields?: IAdminXFormField[];
}
