<template>
  <div class="management-card">
    <el-card shadow="hover" :body-style="{ padding: '0px' }" @click.native="onCardClick">
      <div>
        <img :src="require(`@/assets/${coverImage}`)" class="management-card-image">
        <div>
          <el-button type="text" class="button">
            <slot></slot>
            <template v-if="!$slots.default">{{ title }}</template>
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ManagementCard extends Vue {
    @Prop()
    private coverImage?: string;

    @Prop()
    private title?: string;

    @Prop()
    private redirectTo?: string;

    onCardClick() {
      if (this.redirectTo) {
        this.$router.push(this.redirectTo);
      }
    }
}
</script>
<style lang="scss" scoped>
  .management-card {
    @extend .clickable;
  }

  .management-card-image {
    width: 300px;
    height: 225px;
    min-width: 200px;
    min-height: 150px;
    max-width: 440px;
    max-height: 330px;
  }
</style>
