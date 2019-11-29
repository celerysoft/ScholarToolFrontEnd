<template>
  <div class="center-container">
    <h3>{{ status }}</h3>
    <div class="content"
         v-loading="isActivating" element-loading-background="rgba(255, 255, 255, 1)">
      <div v-if="isActivated">
        <div>您的账户{{ username }}已经成功激活，欢迎您成为Celery Soft学术的用户</div>
        <p>
          在<el-button type="text" @click="turnToScholar">学术</el-button>栏目，可以进行学术服务管理操作
        </p>
        <p>
          在<el-button type="text" @click="turnToEvent">公告</el-button>栏目，可以查看网站公告
        </p>
        <p>
          在<el-button type="text" @click="turnToMyInformation">个人信息</el-button>栏目，可以查看个人信息，进行修改密码等操作
        </p>
      </div>
      <div v-else>
        <div>失败的原因可能有：</div>
        <ul>
          <li>服务器突然走神了</li>
          <li>激活邮件的有效期已经过了</li>
          <li>您不小心编辑了激活邮件里的链接（没有完整地复制粘贴链接地址）</li>
          <li>您已经激活过了，无法重复激活</li>
        </ul>
        <div>建议您采取以下操作：</div>
        <ul>
          <li>重新点击一次激活链接</li>
          <li>重新发送一封激活邮件，然后点击里面的激活链接</li>
          <li><el-button type="text" @click="contactCustomerService">联系客服</el-button></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AxiosError, AxiosResponse } from 'axios';
import Api from '@/network/api';
import MutationTypes from '@/store/mutation-types';
import LoginPayload from '@/store/mutation-models/login';
import formatUserApiResponse, { UserApiResponse, UserResponse } from '@/network/response/user';

@Component({
  components: {},
})

export default class Activation extends Vue {
  status: string;

  username: string;

  isActivating: boolean = true;

  isActivated: boolean = false;

  jwt: any;

  constructor() {
    super();
    this.status = '正在激活中。。。';
    this.username = '';
    this.jwt = '';
  }

  mounted() {
    this.jwt = this.$route.query.jwt;

    if (typeof this.jwt === 'string' && this.jwt.length > 0) {
      this.activateAccount();
    } else {
      this.$router.push('/');
    }
  }

  activateAccount() {
    Api.activateAccount(this.jwt)
      .then((response: AxiosResponse) => {
        this.status = '激活成功';
        this.isActivated = true;

        this.$store.commit(MutationTypes.ON_RECEIVED_JWT, response.data.jwt);
        this.$store.commit(MutationTypes.ACTIVATION);
        Api.getSelfInformation()
          .then((userApiResponse) => {
            const user: UserResponse = formatUserApiResponse(response.data as UserApiResponse);
            const {
              username, uuid, email, status, registerDate,
            } = user;

            const payload: LoginPayload = new LoginPayload(
              status, username, email, uuid, registerDate,
            );
            this.$store.commit(MutationTypes.ON_RECEIVED_USER_INFORMATION, payload);
            this.$store.commit(MutationTypes.LOGIN, payload);
          });
      })
      .catch((error: AxiosError) => {
        this.status = '激活失败';
        this.isActivated = false;
        this.$message({
          showClose: true,
          message: `激活失败：${error.message}`,
          type: 'error',
        });
      })
      .finally(() => {
        this.isActivating = false;
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
