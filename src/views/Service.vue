<template>
  <div class="root">
    <el-button type="primary" class="button">开通新服务</el-button>
    <el-divider content-position="center">已开通的服务</el-divider>

    <div class="service">
      <el-table :row-class-name="'clickable'" :data="services"
                @row-click="onServiceClick" stripe border>
        <el-table-column
          prop="title"
          label="服务名称"
          width="240">
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口"
          width="240">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="剩余学术点"
          width="240">
        </el-table-column>
        <el-table-column
          prop="statusDescription"
          label="状态"
          width="240">
        </el-table-column>
      </el-table>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MutationTypes from '@/store/mutation-types';
import { MenuIndex } from '@/toolkits/constant'; // @ is an alias to /src
import formatServiceApiResponse, {
  ServiceResponse,
  ServiceApiResponse,
} from '@/network/response/service';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';

@Component({
  components: {
    Footer,
  },
})

export default class Service extends Vue {
  services: ServiceResponse[] = [];

  mounted() {
    this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Service);

    this.getUserServices();
  }

  getUserServices() {
    Api.getUserServices()
      .then((response) => {
        this.services = (response.data.service as ServiceApiResponse[])
          .map(formatServiceApiResponse);
      });
  }

  onServiceClick(row: ServiceResponse, column: number, event: Event) {
    const { uuid } = row;
    this.$router.push({
      path: `/service/${uuid}/`,
    });
  }
}
</script>

<style lang="scss" scoped>
  .root {
    margin: 0 auto;
    /*min-height: 100%;*/
    max-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .service-header {
    text-align: end;
    width: 100%;
  }

  .button {
    align-self: flex-end;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
