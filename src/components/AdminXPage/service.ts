import { request } from 'umi';
import { ListParams } from '@/pages/data.d';

export async function getMeta(modelname: string) {
  return request(`/api/client/formmeta/${modelname}`);
}

export async function queryForm(modelname: string, params?: ListParams) {
  return request(`/api/crud/${modelname}/query`, {
    params,
  });
}

export async function getForm(modelname: string, id: number) {
  return request(`/api/crud/${modelname}/get?id[eq]=${id}`);
}

export async function createForm(modelname: string, values: { [key: string]: any }) {
  return request(`/api/crud/${modelname}/create`, {
    method: 'POST',
    data: values,
  });
}

export async function updateForm(modelname: string, id: number, values: { [key: string]: any }) {
  return request(`/api/crud/${modelname}/update?id[eq]=${id}`, {
    method: 'PUT',
    data: values,
  });
}

export async function deleteForm(modelname: string, params: { ids: number[] }) {
  return request(`/api/crud/${modelname}/delete?id[in]=${params.ids.join()}`, {
    method: 'DELETE',
  });
}
