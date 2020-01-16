<template>
  <div class="password-reset-view">
    <div class="placeholder"></div>
    <div class="center-container">
      <el-form class="reset-password-form" label-width="100px" label-position="right">
        <el-form-item label="密码">
          <template v-slot:label>
            <div class="form-label">密码</div>
          </template>
          <el-input v-model="password" @keyup.enter.native="resetPassword"
                    type="password" show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <template v-slot:label>
            <div class="form-label">确认密码</div>
          </template>
          <el-input v-model="confirmPassword" @keyup.enter.native="resetPassword"
                    type="password" show-password>

          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button @click="resetPassword" type="primary">重设密码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';

@Component({
  components: {
    Footer,
  },
})

export default class PasswordReset extends Vue {
  password: string = '';

  confirmPassword: string = '';

  resetPasswordToken: string = '';

  mounted() {
    this.resetPasswordToken = this.$route.query.jwt as string;
  }

  reset() {
    this.password = '';
    this.confirmPassword = '';
  }

  resetPassword() {
    const password = this.password.trim();
    const confirmPassword = this.confirmPassword.trim();

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

    Api.resetPassword(password, this.resetPasswordToken)
      .then((response) => {
        this.$notify({
          title: '',
          message: '密码重设成功，请使用新密码登录',
          type: 'success',
        });
        this.$router.push('/login/');
      });
  }
}
</script>

<style lang="scss" scoped>
  .password-reset-view {
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
    /*width: 100%;*/
    width: 480px;
    min-height: 100%;
    /*min-height: 480px;*/
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .reset-password-form {
    width: 480px;
  }

  .placeholder {
  }
</style>
