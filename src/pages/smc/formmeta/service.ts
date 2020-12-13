import { request } from 'umi';
import { ListParams } from '@/pages/data.d';

export async function queryFormMeta(params?: ListParams) {
  return request('/api/crud/formmeta/query', {
    params,
  });
}

export async function getFormMeta(id: number) {
  return request(`/api/crud/formmeta/get?id[eq]=${id}`);
}

export async function createFormMeta(values: { [key: string]: any }) {
  return request('/api/crud/formmeta/create', {
    method: 'POST',
    data: values,
  });
}

export async function updateFormMeta(id: number, values: { [key: string]: any }) {
  return request(`/api/crud/formmeta/update?id[eq]=${id}`, {
    method: 'PUT',
    data: values,
  });
}

export async function deleteFormMeta(params: { ids: number[] }) {
  return request(`/api/crud/formmeta/delete?id[in]=${params.ids.join()}`, {
    method: 'DELETE',
  });
}
