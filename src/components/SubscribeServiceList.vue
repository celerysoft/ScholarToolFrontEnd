<template>
  <div class="subscribe-service-list-component">
    <span class="item" v-for="(item, index) in data" :key="index">
      <el-card shadow="hover">
        <div slot="header" class="list-title">
          <div>{{ item.title }}</div>
          <div class="text-body-small">{{ item.subtitle }}</div>
        </div>

        <div class="list-content">
          <ul>
            <li v-for="description in item.description.split('#')" :key="description">
              {{ description }}
            </li>
          </ul>
          <div class="btn-container">
            <el-button class="btn-subscribe" type="primary" plain
                       @click="pay(item.uuid)">立即订购</el-button>
          </div>
        </div>
      </el-card>
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ServiceTemplateResponse } from '@/network/response/service-template';

@Component
export default class SubscribeServiceList extends Vue {
  @Prop()
  private data?: ServiceTemplateResponse[];

  pay(uuid: string) {
    this.$router.push(`/service/subscribe/pay/${uuid}/`);
  }
}
</script>
<style lang="scss">
  .subscribe-service-list-component {
    .el-card__header {
      padding: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .subscribe-service-list-component {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    /*align-items: center;*/
    /*align-content: space-between;*/
  }

  .item {
    margin-right: 2%;
    width: 32%;
    &:last-child {
      margin-right: 0;
    }
  }

  .list-title {
    @extend .text-left;
    @extend .text-main-title;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    padding: 18px 20px;
    color: $--color-primary-light-9;
    background: $--color-primary;
  }

  .list-content {
    @extend .text-color-primary;
    @extend .text-left;
    @extend .text-body;
  }

  .btn-container {
    text-align: end;
  }

  .btn-subscribe {
  }
</style>
