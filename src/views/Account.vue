<template>
    <div class="account">
      <div v-if="isSelfAccountPage" class="my-account">
        <p class="text-subtitle">您在 Celery Soft 学术的服务中使用的基本信息，例如您的用户名和注册日期</p>

        <el-card class="box-card personal-information-card">
          <div slot="header">
            <div class="card-title"><strong>个人资料</strong></div>
            <div class="card-subtitle">使用 Celery Soft 学术服务的其他用户可能会看到部分信息。</div>
          </div>
          <div class="">
            <el-row>
              <el-col class="list-title" :span="4">用户名</el-col>
              <el-col class="list-text" :span="8">{{ username }}</el-col>
            </el-row>
            <el-row>
              <el-col class="list-title" :span="4">注册时间</el-col>
              <el-col class="list-text" :span="8">{{ registerDate }}</el-col>
            </el-row>
          </div>
        </el-card>

        <el-card class="box-card contact-information-card">
          <div slot="header">
            <div class="card-title">联系信息</div>
          </div>
          <div class="">
            <el-row>
              <el-col class="list-title" :span="4">电子邮箱</el-col>
              <el-col class="list-text" :span="8">{{ email }}</el-col>
              <el-col v-if="!isUserActivated" class="list-text text-color-primary"
                      :offset="8" :span="4">
                <div class="clickable text-color-accent" @click="sendActivationEmail">验证电子邮箱</div>
              </el-col>
              <div v-else>
                <el-col class="list-text" :span="8">电子邮箱已验证</el-col>
                <el-col class="list-text" :span="4">
                  <div @click="openModifyEmailDialog" class="text-color-accent clickable">
                    修改电子邮箱
                  </div>
                </el-col>
              </div>
            </el-row>
          </div>
        </el-card>

        <p class="text-body" v-if="!isUserActivated">未验证电子邮箱的用户将受到部分限制，建议您尽快验证电子邮箱。</p>

        <el-card class="box-card account-information-card">
          <div slot="header">
            <div class="card-title">账号信息</div>
          </div>
          <div class="">
            <el-row>
              <el-col class="list-title" :span="4">密码</el-col>
              <el-col class="list-text" :span="8">********</el-col>
              <el-col class="list-text text-color-primary" :offset="8" :span="4">
                <div class="clickable text-color-accent" @click="showModifyPasswordDialog">
                  修改密码
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <el-card class="box-card payment-information-card">
          <div slot="header">
            <div class="card-title">付款信息</div>
          </div>
          <div class="">
            <el-row>
              <el-col class="list-title" :span="4">学术积分账户余额</el-col>
              <el-col class="list-text" :span="8">{{ scholarPaymentAccountBalance }} 学术积分</el-col>
              <el-col class="list-text text-color-primary" :offset="8" :span="4">
                <div class="clickable text-color-accent">充值</div>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <p class="text-body" v-if="!isUserActivated">完成电子邮箱验证之后，我们将为您的账户充值一定的学术积分。</p>


        <p class="text-body" style="margin-top: 64px;">如果您想中止在 Celery Soft 学术的服务，可以尝试停用账号。
          <el-button type="text">了解详情</el-button>
        </p>
        <el-button class="btn-suspend-account" type="danger">停用账号</el-button>

        <!-- Modify password dialog -->
        <el-dialog title="修改密码" width="600px" :visible.sync="passwordDialogVisible">
          <el-form label-position="left">
            <el-form-item label="旧密码" label-width="80px">
              <el-input v-model="oldPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" label-width="80px">
              <el-input v-model="newPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" label-width="80px">
              <el-input v-model="confirmPassword" type="password" show-password></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelModifyPasswordDialog">取 消</el-button>
            <el-button type="primary" @click="modifyPassword">确 定</el-button>
          </div>
        </el-dialog>

        <!-- Modify email dialog -->
        <el-dialog title="修改电子邮箱" width="600px" :visible.sync="modifyEmailDialogVisible">
          <el-form label-position="left">
            <el-form-item label="登录密码" label-width="120px">
              <el-input v-model="password" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新电子邮箱" label-width="120px">
              <el-input v-model="newEmail" type="text"></el-input>
            </el-form-item>
            <el-form-item label="确认电子邮箱" label-width="120px">
              <el-input v-model="confirmEmail" type="text"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelModifyEmailDialog">取 消</el-button>
            <el-button type="primary" @click="modifyEmail">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="others-account" v-else>
        <el-card v-if="targetUser" class="box-card personal-information-card">
          <div slot="header">
            <div class="card-title"><strong>个人资料</strong></div>
          </div>
          <div class="">
            <el-row>
              <el-col class="list-title" :span="4">用户名</el-col>
              <el-col class="list-text" :span="8">{{ targetUser.username }}</el-col>
            </el-row>
            <el-row>
              <el-col class="list-title" :span="4">注册时间</el-col>
              <el-col class="list-text" :span="8">{{ targetUser.registerDate }}</el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      <div class="placeholder"></div>
      <Footer></Footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Api from '@/network/api';
