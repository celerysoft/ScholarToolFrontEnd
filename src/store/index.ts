/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import MutationTypes from './mutation-types';
// import RegisterPayload from '@/store/mutation-models/register';
// import LoginPayload from '@/store/mutation-models/login';
import { UserStatus } from '@/toolkits/constant';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    jwt: '',
    username: '',
    email: '',
    userStatus: UserStatus.WaitingActivation,
    uuid: '',
    isLogin: false,
    activatedMenuIndex: '0',
  },
  mutations: {
    [MutationTypes.ACTIVATION](state) {
      state.userStatus = UserStatus.Active;
    },
    // [MutationTypes.REGISTER](state, payload: RegisterPayload) {
    //   state.isLogin = true;
    //   state.userStatus = UserStatus.WaitingActivation;
    //   state.jwt = payload.jwt;
    //   state.username = payload.username;
    //   state.email = payload.email;
    //   state.uuid = payload.uuid;
    // },
    [MutationTypes.ON_RECEIVED_JWT](state, jwt: string) {
      state.jwt = jwt;
    },
    // [MutationTypes.LOGIN](state, payload: LoginPayload) {
    //   state.isLogin = true;
    //   state.userStatus = payload.status;
    //   state.username = payload.username;
    //   state.email = payload.email;
    //   state.uuid = payload.uuid;
    // },
    [MutationTypes.LOGOUT](state) {
      state.isLogin = false;
      state.jwt = '';
      state.username = '';
      state.email = '';
      state.userStatus = NaN;
      state.uuid = '';
    },
    [MutationTypes.LOADING](state) {
      state.isLoading = true;
    },
    [MutationTypes.ON_LOADING_COMPLETED](state) {
      state.isLoading = false;
    },
    [MutationTypes.ON_ROUTER_CHANGE](state) {
      state.isLoading = false;
    },
    [MutationTypes.ON_ACTIVATED_MENU_CHANGE](state, activateIndex: string) {
      state.activatedMenuIndex = activateIndex;
    },
  },
  actions: {},
  getters: {
    jwt: state => state.jwt,
    isLogin: state => state.isLogin,
    isLoading: state => state.isLoading,
    isActivated: state => state.userStatus === 1,
    username: state => state.username,
    email: state => state.email,
    userStatus: state => state.userStatus,
    activatedMenuIndex: state => state.activatedMenuIndex,
  },
  plugins: [createPersistedState()],
});
