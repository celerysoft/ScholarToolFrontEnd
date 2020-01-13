<template>
  <div class="home">
    <div>
      <h1 class="text-main-title">欢迎来到 Celery Soft 学术</h1>

      <div>
        <p>今天是<b>{{ date }}</b></p>
        <p v-if="histories.length > 0">来看看历史上的今天发生了什么：</p>
        <ul v-if="histories" class="today-in-history-list">
          <li class="text-left" v-for="history in histories" v-bind:key="history.title">
            <p>
              <b>{{ history.year }}</b>年，<span v-text="history.title"></span>
            </p>
          </li>
        </ul>
        <p v-if="yesterdayNewsData.length > 0">来看看昨日要闻：</p>
        <el-table
          v-if="yesterdayNewsData.length > 0"
          :data="yesterdayNewsData"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column label="新闻标题" width="650">
            <template slot-scope="scope">
              <el-button type="text" @click="viewNews(scope.row.url_for_desktop)">
                {{ scope.row.title }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="view_count"
            label="浏览数"
            width="100">
          </el-table-column>
          <el-table-column
            prop="comment_count"
            label="评论数">
          </el-table-column>
        </el-table>
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

    yesterdayNewsData: string[] = [];

    constructor() {
      super();
      const date = new Date();
      this.date = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    /* eslint-disable class-methods-use-this */
    // beforeRouteEnter(to: Route, from: Route, next: any) {
    //   next((vm: Home) => {
    //     if (!vm.$store.getters.isLogin) {
    //       const toPath: string = '/login/';
    //       next(toPath);
    //     }
    //   });
    // }

    mounted() {
      this.getTodayInHistoryData();

      this.getYesterdayNewsData();

      this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Home);
    }

    getTodayInHistoryData() {
      Api.getTodayInHistory()
        .then((response) => {
          this.histories = response.data.result;
        });
    }

    getYesterdayNewsData() {
      Api.getYesterdayNews().then((response) => {
        this.yesterdayNewsData = response.data.news;
      });
    }

    viewNews(url: string) {
      window.open(url);
    }
}
</script>

<style lang="scss" scoped>
  .home {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .today-in-history-list {
    margin-top: 16px;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
