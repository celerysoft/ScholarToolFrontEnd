<template>
  <div class="event-list-root">
    <span :class="{ 'first-item': index === 0, 'other-item': index !== 0 }" class="item clickable"
          @click="handleListItemClick(index)" v-for="(item, index) in data" :key="index">
      <el-card shadow="hover" class="el-card__header">
        <div slot="header" class="list-title" style="clear: both">
          <span>{{ item.title }}</span>
          <el-tag v-if="index === 0" class="latest-tag">最新</el-tag>
        </div>

        <div class="list-content">
          <div class="text-comment text-color-secondary">
            发布于{{ item.createdAt }}
          </div>
          <br>
          {{ item.summary }}
        </div>
      </el-card>
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { EventResponse } from '@/network/response/event';

@Component
export default class EventList extends Vue {
    @Prop()
    private data?: EventResponse[];

    handleListItemClick(index: number) {
      this.$emit('item-click', index);
    }
}
</script>
<style lang="scss">
  .event-list-root {
    .el-card__header {
      padding: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .event-list-root {
    width: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    /*align-items: center;*/
    /*align-content: space-between;*/
  }

  .latest-tag {
    @extend .text-right;
  }

  .item {
    margin-bottom: 16px;
    &:last-child {
      /*margin-bottom: 0;*/
    }
  }

  .first-item {
    width: 100%;
  }

  .other-item {
    width: 49%;
    max-width: 480px;
  }

  .list-title {
    @extend .text-left;
    @extend .text-main-title;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 18px 20px;
    color: $--color-primary-light-9;
    background: $--color-primary;
  }

  .list-content {
    @extend .text-color-primary;
    @extend .text-left;
    @extend .text-body;
  }
</style>
