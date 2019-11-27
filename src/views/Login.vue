<template>
  <div class="center-container">
    <div class="login-box">
      <span>账号</span>
      <el-input v-model="username" @keyup.enter.native="doLogin" type="text"
                style="width: 360px; margin-left: 8px">
      </el-input>
    </div>
    <div class="login-box">
      <span>密码</span>
      <el-input v-model="password" @keyup.enter.native="doLogin" type="password"
                style="width: 360px; margin-left: 8px">
      </el-input>
    </div>
    <div class="login-button-group">
      <el-button @click="reset">重置</el-button>
      <el-button @click="doLogin" type="primary">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import Api from '@/network/api';
import MutationTypes from '@/store/mutation-types';
import LoginPayload from '@/store/mutation-models/login';

@Component({
  components: {},
})

export default class Login extends Vue {
  username: string;

  password: string;

  constructor() {
    super();

    this.username = '';
    this.password = '';
  }

  /* eslint-disable class-methods-use-this */
  // beforeRouteEnter(to: Route, from: Route, next: any) {
  //   next((vm: Login) => {
  //     if (vm.isLogin) {
  //       let toPath: string;
  //       if (from !== null && from.path) {
  //         toPath = from.path;
  //       } else {
  //         toPath = '/';
  //       }
  //       next(toPath);
  //     }
  //   });
  // }
  /* eslint-enable class-methods-use-this */

  get isLogin() {
    return this.$store.getters.isLogin;
  }

  private reset() {
    this.username = '';
    this.password = '';
  }

  private doLogin() {
    const username = this.username.trim();
    const password = this.password.trim();

    if (username.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入用户名',
        type: 'warning',
      });
      return;
    }
    if (password.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入密码',
        type: 'warning',
      });
      return;
    }

    Api.login(username, password)
      .then((response) => {
        const { jwt } = response.data;
        this.$store.commit(MutationTypes.ON_RECEIVED_JWT, jwt);
        Api.getSelfInformation()
          .then((userApiResponse) => {
            const { uuid, email, status } = userApiResponse.data;

            const payload: LoginPayload = new LoginPayload(status, username, email, uuid);
            this.$store.commit(MutationTypes.LOGIN, payload);

            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success',
            });

            let next: any = this.$route.query.next ? this.$route.query.next : '/';
            next = next !== '/login/' ? next : '/';
            this.$router.push({ path: next });
          });
      });
  }
}
</script>

<style lang="scss" scoped>
  .center-container {
    width: 100%;
    height: 100%;
    /*min-height: 480px;*/
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
  }

  .login-box {
    display: block;
    margin: 8px 0;
  }

  .login-button-group {
    margin-top: 8px;
  }
</style>
