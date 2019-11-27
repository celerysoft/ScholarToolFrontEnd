<template>
  <div class="root">
    <span :class="{ 'first-item': index === 0, 'item': index !== 0 }"
      v-for="(item, index) in data" :key="index" @click="handleListItemClick(index)">
      <el-card class="box-card clickable" shadow="hover">
        <div slot="header" class="list-title">
          <span>{{ item.title }}</span>
          <span>最新</span>
        </div>

        <div class="list-content">
          <div class="text-comment text-color-secondary">
            发布于{{ item.createAt }}
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
import { EventEx } from '@/network/response/event';

@Component
export default class EventList extends Vue {
    @Prop()
    private data?: EventEx[];

    handleListItemClick(index: number) {
      this.$emit('item-click', index);
    }
}
</script>

<style lang="scss" scoped>
  .root {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    /*align-items: center;*/
    /*align-content: space-between;*/
    span {
      margin-bottom: 16px;
      &:last-child {
         margin-bottom: 0;
      }
    }
  }

  .root span {
    max-width: 960px;
  }

  .first-item {
    width: 100%;
  }

  .item {
    width: 49%;
  }

  .box-card {
  }

  .list-title {
    @extend .text-color-accent;
    @extend .text-left;
    @extend .text-main-title;
  }

  .list-content {
    @extend .text-color-primary;
    @extend .text-left;
    @extend .text-body;
  }
</style>
