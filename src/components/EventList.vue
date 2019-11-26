<template>
  <div class="root">
    <span v-for="(item, index) in data" :key="index" @click="handleListItemClick(index)">
      <el-card class="box-card clickable" shadow="hover">
        <div slot="header" class="clearfix text-color-accent text-left text-main-title">
          <span>{{ item.title }}</span>
        </div>

        <div class="text-left text-body text-color-primary">
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

<style scoped>
  .root {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    /*align-items: center;*/
    /*align-content: space-between;*/
  }

  .root span {
    max-width: 1140px;
  }

  .box-card {
    width: 960px;
  }

  .list-title {
    text-align: end;
  }

  .list-text {
    text-align: start;
  }
</style>
