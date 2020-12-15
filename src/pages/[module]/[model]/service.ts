import { request } from 'umi';
import { ListParams } from '@/interface';

export async function getMeta(model: string) {
  return request(`/api/client/formmeta/${model}`);
}

export async function queryForm(model: string, params?: ListParams) {
  return request(`/api/crud/${model}/query`, {
    params,
  });
}

export async function getForm(model: string, id: number) {
  return request(`/api/crud/${model}/get?id[eq]=${id}`);
}

export async function createForm(model: string, values: { [key: string]: any }) {
  return request(`/api/crud/${model}/create`, {
    method: 'POST',
    data: values,
  });
}

export async function updateForm(model: string, id: number, values: { [key: string]: any }) {
  return request(`/api/crud/${model}/update?id[eq]=${id}`, {
    method: 'PUT',
    data: values,
  });
}

export async function deleteForm(model: string, params: { ids: number[] }) {
  return request(`/api/crud/${model}/delete?id[in]=${params.ids.join()}`, {
    method: 'DELETE',
  });
}
