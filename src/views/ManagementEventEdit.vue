<template>
  <div class="management-event-edit-view">
    <el-form class="publish-event-form text-left" ref="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="summary" placeholder="请输入摘要" type="textarea" autosize></el-input>
      </el-form-item>
      <el-form-item label="正文">
        <markdown-editor v-model="content" toolbar-location="both"></markdown-editor>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-create" type="primary" @click="updateEvent">更新公告</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import {
  EventApiResponse,
} from '@/network/response/event';
import { GlobalEvent } from '@/toolkits/constant';
import MarkdownEditor from '@/components/MarkdownEditor.vue';

@Component({
  components: {
    MarkdownEditor,
    Footer,
  },
})

export default class ManagementEventEdit extends Vue {
  eventUuid: string = '';

  event?: EventApiResponse;

  title: string = '';

  summary: string = '';

  content: string = '# 直接写正文，无需重复标题';

  mounted() {
    this.eventUuid = this.$route.query.uuid as string;
    if (!this.eventUuid) {
      this.$emit(GlobalEvent.GoBack);
    }

    this.getData();
  }

  getData() {
    Api.getEvent(this.eventUuid)
      .then((response) => {
        this.event = response.data.event;
        this.formatData();
      })
      .catch(() => {
        this.$notify({
          title: '',
          message: '获取数据失败，请刷新重试',
          type: 'error',
        });
      });
  }

  formatData() {
    const event = this.event as EventApiResponse;

    this.title = event.title;

    this.summary = event.summary;

    this.content = event.content;
  }

  cancel() {
    this.$emit(GlobalEvent.GoBack);
  }

  updateEvent() {
    if (!this.event) {
      this.$message({
        showClose: true,
        message: '原始数据获取失败，无法提交修改，请刷新重试',
        type: 'error',
      });
      return;
    }

    if (this.title.trim().length === 0) {
      this.$message({
        showClose: true,
        message: '请输入标题',
        type: 'warning',
      });
      return;
    }

    if (this.summary.trim().length === 0) {
      this.$message({
        showClose: true,
        message: '请输入摘要',
        type: 'warning',
      });
      return;
    }

    if (this.content.trim().length === 0) {
      this.$message({
        showClose: true,
        message: '请输入正文',
        type: 'warning',
      });
      return;
    }

    const event: EventApiResponse = {
      uuid: this.eventUuid,
      title: this.title.trim(),
      summary: this.summary.trim(),
      content: this.content.trim(),
      author_uuid: this.$store.getters.userUuid,
      created_at: '',
    };
    Api.updateEventForManagement(event)
      .then((response) => {
        this.$notify({
          title: '',
          message: `公告『${event.title}』更新成功`,
          type: 'success',
        });
        this.$emit(GlobalEvent.GoBack);
      });
  }
}
</script>

<style lang="scss" scoped>
  .management-event-edit-view {
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

  .publish-event-form {
    align-self: flex-start;
    width: 100%;
  }

  .form-item-package-container {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .package-input-number {
      flex-grow: 1;
      margin-right: 8px;
    }
  }

  .btn-create {
    margin-right: 16px;
  }
</style>
