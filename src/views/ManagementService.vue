<template>
  <div class="management-service-view">
    <el-button type="primary" class="create-new-code-button" @click="createService">
      创建套餐
    </el-button>
    <el-divider content-position="center"></el-divider>
    <el-table
      class="codes-table"
      :data="services"
      border stripe>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="typeDescription"
        label="类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="120">
      </el-table-column>
      <el-table-column
        prop="statusDescription"
        label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini">编辑</el-button>
          <el-button
            size="mini" type="danger"
            @click="openScholarBalanceDialogDialog(scope.row.uuid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import formatServiceTemplateApiResponse,
{ ServiceTemplateResponse, ServiceTemplateApiResponse } from '@/network/response/service-template';

@Component({
  components: {
    Footer,
  },
})

export default class ManagementService extends Vue {
  services: ServiceTemplateResponse[] = [];

  mounted() {
    this.getData();
  }

  getData() {
    Api.getServiceTemplateForManagement(1, 10).then((response) => {
      this.services = (response.data.templates as ServiceTemplateApiResponse[])
        .map(formatServiceTemplateApiResponse);
    });
  }

  createService() {
    console.log(this);
  }
}
</script>

<style lang="scss" scoped>
  .management-service-view {
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

  .create-new-code-button {
    align-self: flex-end;
  }

  .codes-table {
    width: 100%;
  }
</style>
