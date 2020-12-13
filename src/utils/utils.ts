import { ListParams } from "@/pages/data";
import intersection from 'lodash/intersection';
import { useModel } from "umi";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const EMPTY_TEXT_LIST = ['', null, undefined];

export const parseSearchForm = (text?: string): [string, string] => {
  if (EMPTY_TEXT_LIST.includes(text)) return ['', ''];
  text = String(text);
  const opMatchs = text.match(/\[eq\]|\[ne\]|\[gt\]|\[lt\]|\[gte\]|\[lte\]|\[like\]|\[ilike\]|\[nlike\]|\[nilike\]|\[is\]|\[not\]|\[in\]|\[nin\]|\[btwn\]|\[nbtwn\]/);
  if (opMatchs) {
    const opVal = opMatchs[0];
    const fieldVal = text.substr(opVal.length);
    return [opVal, fieldVal];
  }
  return ['[eq]', text];
};

export const transProTableReqArgs = (
  params: { [key: string]: any } | undefined & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sorter: { [key: string]: any } | undefined,
  filter: { [key: string]: any } | undefined
): ListParams => {
  const offset: number = params.current ? params.current - 1 : 0;
  const limit: number = params.pageSize || 20;
  const order: string[] = [];
  const args: { [key: string]: any } = {};
  if (sorter) {
    Object.keys(sorter).forEach(col => {
      order.push(`${sorter[col] === 'ascend' ? '+' : '-'}${col}`)
    });
  }
  Object.keys(params).forEach(col => {
    if (!['pageSize', 'current', 'keyword'].includes(col) && params[col] !== undefined) {
      const [filterOperator, filterVal] = parseSearchForm(params[col]);
      if (!EMPTY_TEXT_LIST.includes(filterVal)) {
        args[`${col}${filterOperator}`] = ['[like]', '[ilike]', '[nlike]', '[nilike]'].includes(filterOperator) ? `*${filterVal}*` : filterVal;
      }
    }
  });
  return {
    offset,
    limit,
    sort: order.join(",") || "-updatedAt",
    ...args,
  }
};

// 鉴权(admin用户忽略)
export const canDo = (
  modelname: string,
  act: string,
) : boolean => {
  const { initialState } = useModel('@@initialState');
  const { currentUser = {}, acRules = [] } = initialState || {};
  if (currentUser.username === "admin") {
    return true;
  }
  const currentUserPerms = currentUser && currentUser.roles ? currentUser.roles.map(role => {
    return `${role.name},/api/crud/${modelname}/${act}`;
  }) : [];
  console.log(
    currentUser,
    acRules,
    currentUserPerms,
    intersection(acRules, currentUserPerms),
  )
  return intersection(acRules, currentUserPerms).length > 0;
};

// 获取当前会话用户名
export const getSessionUsername = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState || {};
  return currentUser.username;
};
