/* eslint-disable no-param-reassign */
import { Notification } from 'element-ui';
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import store from '@/store/index';
import MutationTypes from '@/store/mutation-types';
import { ServiceTemplateType } from '@/network/response/service-template';
import { TradeOrderStatus } from '@/network/response/trade-order';

const Axios = require('axios');

class Api {
  readonly TODAY_IN_HISTORY_URL: string = 'today-in-history';

  readonly LOGIN_URL: string = 'login';

  readonly USER_URL: string = 'user';

  readonly PASSWORD_URL: string = 'user/password';

  readonly EMAIL_URL: string = 'user/email';

  readonly EVENT_URL: string = 'event';

  readonly SERVICE_URL: string = 'service';

  readonly SERVICE_PASSWORD_URL: string = 'service/password';

  readonly SERVICE_TEMPLATE_URL: string = 'service/template';

  readonly SERVICE_ORDER_URL: string = 'service/order';

  readonly SERVICE_ORDER_SNAPSHOT_URL: string = 'service/order/snapshot';

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
            Notification({
              title: '登录过期',
              message: '登录已过期，请重新登录',
              type: 'info',
            });

            store.commit(MutationTypes.LOGOUT);

            return Promise.reject(error);
          }

          error.message = error.response.data.message;
        } else if (error.request) {
          console.log(error.request);
        } else {
          error.message = '未知错误';
        }

        if (error.config.showError) {
          Notification({
            title: '与服务器通信时发生错误',
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
      loadingAnimation: true,
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

  public register(username: string, email: string,
    password: string, invitationCode: string): AxiosPromise {
    return this.axios.post(this.USER_URL, {
      username,
      email,
      password,
      invitation_code: invitationCode,
    }, {
      showError: true,
    });
  }

  public activateAccount(jwt: string): AxiosPromise {
    return this.axios.put(this.USER_URL, {
      jwt,
    });
  }

  public sendActivationEmail(): AxiosPromise {
    return this.axios.patch(this.EMAIL_URL, null, {
      showError: true,
    });
  }

  public sendActivationEmailForModifyingEmail(password: string, email: string): AxiosPromise {
    return this.axios.patch(this.EMAIL_URL, {
      password,
      email,
    }, {
      showError: true,
      loadingAnimation: true,
    });
  }

  public modifyEmail(jwt: string): AxiosPromise {
    return this.axios.put(this.EMAIL_URL, {
      jwt,
    }, {
      showError: true,
      loadingAnimation: true,
    });
  }

  public getSelfInformation(): AxiosPromise {
    return this.axios.get(this.USER_URL, {
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
      loadingAnimation: true,
    });
  }

  public getEvent(uuid: string): AxiosPromise {
    return this.axios.get(this.EVENT_URL, {
      params: {
        uuid,
      },
      showError: true,
      loadingAnimation: true,
    });
  }

  public getUserServices(): AxiosPromise {
    return this.axios.get(this.SERVICE_URL, {
      showError: true,
      loadingAnimation: true,
    });
  }

  public getService(uuid: string): AxiosPromise {
    return this.axios.get(this.SERVICE_URL, {
      showError: true,
      loadingAnimation: true,
      params: {
        uuid,
      },
    });
  }

  public modifyServicePassword(uuid: string, password: string): AxiosPromise {
    return this.axios.put(this.SERVICE_PASSWORD_URL, {
      uuid, password,
    }, {
      showError: true,
      loadingAnimation: true,
    });
  }

  public modifyMonthlyServiceAutoRenewStatus(uuid: string): AxiosPromise {
    return this.axios.patch(this.SERVICE_URL, {
      uuid,
      auto_renew: 1,
    }, {
      showError: true,
      loadingAnimation: true,
    });
  }

  public getRecommendationServiceTemplate(): AxiosPromise {
    return this.axios.get(this.SERVICE_TEMPLATE_URL, {
      showError: true,
      loadingAnimation: true,
      params: {
        type: ServiceTemplateType.recommendation,
        size: 3,
      },
    });
  }

  public getMonthlyServiceTemplate(): AxiosPromise {
    return this.axios.get(this.SERVICE_TEMPLATE_URL, {
      showError: true,
      loadingAnimation: true,
      params: {
        type: ServiceTemplateType.monthly,
        page: 1,
        page_size: 10,
      },
    });
  }

  public getDataServiceTemplate(): AxiosPromise {
    return this.axios.get(this.SERVICE_TEMPLATE_URL, {
      showError: true,
      loadingAnimation: true,
      params: {
        type: ServiceTemplateType.data,
        page: 1,
        page_size: 10,
      },
    });
  }

  public getServiceTemplate(uuid: string): AxiosPromise {
    return this.axios.get(this.SERVICE_TEMPLATE_URL, {
      showError: true,
      loadingAnimation: true,
      params: {
        uuid,
      },
    });
  }

  public createOrder(uuid: string, password: string, autoRenew: boolean | null): AxiosPromise {
    let data: object;
    if (autoRenew) {
      data = {
        template_uuid: uuid,
        password,
        auto_renew: autoRenew,
      };
    } else {
      data = {
        template_uuid: uuid,
        password,
      };
    }
    return this.axios.post(this.SERVICE_ORDER_URL, data, {
      showError: true,
    });
  }

  public getUnpaidOrder(): AxiosPromise {
    return this.axios.get(this.SERVICE_ORDER_URL, {
      params: {
        status: [TradeOrderStatus.initialization, TradeOrderStatus.unpaid],
      },
      showError: true,
    });
  }

  public getOrder(uuid: string): AxiosPromise {
    return this.axios.get(this.SERVICE_ORDER_URL, {
      params: {
        uuid,
      },
    });
  }

  public getOrderSnapshot(uuid: string): AxiosPromise {
    return this.axios.get(this.SERVICE_ORDER_SNAPSHOT_URL, {
      params: {
        trade_order_uuid: uuid,
      },
    });
  }
}

export default new Api();
