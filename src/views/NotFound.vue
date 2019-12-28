<template>
  <div class="not-found-view">
    <div class="text-title">
      {{ countDown }}秒后返回首页
    </div>
    <img class="not-found-image" alt="404" src="../assets/404.png">
    <div class="placeholder"></div>
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

export default class NotFound extends Vue {
  countDown: number = 3;

  countDownIntervalId: number = NaN;

  beforeRouteLeave(to: Route, from: Route, next: any) {
    clearInterval(this.countDownIntervalId);
    next();
  }

  mounted() {
    this.countDownIntervalId = this.startCountDown();
  }

  private startCountDown(): number {
    const id: number = setInterval(() => {
      this.countDown -= 1;
      if (this.countDown === 0) {
        clearInterval(id);
        this.turnToHomepage();
      }
    }, 1000);
    return id;
  }

  private turnToHomepage() {
    this.$router.push('/');
  }
}
</script>

<style lang="scss" scoped>
  .not-found-view {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .not-found-image {
    width: 90%;
  }
</style>
