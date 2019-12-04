<template>
  <el-container id="app" class="text-color-primary" style="height: 100%;" direction="vertical">
    <el-header class="header">
      <div class="header-icon-button text-main-title"
           :class="{ clickable: isLogin }"
           @click="toggleSidebar">
        <i class="el-icon-menu text-color-accent"></i>
      </div>
      <div class="header-element text-main-title clickable"
           style="margin-left: 0; padding: 0 38px;" @click="backToHomepage">
        Celery Soft 学术
      </div>
      <header-divider></header-divider>
      <div class="header-element text-title">{{ this.$route.name }}</div>
      <div class="header-placeholder"></div>
      <div v-if="isLogin" class="header-user-information-box" style="height: 24px">
        <i class="el-icon-user-solid text-color-accent"></i>
        <span class="text-body header-username">{{ this.$store.getters.username }}</span>
      </div>
      <div v-else class="login-container">
        <el-link :underline="false" class="register-button" href="/register/">注册</el-link>
        <el-link :underline="false" class="login-button" href="/login/">登录</el-link>
      </div>
    </el-header>
    <el-container class="body">
      <el-aside class="sidebar" width="elAsideWidth" v-if="isLogin">
        <el-menu class="side-menu el-menu-vertical"
                 :default-active=activatedMenuIndex
                 :router="true"
                 :collapse="isCollapse"
                 @open="handleOpen"
                 @close="handleClose">
          <el-menu-item index="0" route="/">
            <i class="el-icon-house"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="1" route="/event/">
            <i class="el-icon-chat-dot-round"></i>
            <span>公告</span>
          </el-menu-item>
          <el-menu-item index="2" route="/service/">
            <i class="el-icon-reading"></i>
            <span>学术</span>
          </el-menu-item>
          <el-menu-item index="3" route="/account/">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="4" route="/manage/">
            <i class="el-icon-setting"></i>
            <span>后台管理</span>
          </el-menu-item>
          <el-menu-item @click="showLogoutDialog">
            <i class="el-icon-coffee-cup"></i>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
        <div class="text-comment sidebar-footer">
          <span v-if="!isCollapse">©2017-2020 Celery Soft 学术</span>
          <span v-else>©</span>
        </div>
      </el-aside>
      <el-main class="main-content" ref="mainContentView" @scroll.native.passive="onScroll">
        <router-view ref="routerView" v-loading="isLoading"/>

        <el-dialog
          title="提示"
          :visible.sync="logoutDialogVisible"
          width="30%"
          :before-close="handleClose">
          <span>退出登录 {{ this.$store.getters.username }} ？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="logoutDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="logout">确 定</el-button>
          </span>
        </el-dialog>

        <float-action-button :is-sidebar-collapse="isCollapse">
          <slot>
            <transition name="fade">
              <div v-if="goTopButtonVisible" class="back-to-top-button">
                <el-tooltip content="返回顶部" placement="bottom" effect="dark">
                  <el-button type="info" icon="el-icon-arrow-up" @click="goTop" circle></el-button>
                </el-tooltip>
              </div>
            </transition>
            <div class="return-button">
              <el-tooltip content="返回上级" placement="bottom" effect="dark">
                <el-button type="primary" icon="el-icon-back" @click="goBack" circle
                           :disabled="goBackButtonDisabled"></el-button>
              </el-tooltip>
            </div>
          </slot>
        </float-action-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Route } from 'vue-router';
import { Component, Vue, Watch } from 'vue-property-decorator';
import HeaderDivider from '@/components/HeaderDivider.vue';
import FloatActionButton from '@/components/FloatActionButton.vue';
import MutationTypes from '@/store/mutation-types';

@Component({
  components: {
    HeaderDivider,
    FloatActionButton,
  },
})

export default class App extends Vue {
  isCollapse: boolean;

  elAsideWidth: number;

  logoutDialogVisible: boolean;

  // goTopButtonVisible: boolean = this.$store.state.goTopButtonVisible;
  goTopButtonVisible: boolean = false;

  // goBackButtonDisabled: boolean = this.$store.state.goBackButtonDisabled;
  goBackButtonDisabled:boolean = false;

  timer?: number;

  isGoingTop: boolean = false;

