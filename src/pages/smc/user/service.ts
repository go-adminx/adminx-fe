import { request } from 'umi';
import { NoticeIconData, LoginParamsType, SignUpParamsType } from '@/interface';

export async function UserLogin(params: LoginParamsType) {
  return request('/api/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function UserSignUp(params: SignUpParamsType) {
  return request('/api/user/signup', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function queryCurrent() {
  return request('/api/user/myinfo');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: NoticeIconData[] }>('/api/client/notices');
}

export async function queryMenus() {
  return request('/api/client/menus');
}

export async function queryAcRules() {
  return request('/api/client/acrules');
}
