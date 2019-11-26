<template>
  <div class="footer">
    <div class="text-body">
      Powered by
      <el-button type="text" @click="turnToCelerySoftWebsite">
        Celery Soft
      </el-button>
      <el-button type="text" @click="turnToVueJsWebsite">
        Vue.js
      </el-button>
      <el-button type="text" @click="turnToElementWebsite">
        Element
      </el-button>
    </div>
    <div class="text-body">
      Copyright © 2017-2020
      <el-button type="text" @click="turnToWebsite">
        www.celerysoft.science
      </el-button>
      All rights reserved.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {
  turnToCelerySoftWebsite = () => {
    window.open('https://www.celerysoft.com/');
  };

  turnToVueJsWebsite = () => {
    window.open('https://vuejs.org/');
  };

  turnToElementWebsite = () => {
    window.open('https://element.eleme.io/');
  };

  turnToWebsite = () => {
    window.open('https://www.celerysoft.science/');
  };
}
</script>

<style lang="scss" scoped>
  .footer {
    @extend .text-color-primary;
    text-align: center;
  }
</style>
