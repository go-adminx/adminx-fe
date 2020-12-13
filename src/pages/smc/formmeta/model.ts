import { IAdminXForm } from '@/components/AdminXForm/data';
import { Effect, Reducer } from 'umi';
import { createFormMeta, deleteFormMeta, getFormMeta, updateFormMeta } from './service';

export interface PageState {
  detail?: Partial<IAdminXForm>;
}

export interface ModelType {
  namespace: string;
  state: PageState;
  effects: {
    getForm: Effect;
    createForm: Effect;
    updateForm: Effect;
    deleteForm: Effect;
  };
  reducers: {
    setFormDetail: Reducer<PageState>;
    clean: Reducer<PageState>;
  };
}

const Model: ModelType = {
  namespace: 'formmeta',

  state: {
    detail: {},
  },

  effects: {
    *getForm({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(getFormMeta, id);
      yield put({
        type: 'setFormDetail',
        payload: response,
      });
    },
    *createForm({ payload }, { call }) {
      yield call(createFormMeta, payload);
    },
    *updateForm({ payload }, { call }) {
      const {id, values } = payload;
      yield call(updateFormMeta, id, values);
    },
    *deleteForm({ payload }, { call }) {
      const {ids } = payload;
      yield call(deleteFormMeta, ids);
    }
  },

  reducers: {
    setFormDetail(state, action) {
      return {
        ...(state as PageState),
        detail: action.payload ? action.payload.data || {} : {},
      }
    },
    clean(state) {
      return {
        ...(state as PageState),
        detail: {},
      }
    }
  },
}

export default Model;
