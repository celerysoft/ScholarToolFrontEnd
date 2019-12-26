<template>
  <div class="management-invitation-code-view">
    <el-button type="primary" class="create-new-code-button" @click="createInvitationCode">
      生成邀请码
    </el-button>
    <el-divider content-position="center"></el-divider>
    <el-table
      class="codes-table"
      :data="codes"
      border stripe>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        label="邀请者"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkUser(scope.row.inviter_uuid)">
            {{ scope.row.inviter_username }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="受邀人"
        width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.invitee_uuid && scope.row.invitee_uuid.length > 0"
                     type="text" size="mini" @click="checkUser(scope.row.invitee_uuid)">
            {{ scope.row.invitee_username }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="生成时间"
        width="130">
      </el-table-column>
      <el-table-column
        prop="invitedAt"
        label="使用时间"
        width="130">
      </el-table-column>
      <el-table-column
        prop="code"
        label="邀请码"
        width="300">
      </el-table-column>
      <el-table-column
        prop="statusDescription"
        label="状态">
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
import formatInvitationCodeApiResponse,
{ InvitationCodeResponse, InvitationCodeApiResponse } from '@/network/response/invitation-code';

@Component({
  components: {
    Footer,
  },
})

export default class ManagementInvitationCode extends Vue {
  codes: InvitationCodeResponse[] = [];

  mounted() {
    this.getData();
  }

  getData() {
    Api.getInvitationCodes(1, 10).then((response) => {
      this.codes = (response.data.invitations as InvitationCodeApiResponse[])
        .map(formatInvitationCodeApiResponse);
    });
  }

  checkUser(uuid: string) {
    this.$router.push(`/account/${uuid}/`);
  }

  createInvitationCode() {
    Api.createInvitationCode()
      .then((response) => {
        const code: InvitationCodeResponse = formatInvitationCodeApiResponse(
          response.data.invitation as InvitationCodeApiResponse,
        );
        code.inviter_username = this.$store.getters.username;
        this.codes.push(code);
        this.$notify({
          title: '',
          message: '生成邀请码成功，如果页面没有显示，请刷新页面',
          type: 'success',
        });
      });
  }
}
</script>

<style lang="scss" scoped>
  .management-invitation-code-view {
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
