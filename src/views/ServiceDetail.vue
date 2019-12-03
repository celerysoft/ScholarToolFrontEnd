<template>
  <div class="service-detail">
    <div v-if="service" class="service-detail-header">
      <div class="text-main-title text-color-primary">{{ service.title }}</div>
      <div class="text-body text-color-regular">下次付款日期：{{ service.renewAt }}</div>
    </div>

    <el-divider>学术信息</el-divider>
    <el-row v-if="service" :gutter="16">
      <el-col :span="8">
        <el-card class="service-card" shadow="always">
          <div slot="header" class="clearfix">
            <span class="text-title text-color-primary">连接</span>
          </div>
          <div class="service-card-body">
            <div>
              <span>端口</span>
              <span>{{ service.port }}</span>
            </div>
            <div>
              <span>加密方式</span>
              <span>chacha20-ietf-poly1305</span>
            </div>
            <div>
              <span>连接密码</span>
              <span class="clickable text-color-accent" @click="toggleConnectingPassword">
                <span v-if="showConnectingPassword">{{ service.password }}</span>
                <span v-else>点击查看</span>
              </span>
            </div>
            <div>
              <span>插件</span>
              <span>simple-obfs</span>
            </div>
            <div>
              <span>插件参数</span>
              <span>obfs=tls;obfs-host=bing.com</span>
            </div>
            <div>
              <span class="placeholder"></span>
              <el-button type="primary" class="btn-modify-connecting-password" plain>
                修改连接密码
              </el-button>
              <span class="placeholder"></span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="service-card" shadow="always">
          <div slot="header" class="clearfix">
            <span class="text-title text-color-primary">账单</span>
          </div>
          <div class="service-card-body">
            <div>
              <span>续费日期</span>
              <span>{{ service.renewAt }}</span>
            </div>
            <div>
              <span>续费金额</span>
              <span>{{ service.price }} 学术积分</span>
            </div>
            <div v-if="isMonthlyService">
              <span>自动续费</span>
              <span>{{ service.autoRenewDescription }}</span>
            </div>
            <div>
              <span class="placeholder"></span>
              <el-button type="primary" class="btn-modify-connecting-password" plain>
                续费
              </el-button>
              <span class="placeholder"></span>
              <el-button v-if="isMonthlyService" type="primary"
                         class="btn-modify-connecting-password" plain>
                修改自动续费
              </el-button>
              <span class="placeholder" v-if="isMonthlyService"></span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="service-card" shadow="always">
          <div slot="header" class="clearfix">
            <span class="text-title text-color-primary">用量</span>
          </div>
          <div class="service-card-body">
            <div>
              <span>已用流量</span>
              <span>{{ service.usageDescription }}</span>
            </div>
            <div>
              <span>总流量</span>
              <span>{{ service.packageDescription }}</span>
            </div>
            <div>
              <span>可用流量</span>
              <span>{{ service.balanceDescription }}</span>
            </div>
            <div>
              <el-progress style="flex-grow: 1;" :text-inside="true" :format="formatProgress"
                           :stroke-width="24" :percentage="percentage" :status="progressStatus">
              </el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-divider>节点信息</el-divider>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card class="node-card" shadow="always">
          <div slot="header" class="clearfix">
            <span class="text-title text-color-primary">香港</span>
          </div>
          <div class="node-card-body">
            <span>节点地址</span>
            <span>hk.celerysoft.science</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="node-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="text-title">洛杉矶</span>
          </div>
          <div class="node-card-body">
            <span>节点地址</span>
            <span>即将到来</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="node-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="text-title">新加坡</span>
          </div>
          <div class="node-card-body">
            <span>节点地址</span>
            <span>即将到来</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import formatServiceApiResponse, {
  ServiceResponse,
  ServiceApiResponse,
  ServiceType,
} from '@/network/response/service';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';

@Component({
  components: {
    Footer,
  },
})

export default class ServiceDetail extends Vue {
  serviceUuid?: string;

  service: ServiceResponse | null = null;

  showConnectingPassword: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  get percentage(): number {
    if (this.service) {
      return Number(((this.service.package - this.service.usage) / this.service.package * 100)
        .toFixed(2));
    }
    return 0;
  }

  get progressStatus(): string {
    let status: string;
    if (this.percentage >= 66.6) {
      status = 'success';
    } else if (this.percentage >= 33.3) {
      status = 'warning';
    } else {
      status = 'exception';
    }
    return status;
  }

  get isMonthlyService(): boolean {
    if (this.service) {
      return this.service.type === ServiceType.monthly;
    }

    return false;
  }

  mounted() {
    this.serviceUuid = this.$route.params.uuid;
    this.getService(this.serviceUuid);
  }

  getService(uuid: string) {
    Api.getService(uuid)
      .then((response) => {
        this.service = formatServiceApiResponse(response.data.service as ServiceApiResponse);
      });
  }

  toggleConnectingPassword() {
    this.showConnectingPassword = !this.showConnectingPassword;
  }

  // eslint-disable-next-line class-methods-use-this
  formatProgress(percentage: number) {
    return `${percentage}%`;
  }
}
</script>

<style lang="scss" scoped>
  .service-detail {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @extend .text-body;
    @extend .text-color-regular;
  }

  .el-row {
    margin-top: 16px;
    width: 100%;
    &:first-child {
      margin-top: 0;
    }
  }

  .el-col {
    &:first-child {
      padding-left: 0 !important;
    }
    &:last-child {
      padding-right: 0 !important;
    }
  }

  .placeholder {
    flex-grow: 1;
  }

  .service-detail-header {
    text-align: start;
    align-self: start;
  }

  .service-card {
  }

  .service-card-body {
    @extend .text-body;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    div {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      &:first-child {
        margin-top: 0;
      }
    }
  }

  .btn-modify-connecting-password {
    align-self: center;
  }

  .node-card {
  }

  .node-card-body {
    @extend .text-body;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
</style>
