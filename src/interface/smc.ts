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
