<template>
  <div class="email-modify-validation-view">
    <div class="center-container">
      <h3>{{ status }}</h3>
      <div class="content"
           v-loading="isValidating" element-loading-background="rgba(255, 255, 255, 1)">
        <div v-if="isValid" class="text-body text-color-primary">
          <div>您账户的电子邮箱地址已经成功变更为{{ email }}</div>
        </div>
        <div v-else class="text-body text-color-primary">
          <div>失败的原因可能有：</div>
          <ul>
            <li>服务器突然走神了</li>
            <li>验证邮件的有效期已经过了</li>
            <li>您不小心编辑了验证邮件里的链接（没有完整地复制粘贴链接地址）</li>
            <li>您的电子邮箱地址已经成功完成了变更，无法重复变更</li>
          </ul>
          <div>建议您采取以下操作：</div>
          <ul>
            <li>重新点击一次验证链接</li>
            <li>重新进行一次修改电子邮箱地址的操作，然后系统会再次发送一封验证邮件，点击里面的验证链接</li>
            <li><el-button type="text" @click="contactCustomerService">联系客服</el-button></li>
          </ul>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AxiosError, AxiosResponse } from 'axios';
import Api from '@/network/api';
import MutationTypes from '@/store/mutation-types';
import LoginPayload from '@/store/mutation-models/login';
import formatUserApiResponse, { UserApiResponse, UserResponse } from '@/network/response/user';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Footer,
  },
})

export default class EmailModifyValidation extends Vue {
  status: string;

  email: string;

  isValidating: boolean = true;

  isValid: boolean = false;

  jwt: any;

  constructor() {
    super();
    this.status = '正在变更电子邮箱地址。。。';
    this.email = '';
    this.jwt = '';
  }

  mounted() {
    this.jwt = this.$route.query.jwt;

    if (typeof this.jwt === 'string' && this.jwt.length > 0) {
      this.modifyEmail();
    } else {
      this.$router.push('/');
    }
  }

  modifyEmail() {
    Api.modifyEmail(this.jwt)
      .then((response: AxiosResponse) => {
        this.status = '电子邮箱地址变更成功';
        this.isValid = true;

        this.$store.commit(MutationTypes.ON_RECEIVED_JWT, response.data.jwt);
        Api.getSelfInformation()
          .then((userApiResponse) => {
            const user: UserResponse = formatUserApiResponse(
              userApiResponse.data as UserApiResponse,
            );
            const {
              username, uuid, email, status, registerDate,
            } = user;

            const payload: LoginPayload = new LoginPayload(
              status, username, email, uuid, registerDate,
            );
            this.$store.commit(MutationTypes.LOGIN);
            this.$store.commit(MutationTypes.ON_RECEIVED_USER_INFORMATION, payload);

            this.$notify({
              title: '电子邮箱地址变更成功',
              message: `您账户的电子邮箱地址已经成功变更为${email}`,
              type: 'success',
              duration: 10000,
            });
            this.$router.push('/account/');
          });
      })
      .catch((error: AxiosError) => {
        this.status = '电子邮箱地址变更失败';
        this.isValid = false;
        this.$message({
          showClose: true,
          message: `电子邮箱地址变更失败：${error.message}`,
          type: 'error',
        });
      })
      .finally(() => {
        this.isValidating = false;
      });
  }

  private turnToScholar() {
    this.$router.push('/service/');
  }

  private turnToEvent() {
    this.$router.push('/event/');
  }

  private turnToMyInformation() {
    this.$router.push('/account/');
  }

  private contactCustomerService() {
    this.$message({
      showClose: true,
      message: '客服？不存在的',
      type: 'info',
    });
  }
}
</script>

<style lang="scss" scoped>
  .email-modify-validation-view {
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
    height: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    h3 {
      align-self: center;
    }
  }

  .content {
    margin-top: 64px;
    width: 800px;
    text-align: start;
  }
</style>
