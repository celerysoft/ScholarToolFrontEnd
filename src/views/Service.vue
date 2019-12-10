<template>
  <div class="service">
    <el-button type="primary" class="button" @click="subscribeNewService">开通新服务</el-button>

    <el-divider content-position="center">待支付的服务</el-divider>
    <div>
      <el-table :data="unpaidOrders" stripe border>
        <el-table-column
          prop="title"
          label="服务名称"
          width="240">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          width="240">
        </el-table-column>
        <el-table-column
          prop="createdAtDescription"
          label="下单时间"
          width="240">
        </el-table-column>
        <el-table-column
          label="操作"
          width="240">
          <template slot-scope="scope">
            <div style="width: 100%; text-align: center">
              <el-button class="btn-pay-order" type="primary" size="mini"
                         @click="payOrder(scope.row.uuid)">
                支付
              </el-button>
              <el-button class="btn-cancel-order" size="mini"
                         @click="openCancelOrderPopover(scope.row)">
                取消订单
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-divider content-position="center">已开通的服务</el-divider>
    <div>
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
          prop="balanceDescription"
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
import formatTradeOrderApiResponse, { TradeOrderApiResponse, TradeOrderResponse } from '@/network/response/trade-order';

@Component({
  components: {
    Footer,
  },
})

export default class Service extends Vue {
  services: ServiceResponse[] = [];

  unpaidOrders: TradeOrderResponse[] = [];

  mounted() {
    this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Service);

    this.getUserServices();
  }

  async getUserServices() {
    await Api.getUserServices()
      .then((response) => {
        this.services = (response.data.services as ServiceApiResponse[])
          .map(formatServiceApiResponse);
      });

    await Api.getUnpaidOrder()
      .then((response) => {
        this.unpaidOrders = (response.data.orders as TradeOrderApiResponse[])
          .map(formatTradeOrderApiResponse);
      });
  }

  onServiceClick(row: ServiceResponse, column: number, event: Event) {
    const { uuid } = row;
    this.$router.push({
      path: `/service/${uuid}/`,
    });
  }

  subscribeNewService() {
    this.$router.push({
      path: '/service/subscribe/',
    });
  }

  openCancelOrderPopover(order: TradeOrderResponse) {
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.$message({
        type: 'success',
        message: '删除成功!',
      });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除',
      });
    });
  }

  cancelOrder(uuid: string) {
    console.log(uuid);
    console.log(this);
  }

  payOrder(uuid: string) {
    this.$router.push(`/service/order/pay/${uuid}/`);
  }
}
</script>

<style lang="scss" scoped>
  .service {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .button {
    align-self: flex-end;
  }

  .btn-pay-order {
    margin-right: 16px;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
