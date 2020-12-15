import { FormMeta } from '@/interface';
import { Effect, Reducer } from 'umi';
import { getMeta, getForm, createForm, updateForm, deleteForm } from './service';

export interface PageState {
  formmeta: Partial<FormMeta>;
  detail: { [key: string]: any };
}

export interface ModelType {
  namespace: string;
  state: PageState;
  effects: {
    getMeta: Effect;
    getForm: Effect;
    createForm: Effect;
    updateForm: Effect;
    deleteForm: Effect;
  };
  reducers: {
    setMeta: Reducer<PageState>;
    setFormDetail: Reducer<PageState>;
    clean: Reducer<PageState>;
  };
}

const Model: ModelType = {
  namespace: 'form',

  state: {
    formmeta: {},
    detail: {},
  },

  effects: {
    *getMeta({ payload }, { call, put }) {
      const { model } = payload;
      const response = yield call(getMeta, model);
      yield put({
        type: 'setMeta',
        payload: response,
      });
    },
    *getForm({ payload }, { call, put }) {
      const { model, id } = payload;
      const response = yield call(getForm, model, id);
      yield put({
        type: 'setFormDetail',
        payload: response,
      });
    },
    *createForm({ payload }, { call }) {
      const { model, values } = payload;
      yield call(createForm, model, values);
    },
    *updateForm({ payload }, { call }) {
      const { model, id, values } = payload;
      yield call(updateForm,model, id, values);
    },
    *deleteForm({ payload }, { call }) {
      const { model, ids } = payload;
      yield call(deleteForm, model, ids);
    }
  },

  reducers: {
    setMeta(state, action) {
      return {
        ...(state as PageState),
        formmeta: action.payload ? action.payload.data || {} : {},
      }
    },
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