  @Watch('isLogin')
  // eslint-disable-next-line class-methods-use-this
  onLoginStatusChanged(isLogin: boolean, oldVal: boolean) {
    if (!isLogin) {
      this.$router.push({
        path: '/login/',
        query: {
          next: this.$route.path,
        },
      });
    }
  }

  get isLogin() {
    return this.$store.getters.isLogin;
  }

  get isLoading() {
    return this.$store.getters.isLoading;
  }

  get activatedMenuIndex() {
    return this.$store.getters.activatedMenuIndex;
  }

  constructor() {
    super();
    this.isCollapse = false;
    this.elAsideWidth = 300;
    this.logoutDialogVisible = false;
  }

  logout() {
    this.logoutDialogVisible = false;
    this.$store.commit(MutationTypes.LOGOUT);
  }

  showLogoutDialog() {
    this.logoutDialogVisible = true;
  }

  backToHomepage() {
    if (this.isLogin) {
      this.$router.push('/');
    } else if (!this.isLogin && this.$route.path !== '/login/') {
      this.$router.push('/login/');
    }
  }

  toggleSidebar() {
    if (this.isLogin) {
      this.isCollapse = !this.isCollapse;
    }
  }

  handleOpen() {
    this.elAsideWidth = 300;
  }

  handleClose() {
    this.elAsideWidth = 64;
  }

  goBack() {
    // eslint-disable-next-line no-unused-expressions
    window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
  }

  goTop() {
    // speedFactor越大滚动速度越大
    const speedFactor = 100;
    const scrollFrequency = 25;

    this.isGoingTop = true;
    this.timer = setInterval(() => {
      // const scrollY = window.pageYOffset
      //     || document.documentElement.scrollTop || document.body.scrollTop;
      const view: Vue = this.$refs.mainContentView as Vue;
      const scrollY = view.$el.scrollTop;
      let speed = 0;
      if (scrollY <= speedFactor) {
        speed = -scrollY;
      } else {
        speed = -Math.floor(scrollY / speedFactor);
        speed = Math.abs(speed) > speedFactor ? speed : -speedFactor;
      }

      // eslint-disable-next-line no-multi-assign
      view.$el.scrollTop = scrollY + speed;
      // document.documentElement.scrollTop = document.body.scrollTop = scrollY + speed;

      if (scrollY <= 0) {
        this.isGoingTop = false;
        clearInterval(this.timer);
      }
    }, scrollFrequency);
  }

  onScroll() {
    // const scrollY = window.pageYOffset
    //     || document.documentElement.scrollTop || document.body.scrollTop;
    const view: Vue = this.$refs.mainContentView as Vue;
    const scrollY = view.$el.scrollTop;
    const { clientHeight } = document.documentElement;
    this.goTopButtonVisible = scrollY > clientHeight / 2;

    if (this.isGoingTop && scrollY <= 0) {
      this.isGoingTop = false;
      clearInterval(this.timer);
    }
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*color: #2c3e50;*/
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .header {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    border-bottom: solid 1px #e6e6e6;
    padding: 0;
  }

  .header-element {
    margin: auto 16px;
  }

  .header-placeholder {
    flex-grow: 1;
  }

  .login-container {
    padding: 0 8px;
  }

  .register-button {
    margin: 0 8px;
  }

  .login-button {
    margin: 0 8px;
  }

  .header-user-information-box {
    margin-right: 24px;
    display: flex;
    align-items: center;
  }

  .header-icon-button {
    width: 64px;
  }

  .header-username {
    line-height: 24px;
    margin: auto 0 auto 8px;
  }

  .header-username-icon {
    padding-top: 2px;
  }

  .body {
    height: calc(100% - 61px);
    margin-top: 0;
  }

  .sidebar {
    height: 100%;
  }

  .side-menu {
    height: calc(100% - 50px);
    /*background: #e6e6e6;*/
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 300px;
    min-height: 400px;
  }

  .sidebar-footer {
    padding: 16px 0;
    border-right: solid 1px #e6e6e6;
    /*background: #e6e6e6;*/
  }

  .main-content {
    height: 100%;
  }

  .return-button {
    margin-top: 16px;
  }
</style>
