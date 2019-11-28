/* eslint-disable no-param-reassign */
import { Message } from 'element-ui';
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
// import router from '@/router/index';
import store from '@/store/index';
import MutationTypes from '@/store/mutation-types';

const Axios = require('axios');

class Api {
  readonly TODAY_IN_HISTORY_URL: string = 'today-in-history';

  readonly REGISTER_URL: string = 'register';

  readonly LOGIN_URL: string = 'login';

  readonly USER_INFORMATION_URL: string = 'user';

  readonly PASSWORD_URL: string = 'user/password';

  readonly EMAIL_URL: string = 'user/email';

  readonly EVENT_URL: string = 'event';

  private axios: AxiosInstance;

  constructor() {
    const baseUrl = process.env.VUE_APP_BASE_URL;

    this.axios = Axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: { 'X-Custom-Header': 'Scholar-Tool' },
    });
    this.initInterceptors();
  }

  private initInterceptors(): void {
    this.axios.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (config.loadingAnimation) {
          store.commit(MutationTypes.LOADING);
        }
        if (store.getters.jwt) {
          config.headers.Authorization = store.getters.jwt;
        }

        return config;
      },
      error => Promise.reject(error),
    );

    this.axios.interceptors.response.use(
      (response) => {
        if (response.config.loadingAnimation) {
          store.commit(MutationTypes.ON_LOADING_COMPLETED);
        }

        return response;
      },
      (error) => {
        if (error.config && error.config.loadingAnimation) {
          store.commit(MutationTypes.ON_LOADING_COMPLETED);
        }

        if (error.response) {
          if (error.response.status === 401) {
            Message({
              showClose: true,
              message: '登录已过期，请重新登录',
              type: 'info',
            });

            store.commit(MutationTypes.LOGOUT);
          }
          error.message = error.response.data.message;
        } else if (error.request) {
          console.log(error.request);
        } else {
          error.message = '未知错误';
        }

        if (error.config.showError) {
          Message({
            showClose: true,
            message: error.message,
            type: 'error',
          });
        }

        return Promise.reject(error);
      },
    );
  }

  public getTodayInHistory(): AxiosPromise {
    return this.axios.get(this.TODAY_IN_HISTORY_URL, {
      showError: true,
    });
  }

  public login(username: string, password: string): AxiosPromise {
    return this.axios.post(this.LOGIN_URL, {
      username,
      password,
    }, {
      showError: true,
    });
  }

  public register(username: string, email: string, password: string): AxiosPromise {
    return this.axios.post(this.REGISTER_URL, {
      username,
      email,
      password,
    }, {
      showError: true,
    });
  }

  public activateAccount(jwt: string): AxiosPromise {
    return this.axios.patch(this.REGISTER_URL, {
      jwt,
    });
  }

  public sendActivationEmail(): AxiosPromise {
    return this.axios.patch(this.EMAIL_URL, null, {
      showError: true,
    });
  }

  public getSelfInformation(): AxiosPromise {
    return this.axios.get(this.USER_INFORMATION_URL, {
      showError: true,
    });
  }

  public modifyPassword(oldPassword: string, newPassword: string): AxiosPromise {
    return this.axios.put(this.PASSWORD_URL, {
      old_password: oldPassword,
      password: newPassword,
    }, {
      showError: true,
    });
  }

  public getEvents(): AxiosPromise {
    return this.axios.get(this.EVENT_URL, {
      showError: true,
    });
  }

  public getEvent(uuid: string): AxiosPromise {
    return this.axios.get(this.EVENT_URL, {
      params: {
        uuid,
      },
      showError: true,
    });
  }
}

export default new Api();
