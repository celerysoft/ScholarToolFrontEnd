<template>
  <div class="footer">
    <div class="power-by">
      Powered by
      <el-link type="primary" @click="turnToCelerySoftWebsite">
        Celery Soft
      </el-link>
      &
      <el-link type="primary" @click="turnToVueJsWebsite">
        Vue.js
      </el-link>
      &
      <el-link type="primary" @click="turnToElementWebsite">
        Element
      </el-link>
    </div>
    <div class="copyright">
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
    @extend .text-body;
    text-align: center;
  }

  .power-by {
    margin-top: 8px;
  }

  .copyright {
    margin-top: 16px;
  }
</style>
