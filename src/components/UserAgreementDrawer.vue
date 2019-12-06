<template>
  <el-drawer title="Celery Soft 学术用户协议"
             :visible.sync="visible"
             :direction="direction"
             :before-close="beforeClose"
             :close-on-press-escape="false">
    <div class="content">
      <ol class="list">
        <li>使用本站的任何服务，请遵守所在地的法律法规，必要情况下我们会积极配合执法机构的调查</li>
        <li>本站拥有随时更改任何学术服务定价，上架、下架任何学术服务的权利。已下架的学术服务无法续费使用。</li>
        <li>由于站长居无定所，朝不保夕，本站天然具有随时跑路的可能和权利。</li>
        <li>写了4条已然江郎才尽，只能偷偷补充一条，本站拥有随时更改用户协议的权利，用户同意本条相当于自动同意以后更新的协议</li>
      </ol>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class HeaderDivider extends Vue {
  @Prop()
  visible: boolean = false;

  @Prop()
  direction?: string;

  @Prop()
  beforeClose?: Function;
}

const enum DrawerDirection {
  RIGHT_TO_LEFT = 'rtl',
  LEFT_TO_RIGHT = 'ltr',
  TOP_TO_BOTTOM = 'ttb',
  BOTTOM_TO_TOP = 'btt',
}

</script>

<style lang="scss" scoped>
  .content {
    @extend .text-color-primary;
    @extend .text-subtitle;
    padding: 0 16px;
    margin-top: -16px;
  }

  .list {
    li {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
