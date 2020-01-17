<template>
  <div class="management-user-view">
    <el-table
      class="user-table"
      :data="users"
      border stripe>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="checkUser(scope.row.uuid)">
            {{ scope.row.username }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="registerDate"
        label="注册时间"
        width="140">
      </el-table-column>
      <el-table-column
        prop="registerDate"
        label="最后登录时间"
        width="140">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini">编辑角色</el-button>
          <el-button
            size="mini"
            @click="openScholarBalanceDialogDialog(scope.row.uuid)">学术积分充值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :page.sync="currentPage" :page-size.sync="pageSize"
                :page-sizes.sync="pageSizes" :total.sync="totalRecord"
                :max-page="maxPage" @loading-next-page="loadingNextPage"
                @size-change="onSizeChange" @page-change="onPageChange">
    </pagination>

    <!-- 学术积分充值 -->
    <el-dialog title="学术积分充值" width="400px" :visible.sync="scholarBalanceDialogVisible">
      <el-form label-position="left">
        <el-form-item label="当前学术积分" label-width="120px">
          <div>{{ targetUserScholarBalance }}</div>
        </el-form-item>
        <el-form-item label="充值数目" label-width="120px">
          <el-input-number v-model="rechargeAmount" size="small" style="width: 100%;"
                           :min="0.00" :max="50000.00" :precision="2" :step="1000"
                           controls-position="right" label="描述文字">
          </el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScholarBalanceDialogDialog">取 消</el-button>
        <el-button type="primary" @click="rechargeScholarBalance">确 定</el-button>
      </div>
    </el-dialog>

    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import Pagination from '@/components/Pagination.vue';
import Api from '@/network/api';
import formatUserApiResponse, { UserResponse, UserApiResponse } from '@/network/response/user';
import formatScholarPaymentAccountApiResponse, {
  ScholarPaymentAccountApiResponse,
  ScholarPaymentAccountResponse,
} from '@/network/response/scholar-payment-account';
import MutationTypes from '@/store/mutation-types';
import { MenuIndex } from '@/toolkits/constant';

@Component({
  components: {
    Footer,
    Pagination,
  },
})

export default class ManagementUser extends Vue {
  users: UserResponse[] = [];

  scholarBalanceDialogVisible: boolean = false;

  targetUserScholarBalance: number | string = '加载中。。。';

  targetUserUuid: string = '';

  rechargeAmount: number = 0;

  currentPage: number = 1;

  pageSize: number = 10;

  pageSizes: number[] = [10, 20, 30, 50, 100];

  maxPage: number = 1;

  totalRecord: number = 0;

  mounted() {
    this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Management);

    this.getData();
  }

  onSizeChange() {
    this.currentPage = 1;
    this.getData();
  }

  onPageChange() {
    this.getData();
  }

  loadingNextPage() {
    this.currentPage += 1;
    Api.getUsers(this.currentPage, this.pageSize).then((response) => {
      const responseData: any = response.data;
      this.totalRecord = responseData.total;
      this.maxPage = responseData.max_page;
      this.users = this.users.concat(
        (responseData.users as UserApiResponse[]).map(formatUserApiResponse),
      );
    });
  }

  getData() {
    Api.getUsers(this.currentPage, this.pageSize).then((response) => {
      const responseData: any = response.data;
      this.totalRecord = responseData.total;
      this.maxPage = responseData.max_page;
      this.users = (responseData.users as UserApiResponse[]).map(formatUserApiResponse);
    });
  }

  checkUser(uuid: string) {
    this.$router.push(`/account?uuid=${uuid}`);
  }

  openScholarBalanceDialogDialog(userUuid: string) {
    this.resetScholarBalanceDialogDialog();
    this.scholarBalanceDialogVisible = true;
    this.targetUserUuid = userUuid;
    Api.getUserScholarPaymentAccount(userUuid)
      .then((response) => {
        const account: ScholarPaymentAccountResponse = formatScholarPaymentAccountApiResponse(
          response.data.account as ScholarPaymentAccountApiResponse,
        );
        this.targetUserScholarBalance = account.balance;
      })
      .catch((error) => {
        this.targetUserScholarBalance = '加载失败';
      });
  }

  closeScholarBalanceDialogDialog() {
    this.scholarBalanceDialogVisible = false;
  }

  resetScholarBalanceDialogDialog() {
    this.targetUserScholarBalance = '加载中。。。';
    this.rechargeAmount = 0;
    this.targetUserUuid = '';
  }

  rechargeScholarBalance() {
    Api.rechargeUserScholarPaymentAccount(this.targetUserUuid, this.rechargeAmount)
      .then((response) => {
        this.$notify({
          type: 'success',
          title: '充值请求已提交',
          message: `${this.rechargeAmount}学术积分将马上充值到目标账户`,
        });
        this.closeScholarBalanceDialogDialog();
      });
  }
}
</script>

<style lang="scss" scoped>
  .management-user-view {
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

  .user-table {
    width: 100%;
  }
</style>
