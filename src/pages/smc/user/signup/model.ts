import { Effect, Reducer } from 'umi';

import { UserSignUp } from '../service';

export interface StateType {
  code?: number;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    signupHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'signUp',

  state: {
    code: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(UserSignUp, payload);
      yield put({
        type: 'signupHandle',
        payload: response,
      });
    },
  },

  reducers: {
    signupHandle(state, { payload }) {
      return {
        ...state,
        code: payload.code,
      };
    },
  },
};

export default Model;