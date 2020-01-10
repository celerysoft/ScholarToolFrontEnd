<template>
  <div class="login">
    <div class="placeholder"></div>
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
      <div class="text-body register-hint">
        还没有账号？请先<el-button class="text-body" type="text" @click="goRegister">注册</el-button>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Api from '@/network/api';
import MutationTypes from '@/store/mutation-types';
import LoginPayload from '@/store/mutation-models/login';
import formatUserApiResponse, { UserResponse, UserApiResponse } from '@/network/response/user';
import Footer from '@/components/Footer.vue';
import { PermissionResponse } from '@/network/response/permission';

@Component({
  components: {
    Footer,
  },
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

  reset() {
    this.username = '';
    this.password = '';
  }

  doLogin() {
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
            const user: UserResponse = formatUserApiResponse(
                userApiResponse.data as UserApiResponse,
            );
            const {
              uuid, email, status, registerDate,
            } = user;

            const payload: LoginPayload = new LoginPayload(
              status, username, email, uuid, registerDate,
            );
            this.$store.commit(MutationTypes.ON_RECEIVED_USER_INFORMATION, payload);

            this.$store.commit(MutationTypes.LOGIN);

            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success',
            });

            Api.getSelfPermission()
              .then((userPermissionResponse) => {
                /* eslint-disable-next-line prefer-destructuring */
                const permissions: PermissionResponse[] = userPermissionResponse.data.permissions;
                let isStaff = false;
                // eslint-disable-next-line no-restricted-syntax
                for (const permission of permissions) {
                  if (permission.label === 'management') {
                    isStaff = true;
                    break;
                  }
                }
                this.$store.commit(MutationTypes.ON_RECEIVED_USER_PERMISSION, isStaff);
              });

            let next: any = this.$route.query.next ? this.$route.query.next : '/';
            next = next !== '/login/' ? next : '/';
            this.$router.push({ path: next });
          });
      });
  }

  goRegister() {
    this.$router.push('/register/');
  }
}
</script>

<style lang="scss" scoped>
  .login {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .center-container {
    width: 100%;
    min-height: 100%;
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

  .register-hint {
    margin-top: 16px;
  }

  .placeholder {
  }
</style>
