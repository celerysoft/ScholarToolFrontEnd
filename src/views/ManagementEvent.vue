<template>
  <div class="management-service-view">
    <el-button type="primary" class="publish-event-button" @click="createEvent">
      发布新公告
    </el-button>
    <!--
    <el-divider></el-divider>
    -->
    <el-table
      class="events-table"
      :data="events"
      border stripe>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        label="标题"
        width="450">
        <template slot-scope="scope">
          <el-button type="text" @click="checkEvent(scope.row.uuid)">
            {{ scope.row.title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="checkUser(scope.row.author_uuid)">
            {{ scope.row.author_username }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="发布时间"
        width="140">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="editEvent(scope.row.uuid)"
            size="mini">编辑</el-button>
          <el-button
            size="mini" type="danger"
            @click="deleteEventHint(scope.row)">删除</el-button>
        </template>
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
import formatEventApiResponse, { EventApiResponse, EventResponse } from '@/network/response/event';

@Component({
  components: {
    Footer,
  },
})

export default class ManagementService extends Vue {
  events: EventResponse[] = [];

  mounted() {
    this.getData();
  }

  getData() {
    Api.getEventsForManagement(1, 10)
      .then((response) => {
        this.events = (response.data.events as EventApiResponse[]).map(formatEventApiResponse);
      });
  }

  checkUser(uuid: string) {
    this.$router.push(`/account/${uuid}/`);
  }

  checkEvent(uuid: string) {
    this.$router.push(`/event/${uuid}/`);
  }

  editEvent(uuid: string) {
    this.$router.push(`/management/event/edit/${uuid}/`);
  }

  deleteEventHint(event: EventResponse) {
    this.$confirm(`此操作将删除公告『${event.title}』，是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.deleteEvent(event);
    });
  }

  deleteEvent(event: EventResponse) {
    Api.deleteEventForManagement(event.uuid)
      .then((response) => {
        const index = this.events.indexOf(event);
        this.events.splice(index, 1);
        this.$notify({
          title: '',
          message: `已成功删除公告『${event.title}』`,
          type: 'success',
        });
      });
  }

  createEvent() {
    this.$router.push('/management/event/create/');
  }
}
</script>

<style lang="scss" scoped>
  .management-service-view {
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

  .publish-event-button {
    align-self: flex-end;
  }

  .events-table {
    margin-top: 24px;
    width: 100%;
  }
</style>
