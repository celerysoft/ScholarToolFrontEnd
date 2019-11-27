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
      <el-main class="main-content">
        <router-view v-loading="isLoading"/>

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
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Route } from 'vue-router';
import { Component, Vue, Watch } from 'vue-property-decorator';
import HeaderDivider from './components/HeaderDivider.vue';
import MutationTypes from './store/mutation-types';

@Component({
  components: {
    HeaderDivider,
  },
})

export default class App extends Vue {
    isCollapse: boolean;

    elAsideWidth: number;

    logoutDialogVisible: boolean;

    // @Watch('$route')
    // onRouteChanged(to: Route, from: Route) {
    //   // console.log(from);
    //   // console.log(to);
    // }

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

    backToHomepage() {
      this.$router.push('/');
    }

    toggleSidebar() {
      if (this.isLogin) {
        // noop
      }
      this.isCollapse = !this.isCollapse;
    }

    handleOpen() {
      this.elAsideWidth = 300;
    }

    handleClose() {
      this.elAsideWidth = 64;
    }

    showLogoutDialog() {
      this.logoutDialogVisible = true;
    }

    logout() {
      this.logoutDialogVisible = false;
      this.$store.commit(MutationTypes.LOGOUT);
      this.$router.push({
        path: '/login/',
        query: {
          next: this.$route.path,
        },
      });
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
    min-height: 100%;
  }
</style>
