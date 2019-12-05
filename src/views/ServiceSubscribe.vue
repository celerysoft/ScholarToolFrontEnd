<template>
  <div class="service-subscribe-view">
    <div style="width: 100%;">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="推荐" name="recommendation">
          <service-subscribe-recommendation></service-subscribe-recommendation>
        </el-tab-pane>
        <el-tab-pane label="流量套餐" name="data">
          <service-subscribe-data></service-subscribe-data>
        </el-tab-pane>
        <el-tab-pane label="包月套餐" name="monthly">
          <service-subscribe-monthly></service-subscribe-monthly>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import ServiceSubscribeRecommendation from '@/views/ServiceSubscribeRecommendation.vue';
import ServiceSubscribeData from '@/views/ServiceSubscribeData.vue';
import ServiceSubscribeMonthly from '@/views/ServiceSubscribeMonthly.vue';

@Component({
  components: {
    ServiceSubscribeRecommendation,
    ServiceSubscribeData,
    ServiceSubscribeMonthly,
    Footer,
  },
})

export default class ServiceSubscribe extends Vue {
  activeTabName: string = 'recommendation';

  // eslint-disable-next-line class-methods-use-this
  mounted() {
    // no op
  }

  // eslint-disable-next-line class-methods-use-this
  handleTabClick(tab: any, event: Event) {
    // no op
  }
}
</script>

<style lang="scss" scoped>
  .service-subscribe-view {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
