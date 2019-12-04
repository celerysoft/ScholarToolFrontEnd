<template>
  <div class="service-subscribe-recommendation-view">
    <div class="content">
      <el-divider>流量套餐</el-divider>
      <subscribe-service-list :data="dataServiceTemplates"></subscribe-service-list>
      <el-divider>包月套餐</el-divider>
      <subscribe-service-list :data="monthlyServiceTemplates"></subscribe-service-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SubscribeServiceList from '@/components/SubscribeServiceList.vue';
import Api from '@/network/api';
import formatServiceTemplateApiResponse, {
  ServiceTemplateApiResponse,
  ServiceTemplateResponse,
} from '@/network/response/service-template';

@Component({
  components: {
    SubscribeServiceList,
  },
})

export default class ServiceSubscribeRecommendation extends Vue {
  dataServiceTemplates: ServiceTemplateResponse[] = [];

  monthlyServiceTemplates: ServiceTemplateResponse[] = [];

  mounted() {
    this.getRecommendationServiceList();
  }

  getRecommendationServiceList() {
    Api.getRecommendationServiceTemplate()
      .then((response) => {
        this.dataServiceTemplates = (
          response.data.data_services as ServiceTemplateApiResponse[]
        ).map(formatServiceTemplateApiResponse);

        this.monthlyServiceTemplates = (
          response.data.monthly_services as ServiceTemplateApiResponse[]
        ).map(formatServiceTemplateApiResponse);
      });
  }
}
</script>

<style lang="scss" scoped>
  .service-subscribe-recommendation-view {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content {
    width: 100%;
  }
</style>
