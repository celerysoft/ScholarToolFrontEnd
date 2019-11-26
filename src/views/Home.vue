<template>
  <div class="home">
    <div>
      <h1 class="text-main-title">欢迎来到 Celery Soft 学术</h1>

      <div>
        <p>今天是<b>{{ date }}</b>，来看看历史上的今天发生了什么：</p>
        <ul>
          <li class="text-left" v-for="history in histories" v-bind:key="history.year">
            <p>
              <b>{{ history.year }}</b>年，<span v-text="history.title"></span>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import MutationTypes from '@/store/mutation-types';
import { MenuIndex } from '@/toolkits/constant'; // @ is an alias to /src
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';

@Component({
  components: {
    Footer,
  },
})

export default class Home extends Vue {
    date: string;

    histories: string[] = [];

    constructor() {
      super();
      this.date = '';
    }

    /* eslint-disable class-methods-use-this */
    beforeRouteEnter(to: Route, from: Route, next: any) {
      next((vm: Home) => {
        if (!vm.$store.getters.isLogin) {
          const toPath: string = '/login/';
          next(toPath);
        }
      });
    }

    mounted() {
      this.getTodayInHistoryData();

      this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Home);
    }

    getTodayInHistoryData() {
      Api.getTodayInHistory()
        .then((response) => {
          this.date = response.data.today;
          this.histories = response.data.result;
        });
    }
}
</script>

<style lang="scss" scoped>
  .home {
    margin: 0 auto;
    height: 100%;
    max-width: 512px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input {
    margin-top: 1px;
    margin-bottom: 16px;
  }

  .button {
    margin-top: 16px;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
