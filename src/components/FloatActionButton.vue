<template>
  <div
    :class="{
      'float-action-button-group-with-sidebar-collapse': isSidebarCollapse,
      'move-left': isSidebarCollapse && isAnimationOn,
      'float-action-button-group': !isSidebarCollapse,
      'move-right': !isSidebarCollapse  && isAnimationOn,
    }">
    <slot>
      <el-tooltip :disabled="!tooltip || tooltip.length === 0" :content="tooltip" placement="bottom"
                  effect="dark">
        <el-button :type="type" :icon="icon" @click="handleButtonClick" circle></el-button>
      </el-tooltip>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component
export default class FloatActionButton extends Vue {
    @Prop()
    // private icon: string = 'el-icon-back';
    private icon?: string;

    @Prop()
    // private type: string = 'primary';
    private type?: string;

    @Prop()
    // private tooltip: string = '';
    private tooltip?: string;

    @Prop()
    private isSidebarCollapse?: boolean;

    private leftWhenSidebarCollapse: number = 0;

    private left: string = 'left: 0;';

    private lefts: number = 0;

    private isAnimationOn: boolean = false;

    @Watch('isSidebarCollapse')
    // eslint-disable-next-line class-methods-use-this
    onChildChanged(val: boolean, oldVal: boolean) {
      if (!this.isAnimationOn) {
        this.isAnimationOn = true;
      }
    }

    handleButtonClick() {
      this.$emit('click');
    }
}
</script>

<style lang="scss" scoped>
  // 300px = sidebar width
  // 64px = sidebar width with collapse
  .float-action-button-group {
    position: fixed;
    bottom: 16px;
    left: calc(((100% - 300px) - 960px) / 2 + 300px + 960px + 16px);
  }

  .float-action-button-group-with-sidebar-collapse {
    position: fixed;
    bottom: 16px;
    left: calc(((100% - 64px) - 960px) / 2 + 64px + 960px + 16px);
  }

  .move-left {
    -webkit-animation: translate-left 0.3s linear;
    animation: translate-left 0.3s linear;
  }

  .move-right {
    -webkit-animation: translate-right 0.3s linear;
    animation: translate-right 0.3s linear;
  }

  // 118px = (300px - 64px) / 2
  @-webkit-keyframes translate-left {
    0% {
      transform: translateX(118px);
    }
    50% {
      transform: translateX(59px);
    }
    100% {
      transform: translateX(0);
    }
  }

  @-webkit-keyframes translate-right {
    0% {
      transform: translateX(-118px);
    }
    50% {
      transform: translateX(-59px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>
