import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import Home from '../views/Home.vue';
import MutationTypes from '@/store/mutation-types';
import store from '@/store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login/',
    name: '用户登录',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register/',
    name: '用户注册',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/register/activation/',
    name: '等待账户激活',
    component: () => import('@/views/ActivationHint.vue'),
  },
  {
    path: '/',
    name: '主页',
    component: Home,
  },
  {
    path: '/event/',
    name: '公告',
    component: () => import('@/views/Event.vue'),
  },
  {
    path: '/event/:uuid',
    name: '公告详情',
    component: () => import('@/views/EventDetail.vue'),
  },
  {
    path: '/account/',
    name: '个人信息',
    component: () => import('@/views/Account.vue'),
  },
  {
    path: '/activation/',
    name: '激活账户',
    component: () => import('@/views/Activation.vue'),
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

function isLogin(): boolean {
  return store.getters.isLogin;
}

const urlsForbiddenIfLogin = ['/login/', '/register/'];

const urlsWithoutLogin = ['/activation', '/activation/']
  .concat(urlsForbiddenIfLogin);

function isUrlNeedLogin(url: string): boolean {
  return urlsWithoutLogin.indexOf(url) === -1;
}

function isUrlForbiddenForLoginUser(url: string): boolean {
  return urlsForbiddenIfLogin.indexOf(url) !== -1;
}

router.beforeEach((to: Route, from: Route, next) => {
  if (to.path === '/do-nothing/') {
    next(false);
  }

  if (!isLogin() && isUrlNeedLogin(to.path)) {
    next('/login/');
  }

  if (isLogin() && isUrlForbiddenForLoginUser(to.path)) {
    next(from.path);
  }

  store.commit(MutationTypes.ON_ROUTER_CHANGE, to);

  next();
});

export default router;
