<template>
  <div class="service-subscribe-pay-view">
    <div v-if="serviceTemplate" class="content">
      <el-row :gutter="32">
        <el-col :span="12">
          <div class="text-main-title text-color-primary">
            服务信息
          </div>
          <el-divider></el-divider>
          <!--
           <el-alert
             title="即将订购的服务的信息" style="margin: 16px 0;"
             type="info" :closable="false" center>
           </el-alert>
           -->
          <div class="service-information">
            <div class="service-information-title">{{ serviceTemplate.title }}</div>
            <div class="service-information-subtitle">{{ serviceTemplate.subtitle }}</div>
            <div>
              <ul>
                <li v-for="description in serviceTemplate.description.split('#')"
                    :key="description">
                  {{ description }}
                </li>
              </ul>
            </div>
            <div class="service-information-item">
              <div>学术服务类型：</div>
              <div>
                {{ serviceTemplate.typeDescription }}
              </div>
              <div class="placeholder"></div>
            </div>
            <div class="service-information-item service-information-package">
              <div>学术流量：</div>
              <div>
                {{ serviceTemplate.packageDescription }}
              </div>
              <div class="placeholder"></div>
            </div>

            <div class="service-information-item service-information-auto-renew"
                 v-if="isMonthlyService">
              <div class="text-subtitle">自动续费</div>
              <el-switch
                v-model="autoRenew">
              </el-switch>
            </div>
            <div class="service-information-password-hint"
                 v-if="isMonthlyService">
              <div class="text-comment text-color-secondary">
                我们会在每个月初自动扣除续费所需的学术积分
              </div>
            </div>

            <div class="service-information-item service-information-password">
              <div class="text-subtitle">学术服务连接密码</div>
              <div class="input-service-password">
                <el-input
                  placeholder="请输入学术服务连接密码"
                  v-model="servicePassword"
                  clearable disabled>
                </el-input>
              </div>
            </div>
            <div class="service-information-password-hint">
              <div class="text-comment text-color-secondary">
                仅用于连接学术服务，和账户登录密码无关，可使用简单密码组合
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="text-main-title text-color-primary">
            订单信息
          </div>
          <el-alert
            title="订购服务的支付信息" style="margin: 16px 0;"
            type="warning" :closable="false" center>
          </el-alert>
          <!--
          <el-divider></el-divider>
          -->
          <div class="order-information">
            <div class="order-information-item">
              <div class="order-information-title">{{ serviceTemplate.title }}</div>
              <div class="order-information-text">{{ serviceTemplate.price }} 学术积分</div>
            </div>
            <div class="order-information-item">
              <div class="order-information-title">初装费</div>
              <div class="order-information-text">
                <del>{{ serviceTemplate.initialization_fee }} 学术积分</del>
              </div>
            </div>
            <div class="divider"></div>
            <div class="order-information-item">
              <div class="order-information-title">总计</div>
              <div class="order-information-text gross-amount">
                {{ serviceTemplate.price }} 学术积分
              </div>
            </div>
            <div class="text-body-small text-left">
              如果你有任何疑问可以随时咨询我们的
              <span class="text-color-accent clickable" @click="contactCustomerService">客服</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="cb-agreement">
        <el-checkbox v-model="checkedUserAgreement">
          我已阅读并同意
          <span class="user-agreement" @click.prevent="readUserAgreement">
            《用户协议》
          </span>
        </el-checkbox>
      </div>
    </div>
    <user-agreement-drawer :visible="userAgreementVisible" direction="ltr"
                           :before-close="() => userAgreementVisible = false">
    </user-agreement-drawer>
    <div class="btn-group">
      <el-button class="btn-pay" type="primary" :loading="isLoading"
                 @click="createOrder">
        确认订单
      </el-button>
      <el-button class="btn-cancel" @click="goBack">取消</el-button>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import formatServiceTemplateApiResponse, {
  ServiceTemplateApiResponse,
  ServiceTemplateResponse, ServiceTemplateType,
} from '@/network/response/service-template';
import formatServiceApiResponse, {
  ServiceResponse,
  ServiceApiResponse,
  ServiceType,
} from '@/network/response/service';
import UserAgreementDrawer from '@/components/UserAgreementDrawer.vue';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import { GlobalEvent } from '@/toolkits/constant';

