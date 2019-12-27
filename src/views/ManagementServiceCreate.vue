<template>
  <div class="management-service-create-view">
    <el-form class="create-service-form text-left" ref="form" label-width="80px">
      <el-form-item label="学术类型">
        <el-radio-group v-model="serviceType">
          <el-radio :label="serviceTypeMonthly">包月服务</el-radio>
          <el-radio :label="serviceTypeData">流量服务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="title"></el-input>
      </el-form-item>
      <el-form-item label="副标题">
        <el-input v-model="subtitle"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="description"></el-input>
        <div class="text-comment text-color-secondary">
          不同描述请用 # 隔开，例如：1GB套餐流量#12个月有效期#基本技术支持
        </div>
      </el-form-item>
      <el-form-item label="流量">
        <div class="form-item-package-container">
          <el-input-number class="package-input-number" v-model="packageNumber"
                           controls-position="right" :precision="1" :step="1" :min="1" :max="1000">
          </el-input-number>
          <el-radio-group v-model="packageUnit">
            <el-radio-button label="GB"></el-radio-button>
            <el-radio-button label="MB"></el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="price">
          <template slot="append">学术积分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="初装费">
        <el-input v-model="initializationFee">
          <template slot="append">学术积分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="立即上架">
        <el-switch v-model="onSale"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-create" type="primary" @click="createService">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import {
  ServiceTemplateApiResponse,
  ServiceTemplateType,
} from '@/network/response/service-template';
import { GlobalEvent } from '@/toolkits/constant';

@Component({
  components: {
    Footer,
  },
})

export default class ManagementService extends Vue {
  serviceType: number = this.serviceTypeMonthly;

  title: string = '';

  subtitle: string = '适合浏览网页，查找资料，观看视频';

  description: string = '1GB套餐流量#12个月有效期#基本技术支持';

  packageNumber: number = 1;

  packageUnit: string = 'GB';

  price: number = 0;

  initializationFee: number = 0;

  onSale: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  get serviceTypeMonthly(): number {
    return ServiceTemplateType.monthly;
  }

  // eslint-disable-next-line class-methods-use-this
  get serviceTypeData(): number {
    return ServiceTemplateType.data;
  }

  cancel() {
    this.$emit(GlobalEvent.GoBack);
  }

  createService() {
    console.log(this.packageNumber);
    if (this.title.trim().length === 0) {
      this.$message({
        showClose: true,
        message: '请输入标题',
        type: 'warning',
      });
      return;
    }

    if (this.subtitle.trim().length === 0) {
      this.$message({
        showClose: true,
        message: '请输入副标题',
        type: 'warning',
      });
      return;
    }

    if (this.description.trim().length === 0) {
      this.$message({
        showClose: true,
        message: '请输入描述',
        type: 'warning',
      });
      return;
    }

    if (!this.packageNumber || this.packageNumber === 0) {
      this.$message({
        showClose: true,
        message: '请输入流量值',
        type: 'warning',
      });
      return;
    }

    if (!this.price || this.price === 0) {
      this.$message({
        showClose: true,
        message: '请输入价格',
        type: 'warning',
      });
      return;
    }

    if (!this.initializationFee || this.initializationFee === 0) {
      this.$message({
        showClose: true,
        message: '请输入初装费',
        type: 'warning',
      });
      return;
    }

    const mb: number = 1024 * 1024;
    const gb: number = 1024 * mb;
    let servicePackage: number = 0;
    if (this.packageUnit === 'GB') {
      servicePackage = this.packageNumber * gb;
    } else if (this.packageUnit === 'MB') {
      servicePackage = this.packageNumber * mb;
    }
    let status: number;
    if (this.onSale) {
      status = 1;
    } else {
      status = 3;
    }
    const template: ServiceTemplateApiResponse = {
      uuid: '',
      type: this.serviceType,
      title: this.title.trim(),
      subtitle: this.subtitle.trim(),
      description: this.description.trim(),
      price: this.price,
      initialization_fee: this.initializationFee,
      package: servicePackage,
      status,
      created_at: '',
      updated_at: '',
    };
    Api.createServiceTemplateForManagement(template)
      .then((response) => {
        this.$notify({
          title: '',
          message: `学术服务『${template.title}』创建成功`,
          type: 'success',
        });
        this.$emit(GlobalEvent.GoBack);
      });
  }
}
</script>

<style lang="scss" scoped>
  .management-service-create-view {
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

  .create-service-form {
    align-self: flex-start;
    width: 480px;
  }

  .form-item-package-container {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .package-input-number {
      flex-grow: 1;
      margin-right: 8px;
    }
  }

  .btn-create {
    margin-right: 16px;
  }
</style>
