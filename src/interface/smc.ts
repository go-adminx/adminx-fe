export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export interface SignUpParamsType {
  username: string;
  nickname: string;
  password: string;
  password2: string;
}

export interface CurrentUser {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  birthday?: number;
  sex?: number;
  avatar?: string;
  address?: string;
  statis?: number;
  lastLoginTime?: number;
  lastLoginIp?: string;
  remark?: string;
  isSysUser?: boolean;
  deptId?: number;
  access?: 'user' | 'guest' | 'admin';
  unreadCount?: number;
  roles?: RoleItem[];
}

export interface NoticeIconData {
  id: string;
  key: string;
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra: any;
  status: string;
}

export interface MenuItem {
  id: number;
  idx: number;
  key?: string;
  children?: MenuItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  path: string;
  pid: number;
  ident: string;
  [key: string]: any;
}

export interface RoleItem {
  name: string;
  remark?: string;
}

export interface FormMeta {
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
  fields?: FormMetaField[];
}

export interface FormMetaField {
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
  childFields?: FormMetaField[];
}
