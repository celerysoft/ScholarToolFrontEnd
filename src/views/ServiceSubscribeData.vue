<template>
  <div class="service-subscribe-recommendation-view">
    <div class="content">
      <div>
        <div class="text-main-title text-color-primary">
          不用不扣，毫不浪费
        </div>
        <div class="text-body text-color-primary">
          有效期内流量不清零，超长的使用周期，向流量清零说不。
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

export default class ServiceSubscribeData extends Vue {
  serviceTemplates: ServiceTemplateResponse[] = [];

  mounted() {
    this.getDataServiceList();
  }

  getDataServiceList() {
    Api.getDataServiceTemplate()
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