import LoginPayload from '@/store/mutation-models/login';
import MutationTypes from '@/store/mutation-types';
import { MenuIndex, UserStatus } from '@/toolkits/constant';
import formatUserApiResponse, { UserApiResponse, UserResponse } from '@/network/response/user';
import Footer from '@/components/Footer.vue';
import formatScholarPaymentAccountApiResponse, {
  ScholarPaymentAccountApiResponse,
  ScholarPaymentAccountResponse,
} from '@/network/response/scholar-payment-account';
import { PermissionResponse } from '@/network/response/permission';

@Component({
  components: { Footer },
})

export default class Account extends Vue {
  targetUserUuid: string = '';

  targetUser: UserResponse | null = null;

  passwordDialogVisible: boolean = false;

  oldPassword: string = '';

  newPassword: string = '';

  confirmPassword: string = '';

  modifyEmailDialogVisible: boolean = false;

  password: string = '';

  newEmail: string = '';

  confirmEmail: string = '';

  scholarPaymentAccount: ScholarPaymentAccountResponse | null = null;

  get isSelfAccountPage() {
    if (this.$route.query.uuid !== undefined && this.$route.query.uuid.length > 0) {
      return this.$route.query.uuid === this.$store.getters.userUuid;
    }

    return true;
  }

  get username() {
    return this.$store.getters.username;
  }

  get registerDate() {
    return this.$store.getters.registerDate;
  }

  get uuid() {
    return this.$store.getters.userUuid;
  }

  get email() {
    return this.$store.getters.email;
  }

  get isUserActivated() {
    return this.$store.getters.userStatus !== UserStatus.WaitingActivation;
  }

  get scholarPaymentAccountBalance() {
    if (this.scholarPaymentAccount) {
      return this.scholarPaymentAccount.balance;
    }

    return 0;
  }

