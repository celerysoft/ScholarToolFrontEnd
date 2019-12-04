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
              <span class="clickable text-color-accent" @click="toggleConnectionPassword">
                <span v-if="connectionPasswordVisible">{{ service.password }}</span>
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
              <el-button type="primary" class="btn-modify-connection-password" plain
                         @click="openConnectionPasswordDialog">
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
              <el-button type="primary" class="btn-renew" plain>
                续费
              </el-button>
              <span class="placeholder"></span>
              <el-button v-if="isMonthlyService" type="primary" @click="modifyAutoRenew"
                         class="btn-modify-auto-renew" plain>
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

    <!-- 修改连接密码 -->
    <el-dialog title="修改连接密码" width="400px" :visible.sync="connectionPasswordDialogVisible">
      <el-form label-position="left">
        <el-form-item label="新密码" label-width="80px">
          <el-input v-model="password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px">
          <el-input v-model="confirmPassword" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeConnectionPasswordDialog">取 消</el-button>
        <el-button type="primary" @click="modifyConnectionPassword">确 定</el-button>
      </div>
    </el-dialog>

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
  serviceUuid: string = '';

  service: ServiceResponse | null = null;

  connectionPasswordVisible: boolean = false;

  connectionPasswordDialogVisible: boolean = false;

  password: string = '';

  confirmPassword: string = '';

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

  toggleConnectionPassword() {
    this.connectionPasswordVisible = !this.connectionPasswordVisible;
  }

  // eslint-disable-next-line class-methods-use-this
  formatProgress(percentage: number) {
    return `${percentage}%`;
  }

  resetConnectionPasswordDialog() {
    this.password = '';
    this.confirmPassword = '';
  }

  openConnectionPasswordDialog() {
    this.resetConnectionPasswordDialog();
    this.connectionPasswordDialogVisible = true;
  }

  closeConnectionPasswordDialog() {
    this.connectionPasswordDialogVisible = false;
  }

  modifyConnectionPassword() {
    const password: string = this.password.trim();
    const confirmPassword: string = this.confirmPassword.trim();

    if (password.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入新密码',
        type: 'warning',
      });
      return;
    }

    if (password !== confirmPassword) {
      this.$message({
        showClose: true,
        message: '两次输入的密码不一致',
        type: 'error',
      });
      return;
    }

    Api.modifyServicePassword(this.serviceUuid as string, password).then((response) => {
      this.$message({
        showClose: true,
        message: '服务连接密码修改成功',
        type: 'success',
      });

      if (this.service) {
        this.service.password = password;
      }

      this.closeConnectionPasswordDialog();
    });
  }

  modifyAutoRenew() {
    if (this.service && this.service.type === ServiceType.monthly) {
      let latterStatus: string;
      if (this.service.auto_renew) {
        latterStatus = '到期不自动续费';
      } else {
        latterStatus = '到期自动续费';
      }
      const message: string = `即将把自动续费的状态修改成：${latterStatus}，是否继续？`;
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        Api.modifyMonthlyServiceAutoRenewStatus(this.serviceUuid)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '修改成功',
            });
            this.getService(this.serviceUuid);
          });
      }).catch(() => {
        // no op
      });
    }
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

  .btn-modify-connection-password {
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
