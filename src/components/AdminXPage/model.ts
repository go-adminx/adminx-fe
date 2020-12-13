import { IAdminXForm } from '@/components/AdminXForm/data';
import { Effect, Reducer } from 'umi';
import { getMeta, getForm, createForm, updateForm, deleteForm } from './service';

export interface PageState {
  formmeta: Partial<IAdminXForm>;
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
      const { modelname } = payload;
      const response = yield call(getMeta, modelname);
      yield put({
        type: 'setMeta',
        payload: response,
      });
    },
    *getForm({ payload }, { call, put }) {
      const { modelname, id } = payload;
      const response = yield call(getForm, modelname, id);
      yield put({
        type: 'setFormDetail',
        payload: response,
      });
    },
    *createForm({ payload }, { call }) {
      const { modelname, values } = payload;
      yield call(createForm, modelname, values);
    },
    *updateForm({ payload }, { call }) {
      const { modelname, id, values } = payload;
      yield call(updateForm,modelname, id, values);
    },
    *deleteForm({ payload }, { call }) {
      const { modelname, ids } = payload;
      yield call(deleteForm, modelname, ids);
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
