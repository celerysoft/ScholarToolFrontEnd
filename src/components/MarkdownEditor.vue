<template>
  <div class="markdown-editor-component">
    <div v-if="toolbarLocation === 'top' || toolbarLocation === 'both'" class="toolbar">
      <el-switch
        class="btn-enable-preview"
        v-model="enablePreview"
        active-text="实时预览">
      </el-switch>
      <el-button class="btn-preview" type="primary" icon="el-icon-full-screen" plain
                 @click="enableFullscreenPreview">
        全屏预览
      </el-button>
    </div>
    <div class="body">
      <el-input class="input"
                v-model="content"
                @input="handleInput"
                type="textarea" autosize></el-input>
      <vue-markdown v-if="enablePreview" :source="value" class="preview markdown-preview">
      </vue-markdown>
    </div>
    <div v-if="toolbarLocation === 'bottom' || toolbarLocation === 'both'" class="bottom-bar">
      <el-switch
        class="btn-enable-preview"
        v-model="enablePreview"
        active-text="实时预览">
      </el-switch>
      <el-button class="btn-preview" type="primary" icon="el-icon-full-screen" plain
                 @click="enableFullscreenPreview">
        全屏预览
      </el-button>
    </div>

    <el-drawer
      title="公告预览"
      direction="rtl"
      size="100%"
      :visible.sync="fullscreenPreview"
      :before-close="handleDrawerClose">
      <div class="fullscreen-preview-view">
        <div class="box">
          <div class="box-in">
            <vue-markdown :source="value" class="fullscreen-preview markdown"></vue-markdown>
          </div>
        </div>
        <el-button class="btn-disable-fullscreen-preview" type="primary" plain
                   @click="handleDrawerClose">
          关闭预览
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

const VueMarkdown = require('vue-markdown').default;

@Component({
  components: {
    VueMarkdown,
  },
})

export default class MarkdownEditor extends Vue {
  @Prop()
  value?: string;

  @Prop()
  toolbarLocation?: 'top' | 'bottom' | 'both';

  enablePreview: boolean = true;

  fullscreenPreview: boolean = false;

  get content(): string {
    if (this.value) {
      return this.value;
    }
    return '';
  }

  set content(value: string) {
    this.handleInput(value);
  }

  handleInput(value: string) {
    this.$emit('input', value);
  }

  enableFullscreenPreview() {
    this.fullscreenPreview = true;
  }

  handleDrawerClose() {
    this.fullscreenPreview = false;
  }
}
</script>

<style lang="scss" scoped>
  $line-color: #d7dae2;

  .markdown-editor-component {
    @extend .text-color-primary;
    @extend .text-body;
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid $line-color;
    border-radius: 4px;
  }

  .toolbar {
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid $line-color;
  }

  .bottom-bar {
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-top: 1px solid $line-color;
  }

  .btn-enable-preview {
    margin-left: 8px;
  }

  .btn-preview {
    margin-left: 8px;
  }

  .body {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .input {
    width: 50%;
    margin: 8px 8px;
    flex-grow: 1;
  }

  .preview {
    width: 50%;
    margin-top: -11px;
    margin-left: 8px;
    margin-right: 8px;
  }

  .box{
    width: 96%;
    padding-left: 16px;
    padding-right: 16px;
    height: 128px;
    overflow-x: hidden;
    /*background: #e6e6e6;*/
    flex-grow: 1;
  }

  .box-in{
    width: 100%;
    min-height: 100%;
    /*height: 2500px;*/
  }

  .fullscreen-preview-view {
    height: 100%;
    min-height: 100%;
    overflow-x: hidden;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .fullscreen-preview {
    width: 100%;
    margin-top: -16px;
  }

  .btn-disable-fullscreen-preview {
    margin: 16px 0;
  }
</style>
