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
            <div class="order-information-item account-balance-item">
              <div class="order-information-title">账户余额</div>
              <div class="order-information-text account-balance">
                0 学术积分
              </div>
            </div>
            <div class="text-body-small text-left">
              如果你有任何疑问可以随时咨询我们的
              <span class="text-color-accent clickable" @click="contactCustomerService">客服</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="payment-methods">

      </div>
    </div>
    <div class="btn-group" v-if="orderSnapshot && order">
      <el-button class="btn-pay" type="primary" :loading="isLoading"
                 @click="payOrder">
        支付
      </el-button>
      <el-button class="btn-cancel" @click="cancelPayment">取消</el-button>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import formatTradeOrderApiResponse, {
  TradeOrderApiResponse,
  TradeOrderResponse,
} from '@/network/response/trade-order';
import formatSnapshotApiResponse, {
  SnapshotApiResponse,
  SnapshotResponse,
} from '@/network/response/snapshot';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import { GlobalEvent } from '@/toolkits/constant';
import MutationTypes from '@/store/mutation-types';

@Component({
  components: {
    Footer,
  },
})

export default class ServiceSubscribeOrder extends Vue {
  serviceOrderUuid: string = '';

  order: TradeOrderResponse | null = null;

  orderSnapshot: SnapshotResponse | null = null;

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
      this.getOrderInformation(this.serviceOrderUuid);
    } else {
      this.$emit(GlobalEvent.GoBack);
    }
  }

  async getOrderInformation(uuid: string) {
    this.$store.commit(MutationTypes.LOADING);

    await Api.getOrder(uuid)
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

    await Api.getOrderSnapshot(uuid)
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
    // message: '我们正在后台对新开通的学术服务进行初始化设置，预计在1分钟内开通成功',
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

    .account-balance-item {
      margin: 32px 0;
      .account-balance {
        font-weight: bold;
      }
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

  .payment-methods {
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
