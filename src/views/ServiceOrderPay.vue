<template>
  <div class="service-subscribe-pay-view">
    <div class="content" v-if="orderSnapshot && order">
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
            <div class="service-information-title">{{ orderSnapshot.title }}</div>
            <div class="service-information-subtitle">{{ orderSnapshot.subtitle }}</div>
            <div>
              <ul>
                <li v-for="description in orderSnapshot.description.split('#')"
                    :key="description">
                  {{ description }}
                </li>
              </ul>
            </div>
            <div class="service-information-item">
              <div>学术服务类型：</div>
              <div>
                {{ orderSnapshot.typeDescription }}
              </div>
              <div class="placeholder"></div>
            </div>
            <div class="service-information-item service-information-package">
              <div>学术流量：</div>
              <div>
                {{ orderSnapshot.packageDescription }}
              </div>
              <div class="placeholder"></div>
            </div>

            <div class="service-information-item service-information-auto-renew"
                 v-if="isMonthlyService">
              <div class="text-subtitle">自动续费</div>
              <el-switch
                v-model="orderSnapshot.auto_renew" disabled>
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
                  v-model="orderSnapshot.service_password"
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
              <div class="order-information-title">{{ orderSnapshot.title }}</div>
              <div class="order-information-text">{{ orderSnapshot.price }} 学术积分</div>
            </div>
            <div class="order-information-item">
              <div class="order-information-title">初装费</div>
              <div class="order-information-text">
                {{ orderSnapshot.initialization_fee }} 学术积分
              </div>
            </div>
            <div class="divider"></div>
            <div class="order-information-item">
              <div class="order-information-title">总计</div>
              <div class="order-information-text gross-amount">
                {{ order.amount }} 学术积分
              </div>
            </div>
            <div class="customer-service text-body-small text-left">
              如果你有任何疑问可以随时咨询我们的
              <span class="text-color-accent clickable" @click="contactCustomerService">客服</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-if="paymentMethods.length > 0" class="payment-methods-content">
      <el-divider>支付方式</el-divider>
      <div class="payment-methods">
        <div v-for="paymentMethod in this.paymentMethods" :key="paymentMethod.uuid"
             class="payment-methods-item">
          <div :class="{ 'text-color-secondary': !isPaymentMethodValid(paymentMethod.status) }">
            {{ paymentMethod.name }}
          </div>
          <div>
            <span v-if="paymentMethod.name === '学术积分账户余额' && scholarPaymentAccount">
              {{ scholarPaymentAccount.balance }} 学术积分
            </span>
            <el-radio v-model="paymentMethodUuid" :label="paymentMethod.uuid"
                      :disabled="!isPaymentMethodValid(paymentMethod.status)">
              <span></span>
            </el-radio>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-group" v-if="orderSnapshot && order">
      <el-button class="btn-pay" type="primary" :loading="isLoading"
                 @click="payOrder">
        支付
      </el-button>
      <el-button class="btn-cancel" @click="cancelPayment">稍后支付</el-button>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import formatTradeOrderApiResponse, {
  TradeOrderApiResponse,
  TradeOrderResponse, TradeOrderStatus,
} from '@/network/response/trade-order';
import formatSnapshotApiResponse, {
  SnapshotApiResponse,
  SnapshotResponse,
} from '@/network/response/snapshot';
import formatPaymentMethodApiResponse, {
  PaymentMethodStatus,
  PaymentMethodApiResponse,
  PaymentMethodResponse,
} from '@/network/response/payment-method';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import { GlobalEvent } from '@/toolkits/constant';
import MutationTypes from '@/store/mutation-types';
import formatScholarPaymentAccountApiResponse, {
  ScholarPaymentAccountApiResponse,
  ScholarPaymentAccountResponse,
} from '@/network/response/scholar-payment-account';

@Component({
  components: {
    Footer,
  },
})

export default class ServiceSubscribeOrder extends Vue {
  serviceOrderUuid: string = '';

  order: TradeOrderResponse | null = null;

  orderSnapshot: SnapshotResponse | null = null;

  paymentMethods: PaymentMethodResponse[] = [];

  paymentMethodUuid: string = '';

  scholarPaymentAccount: ScholarPaymentAccountResponse | null = null;

  checkResultCount: number = 0;

  checkOrderStatusInterval: number = NaN;

