<template>
  <div class="password-reset-input-email-view">
    <div class="placeholder"></div>
    <div class="center-container">
      <div class="text-body hint">
        请输入您账号已经完成验证的电子邮箱地址，我们将发送一封重设密码的邮件给您。
      </div>
      <el-input class="input-email" v-model="email" @keyup.enter.native="resetPassword"
                placeholder="请输入电子邮箱地址"
                type="text" clearable>
      </el-input>
      <el-button class="btn-send-email" @click="resetPassword" type="primary"
      :disabled="disableButton">
        {{ buttonText }}
      </el-button>
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

export default class PasswordResetInputEmail extends Vue {
  email: string = '';

  countDownIntervalId: number = NaN;

  countDown: number = 120;

  disableButton: boolean = false;

  buttonText: string = '发送重设密码邮件';

  beforeRouteLeave(to: Route, from: Route, next: any) {
    clearInterval(this.countDownIntervalId);
    next();
  }

  private startCountDown() {
    this.countDown = 120;
    this.disableButton = true;
    this.buttonText = `${this.countDown}秒后重新发送`;
    this.countDownIntervalId = setInterval(() => {
      this.countDown -= 1;
      if (this.countDown === 0) {
        this.stopCountDown();
      } else {
        this.buttonText = `${this.countDown}秒后重新发送`;
      }
    }, 1000);
  }

  private stopCountDown() {
    this.disableButton = false;
    this.buttonText = '发送重设密码邮件';
    clearInterval(this.countDownIntervalId);
  }

  resetPassword() {
    const email = this.email.trim();

    if (email.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入电子邮箱地址',
        type: 'warning',
      });
      return;
    }

    Api.sendingEmailForResetPassword(email)
      .then((response) => {
        this.startCountDown();
        this.$notify({
          title: '',
          message: '邮件发送成功，请检查您的电子邮箱，如果没有收到邮件，请检查一下垃圾箱，或者在120秒后重试。',
          type: 'success',
        });
      });
  }
}
</script>

<style lang="scss" scoped>
  .password-reset-input-email-view {
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

  .hint {
    width: 360px;
  }

  .input-email {
    margin-top: 16px;
    width: 360px;
  }

  .btn-send-email {
    margin-top: 16px;
    width: 200px;
  }

  .placeholder {
  }
</style>