  mounted() {
    this.targetUserUuid = this.$route.query.uuid as string;

    this.getData();

    this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Account);
  }

  getData() {
    if (this.isSelfAccountPage) {
      this.getUserInformation();
      this.getUserPermissions();
      this.getUserScholarPaymentAccount();
    } else {
      this.getTargetUserInformation();
    }
  }

  sendActivationEmail() {
    Api.sendActivationEmail()
      .then((response) => {
        this.$message({
          showClose: true,
          message: '激活邮件发送成功，请检查您的电子邮箱',
          type: 'success',
        });
      });
  }

  getTargetUserInformation() {
    Api.getUserInformation(this.targetUserUuid).then((response) => {
      this.targetUser = formatUserApiResponse(response.data as UserApiResponse);
    });
  }

  getUserScholarPaymentAccount() {
    Api.getPaymentAccount().then((response) => {
      this.scholarPaymentAccount = formatScholarPaymentAccountApiResponse(
        response.data.account as ScholarPaymentAccountApiResponse,
      );
    });
  }

  getUserPermissions() {
    Api.getSelfPermission()
      .then((response) => {
        /* eslint-disable-next-line prefer-destructuring */
        const permissions: PermissionResponse[] = response.data.permissions;
        let isStaff = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const permission of permissions) {
          if (permission.label === 'management') {
            isStaff = true;
            break;
          }
        }
        this.$store.commit(MutationTypes.ON_RECEIVED_USER_PERMISSION, isStaff);
      });
  }

  getUserInformation() {
    Api.getSelfInformation()
      .then((response) => {
        const user: UserResponse = formatUserApiResponse(response.data as UserApiResponse);
        const {
          username, uuid, email, status, registerDate,
        } = user;

        const payload: LoginPayload = new LoginPayload(status, username, email, uuid, registerDate);
        this.$store.commit(MutationTypes.ON_RECEIVED_USER_INFORMATION, payload);
      });
  }

  showModifyPasswordDialog() {
    this.passwordDialogVisible = true;
  }

  closeModifyPasswordDialog() {
    this.passwordDialogVisible = false;
  }

  resetModifyPasswordDialog() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  cancelModifyPasswordDialog() {
    this.closeModifyPasswordDialog();
    this.resetModifyPasswordDialog();
  }

  modifyPassword() {
    const oldPassword = this.oldPassword.trim();
    const newPassword = this.newPassword.trim();
    const confirmPassword = this.confirmPassword.trim();

    if (oldPassword.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入原密码',
        type: 'warning',
      });
      return;
    }

    if (newPassword.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入密码',
        type: 'warning',
      });
      return;
    }

    if (confirmPassword.length === 0) {
      this.$message({
        showClose: true,
        message: '请确认密码',
        type: 'warning',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.$message({
        showClose: true,
        message: '两次输入的密码不一致',
        type: 'warning',
      });
      return;
    }

    Api.modifyPassword(oldPassword, newPassword)
      .then((response) => {
        this.$message({
          showClose: true,
          message: '密码修改成功，请牢记您的新密码',
          type: 'success',
        });
        this.closeModifyPasswordDialog();
        this.resetModifyPasswordDialog();
      });
  }

  openModifyEmailDialog() {
    this.modifyEmailDialogVisible = true;
  }

  closeModifyEmailDialog() {
    this.modifyEmailDialogVisible = false;
  }

  cancelModifyEmailDialog() {
    this.closeModifyEmailDialog();
    this.resetModifyEmailDialog();
  }

  resetModifyEmailDialog() {
    this.password = '';
    this.newEmail = '';
    this.confirmEmail = '';
  }

  modifyEmail() {
    const password = this.password.trim();
    const newEmail = this.newEmail.trim();
    const confirmEmail = this.confirmEmail.trim();

    if (password.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入登录密码以进行变更电子邮箱地址的操作',
        type: 'warning',
      });
      return;
    }

    if (newEmail.length === 0) {
      this.$message({
        showClose: true,
        message: '请输入新电子邮箱地址',
        type: 'warning',
      });
      return;
    }

    if (confirmEmail.length === 0) {
      this.$message({
        showClose: true,
        message: '请确认电子邮箱地址',
        type: 'warning',
      });
      return;
    }

    if (newEmail !== confirmEmail) {
      this.$message({
        showClose: true,
        message: '两次输入的电子邮箱地址不一致',
        type: 'warning',
      });
      return;
    }

    Api.sendActivationEmailForModifyingEmail(password, newEmail)
      .then((response) => {
        this.$notify({
          title: '修改电子邮箱地址的请求已发出',
          message: `我们往您的新电子邮箱地址${newEmail}发了一封确认邮件，一旦您完成确认流程，就能启用新的电子邮箱地址。在此之前，您暂时还需使用之前的电子邮箱地址。`,
          type: 'success',
          duration: 15000,
        });
        this.closeModifyEmailDialog();
        this.resetModifyEmailDialog();
      });
  }
}
</script>

<style lang="scss" scoped>
  .account {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .el-row {
      width: 100%;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .my-account {
    width: 100%;
  }

  .others-account {
    width: 100%;
  }

  .box-card {
    width: 100%;
    max-width: 960px;
  }

  .card-title {
    @extend .text-main-title;
    @extend .text-left;
  }

  .card-subtitle {
    margin-top: 4px;
    @extend .text-body;
    @extend .text-left;
  }

  .list-title {
    @extend .text-body;
    @extend .text-left;
  }

  .list-text {
    @extend .text-body;
    @extend .text-left;
  }

  .contact-information-card {
    margin-top: 32px;
  }

  .account-information-card {
    margin-top: 32px;
  }

  .payment-information-card {
    margin-top: 32px;
  }

  .input {
    margin-top: 1px;
    margin-bottom: 16px;
  }

  .button {
    margin-top: 16px;
  }

  .btn-suspend-account {
    margin-bottom: 64px;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
