import AxiosRequestConfig from 'axios';

declare module 'axios/index' {
  interface AxiosRequestConfig {
    showError?: boolean;
    loadingAnimation?: boolean;
  }
}