@Component({
  components: {
    UserAgreementDrawer,
    Footer,
  },
})

export default class ServiceRenewOrder extends Vue {
  serviceUuid: string = '';

  service: ServiceResponse | null = null;

  serviceTemplate: ServiceTemplateResponse | null = null;

  userAgreementVisible: boolean = false;

  checkedUserAgreement: boolean = false;

  servicePassword: string = '';

  autoRenew: boolean = true;

  get isMonthlyService(): boolean {
    if (this.serviceTemplate) {
      return this.serviceTemplate.type === ServiceTemplateType.monthly;
    }

    return false;
  }

  get isLoading() {
    return this.$store.getters.isLoading;
  }

  mounted() {
    this.serviceUuid = this.$route.query.service_uuid as string;
    if (!this.serviceUuid) {
      this.$emit(GlobalEvent.GoBack);
    }

    if (this.serviceUuid.length > 0) {
      this.getData();
    } else {
      this.$emit(GlobalEvent.GoBack);
    }
  }

  async getData() {
    await Api.getService(this.serviceUuid)
      .then((response) => {
        this.service = formatServiceApiResponse(response.data.service as ServiceApiResponse);
        this.autoRenew = this.service.auto_renew === 1;
        this.servicePassword = this.service.password;
      });

    await Api.getServiceTemplate((this.service as ServiceResponse).template_uuid)
      .then((response) => {
        this.serviceTemplate = formatServiceTemplateApiResponse(
          response.data.template as ServiceTemplateApiResponse,
        );
      });
  }

  contactCustomerService() {
    this.$notify({
      title: '听说你想联系客服',
      message: '抱歉，没有客服',
      type: 'error',
    });
  }

  readUserAgreement() {
    this.userAgreementVisible = true;
  }

  goBack() {
    this.$emit(GlobalEvent.GoBack);
  }

  createOrder() {
    if (!this.checkedUserAgreement) {
      this.$message({
        type: 'warning',
        message: '请阅读并同意用户协议',
        showClose: true,
      });
      return;
    }

    Api.createRenewOrder(this.serviceUuid)
      .then((response) => {
        this.$notify({
          title: '订单创建成功',
          message: '请在30分钟内完成支付，否则订单将被取消',
          type: 'info',
          duration: 10000,
        });
        this.$router.push(`/service/order/pay?order_uuid=${response.data.uuid}`);
      });
  }
}
</script>

<style lang="scss" scoped>
  .service-subscribe-pay-view {
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

  .content {
    width: 100%;
  }

  .service-information {
    /*padding: 0 16px;*/
    @extend .text-left;
    @extend .text-body;
    @extend .text-color-primary;
    .service-information-title {
      @extend .text-main-title;
    }
    .service-information-subtitle {
      @extend .text-subtitle;
      @extend .text-color-regular;
    }
    .service-information-description {
    }
    .service-information-password-hint {
      width: 100%;
      text-align: end;
    }
    .service-information-package {
      margin-bottom: 16px;
    }
    .service-information-auto-renew {
      margin-top: 16px;
    }
    .service-information-password {
      margin-top: 16px;
    }
    .input-service-password {
      flex-grow: 1;
      margin-left: 16px;
    }
    .service-information-item {
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .order-information {
    @extend .text-body;
    @extend .text-color-primary;
    .order-information-item {
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .order-information-title {
    }
    .order-information-text {
      text-align: end;
    }

    .gross-amount {
      font-weight: bold;
    }
  }

  .user-agreement {
    @extend .text-color-accent;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: #e6e6e6;
    margin: 2px 0;
  }

  .cb-agreement {
    @extend .text-body;
    @extend .text-color-primary;
    margin-top: 48px;
  }

  .btn-group {
    margin-top: 32px;
  }

  .btn-pay {
    margin-right: 16px;
  }

  .btn-cancel {
  }
</style>
