<template>
  <div class="service-subscribe-recommendation-view">
    <div class="content">
      <div>
        <div class="text-main-title text-color-primary">
          单价更低，永不停机
        </div>
        <div class="text-body text-color-primary">
          每月1号重置套餐使用量，请根据自身需要选择一个合适的学术服务。
        </div>
      </div>
      <el-divider></el-divider>
      <subscribe-service-list :data="serviceTemplates"></subscribe-service-list>
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

export default class ServiceSubscribeMonthly extends Vue {
  serviceTemplates: ServiceTemplateResponse[] = [];

  mounted() {
    this.getMonthlyServiceList();
  }

  getMonthlyServiceList() {
    Api.getMonthlyServiceTemplate()
      .then((response) => {
        this.serviceTemplates = (
          response.data.templates as ServiceTemplateApiResponse[]
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
