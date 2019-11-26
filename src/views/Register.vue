<template>
  <div class="center-container">
    <el-form class="register-form" label-width="100px" label-position="right">
      <el-form-item label="用户名">
        <template v-slot:label>
          <div class="form-label">用户名</div>
        </template>
        <el-input v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <template v-slot:label>
          <div class="form-label">电子邮箱</div>
        </template>
        <el-input v-model="email"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <template v-slot:label>
          <div class="form-label">密码</div>
        </template>
        <el-input v-model="password" @keyup.enter.native="doRegister"
                  type="password" show-password>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <template v-slot:label>
          <div class="form-label">确认密码</div>
        </template>
        <el-input v-model="confirmPassword" @keyup.enter.native="doRegister"
                  type="password" show-password>

        </el-input>
      </el-form-item>
      <el-form-item label="邀请码">
        <template v-slot:label>
          <div class="form-label">邀请码</div>
        </template>
        <el-input v-model="invitationCode" @keyup.enter.native="doRegister"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
        <el-button @click="doRegister" type="primary">注册</el-button>
      </el-form-item>
    </el-form>

    <div class="text-body" style="margin-left: 80px;">
      已有账号？试试<el-button class="text-body" type="text" @click="goLogin">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-trailing-spaces */
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import Api from '@/network/api';
import MutationTypes from '@/store/mutation-types';
import RegisterPayload from '@/store/mutation-models/register';

@Component({
  components: {},
})

export default class Register extends Vue {
  username: string;

  email: string;

  password: string;

  confirmPassword: string;

  invitationCode: string;

  constructor() {
    super();

    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.invitationCode = '';
  }

  /* eslint-disable class-methods-use-this */
  beforeRouteEnter(to: Route, from: Route, next: any) {
    next((vm: Register) => {
      if (vm.isLogin) {
        let toPath: string;
        if (from !== null && from.path) {
          toPath = from.path;
        } else {
          toPath = '/';
        }
        next(toPath);
      }
    });
  }
  /* eslint-enable class-methods-use-this */

  get isLogin() {
    return this.$store.getters.isLogin;
  }

  private reset() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.invitationCode = '';
  }

  private goLogin() {
    this.$router.push('/login/');
  }

  private doRegister() {
    const username = this.username.trim();
    const email = this.email.trim();
    const password = this.password.trim();
    const confirmPassword = this.confirmPassword.trim();

    if (email.length === 0) {
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

    if (password !== confirmPassword) {
      this.$message({
        showClose: true,
        message: '两次输入的密码不一致',
        type: 'error',
      });
      return;
    }

    Api.register(username, email, password)
      .then((response) => {
        const { uuid, jwt } = response.data;

        const payload: RegisterPayload = new RegisterPayload(jwt, username, email, uuid);
        this.$store.commit(MutationTypes.REGISTER, payload);

        this.$message({
          showClose: true,
          message: '注册成功',
          type: 'success',
        });

        this.$router.push({ path: '/register/activation/' });
      });
  }
}
</script>

<style lang="scss" scoped>
  .center-container {
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .register-form {
    width: 400px;
  }

  .form-label {
    @extend .text-subtitle;
    font-weight: bold;
  }
</style>
