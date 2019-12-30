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
    path: '/event/:uuid/',
    name: '公告详情',
    component: () => import('@/views/EventDetail.vue'),
  },
  {
    path: '/account/',
    name: '个人信息',
    component: () => import('@/views/Account.vue'),
  },
  {
    path: '/account/:uuid/',
    name: '用户信息',
    component: () => import('@/views/Account.vue'),
  },
  {
    path: '/activation/',
    name: '激活账户',
    component: () => import('@/views/Activation.vue'),
  },
  {
    path: '/account/email/',
    name: '变更邮箱确认',
    component: () => import('@/views/EmailModifyValidation.vue'),
  },
  {
    path: '/service/',
    name: '我的学术服务',
    component: () => import('@/views/Service.vue'),
  },
  {
    path: '/service/subscribe/',
    name: '开通学术服务',
    component: () => import('@/views/ServiceSubscribe.vue'),
  },
  {
    path: '/service/subscribe/confirm/:uuid/',
    name: '确认订单',
    component: () => import('@/views/ServiceSubscribeOrder.vue'),
  },
  {
    path: '/service/order/pay/:uuid/',
    name: '订单支付',
    component: () => import('@/views/ServiceOrderPay.vue'),
  },
  {
    path: '/service/:uuid/',
    name: '学术服务详情',
    component: () => import('@/views/ServiceDetail.vue'),
  },
  {
    path: '/management/',
    name: '后台管理',
    component: () => import('@/views/Management.vue'),
  },
  {
    path: '/management/user/',
    name: '用户管理',
    component: () => import('@/views/ManagementUser.vue'),
  },
  {
    path: '/management/invitation/',
    name: '邀请码管理',
    component: () => import('@/views/ManagementInvitationCode.vue'),
  },
  {
    path: '/management/service/',
    name: '学术服务管理',
    component: () => import('@/views/ManagementService.vue'),
  },
  {
    path: '/management/service/create/',
    name: '创建学术服务',
    component: () => import('@/views/ManagementServiceCreate.vue'),
  },
  {
    path: '/management/service/edit/:uuid',
    name: '编辑学术服务',
    component: () => import('@/views/ManagementServiceEdit.vue'),
  },
  {
    path: '/management/event/',
    name: '公告管理',
    component: () => import('@/views/ManagementEvent.vue'),
  },
  {
    path: '/404/',
    name: '页面不存在',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '*',
    redirect: '/404/',
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

const urlsWithoutLogin = ['/activation', '/activation/', '/account/email', '/account/email/']
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
