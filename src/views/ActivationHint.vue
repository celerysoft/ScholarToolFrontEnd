<template>
  <div class="activation-hint">
    <div class="center-container">
      <div class="content">
        <p>账号创建成功，但是还差最后一步，您才能无限制地使用Celery Soft学术</p>
        <div>
          <span>我们往您的注册邮箱</span>
          <span class="text-color-accent">{{ email }}</span>
          <span>发送了一封激活邮件，邮件正文有一个激活链接，只要点击链接在浏览器打开即可完成激活，</span>
          <span>如果链接无法点击，请将它拷贝到浏览器的地址栏中直接打开</span>
        </div>
        <p>
          您现在可以登录您的邮箱检查新邮件，如果没有收到我们发送的邮件请检查一下垃圾箱，实在没有收到的话，可以前往
          <el-button type="text" @click="turnToMyAccount">个人信息</el-button>
          点击重新发送激活邮件
        </p>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Footer,
  },
})

export default class ActivationHint extends Vue {
  get email(): string {
    return this.$store.getters.email;
  }

  get isUserActivated(): boolean {
    return this.$store.getters.userStatus !== 0;
  }

  /* eslint-disable class-methods-use-this */
  beforeRouteEnter(to: Route, from: Route, next: any) {
    next((vm: ActivationHint) => {
      if (vm.isUserActivated) {
        console.log('用户已激活，返回上级');
        let toPath: string;
        if (from !== null && from.path) {
          toPath = from.path;
        } else {
          toPath = '/';
        }
        next(toPath);
      } else {
        console.log('用户未激活');
      }
    });
  }
  /* eslint-enable class-methods-use-this */

  private turnToMyAccount() {
    this.$router.push('/account/');
  }
}
</script>

<style lang="scss" scoped>
  .activation-hint {
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
  }

  .content {
    margin-top: 64px;
    width: 720px;
    text-align: start;
  }

  .placeholder {
  }
</style>