  // eslint-disable-next-line class-methods-use-this
  isPaymentMethodValid(status: number) {
    return status === PaymentMethodStatus.valid;
  }

  get isMonthlyService(): boolean {
    if (this.orderSnapshot) {
      return this.orderSnapshot.type === 0;
    }

    return false;
  }

  get isLoading() {
    return this.$store.getters.isLoading;
  }

  mounted() {
    this.serviceOrderUuid = this.$route.params.uuid;

    if (this.serviceOrderUuid.length > 0) {
      this.getData(this.serviceOrderUuid);
    } else {
      this.$emit(GlobalEvent.GoBack);
    }
  }

  getData(uuid: string) {
    this.$store.commit(MutationTypes.LOADING);

    Api.getOrder(uuid)
      .then((response) => {
        this.order = formatTradeOrderApiResponse(
          response.data.order as TradeOrderApiResponse,
        );
      })
      .catch((error) => {
        this.$notify({
          type: 'error',
          title: '',
          message: `获取订单信息错误，请刷新重试，错误原因${error.message}`,
        });
      });

    Api.getOrderSnapshot(uuid)
      .then((response) => {
        this.orderSnapshot = formatSnapshotApiResponse(
          response.data.snapshot as SnapshotApiResponse,
        );
      })
      .catch((error) => {
        this.$notify({
          type: 'error',
          title: '',
          message: `获取订单快照错误，请刷新重试，错误原因${error.message}`,
        });
      });

    Api.getPaymentMethods().then((response) => {
      this.paymentMethods = (response.data.payment_methods as PaymentMethodApiResponse[])
        .map(formatPaymentMethodApiResponse);
      if (this.paymentMethods.length > 1) {
        this.paymentMethodUuid = this.paymentMethods[0].uuid;
      }
    });

    Api.getPaymentAccount().then((response) => {
      this.scholarPaymentAccount = formatScholarPaymentAccountApiResponse(
        response.data.account as ScholarPaymentAccountApiResponse,
      );
    });

    this.$store.commit(MutationTypes.ON_LOADING_COMPLETED);
  }

  contactCustomerService() {
    this.$notify({
      title: '听说你想联系客服',
      message: '抱歉，没有客服',
      type: 'error',
    });
  }

  cancelPayment() {
    this.$router.push('/service/');
  }

  payOrder() {
    this.$store.commit(MutationTypes.LOADING);
    Api.payOrder(this.serviceOrderUuid, this.paymentMethodUuid, {
      showError: true,
    })
      .then((response) => {
        this.checkPayResult();
      });
  }

  checkPayResult() {
    this.checkResultCount = 0;
    this.checkOrderStatusInterval = setInterval(this.checkPayResultAction, 3000);
  }

  checkPayResultAction() {
    this.checkResultCount += 1;
    if (this.checkResultCount > 3) {
      this.payFailed();
      return;
    }
    Api.getOrder(this.serviceOrderUuid)
      .then((orderResponse) => {
        const order: TradeOrderResponse = formatTradeOrderApiResponse(
          orderResponse.data.order as TradeOrderApiResponse,
        );
        if (order.status === TradeOrderStatus.finish) {
          this.paySuccess();
        }
      });
  }

  paySuccess() {
    this.$notify({
      title: '订单支付成功',
      message: '我们正在后台为您开通学术服务，通常在3分钟内开通完毕，如果学术服务长时间没有开通成功，请联系客服',
      type: 'success',
      duration: 10000,
    });
    this.payFinally();
  }

  payFailed() {
    this.$notify({
      title: '订单支付请求已提交',
      message: '支付系统暂时没有返回支付结果，请耐心等待支付结果，不要重复支付，如果学术服务长时间没有开通成功，请联系客服',
      type: 'warning',
      duration: 10000,
    });
    this.payFinally();
  }

  payFinally() {
    this.$store.commit(MutationTypes.ON_LOADING_COMPLETED);
    clearInterval(this.checkOrderStatusInterval);
    this.$router.push('/service/');
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

  .divider {
    width: 100%;
    height: 1px;
    background: #e6e6e6;
    margin: 2px 0;
  }

  .customer-service {
    margin-top: 32px;
  }

  .payment-methods-content {
    margin-top: 24px;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .payment-methods {
    @extend .text-body;
    @extend .text-color-primary;
    width: 35%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .payment-methods-item {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
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
