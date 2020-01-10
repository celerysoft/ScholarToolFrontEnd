/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import MutationTypes from './mutation-types';
import LoginPayload from '@/store/mutation-models/login';
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
    registerDate: '',
    isLogin: false,
    activatedMenuIndex: '0',
    isSideBarCollapse: false,
    isStaff: false,
  },
  mutations: {
    [MutationTypes.ACTIVATION](state) {
      state.userStatus = UserStatus.Active;
    },
    [MutationTypes.ON_RECEIVED_JWT](state, jwt: string) {
      state.jwt = jwt;
    },
    [MutationTypes.ON_RECEIVED_USER_INFORMATION](state, payload: LoginPayload) {
      state.userStatus = payload.status;
      state.username = payload.username;
      state.email = payload.email;
      state.uuid = payload.uuid;
      state.registerDate = payload.registerDate;
    },
    [MutationTypes.LOGIN](state) {
      state.isLogin = true;
    },
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
    [MutationTypes.TOGGLE_SIDE_BAR](state) {
      state.isSideBarCollapse = !state.isSideBarCollapse;
    },
    [MutationTypes.ON_RECEIVED_USER_PERMISSION](state, isStaff) {
      state.isStaff = isStaff;
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
    userUuid: state => state.uuid,
    userStatus: state => state.userStatus,
    registerDate: state => state.registerDate,
    activatedMenuIndex: state => state.activatedMenuIndex,
    isSideBarCollapse: state => state.isSideBarCollapse,
    isStaff: state => state.isStaff,
  },
  plugins: [createPersistedState()],
});
