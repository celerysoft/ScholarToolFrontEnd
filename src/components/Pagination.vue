<template>
  <div class="pagination-component">
    <el-button v-if="buttonVisible" class="btn-load-more" type="primary"
    @click="loadingNextPage">加载更多</el-button>
    <el-pagination
      background
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      :current-page.sync="currentPageForChild"
      :page-size.sync="pageSizeForChild"
      :page-sizes.sync="pageSizes"
      :total.sync="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Pagination extends Vue {
  @Prop()
  page?: number;

  @Prop()
  pageSize?: number;

  @Prop()
  pageSizes?: number[];

  @Prop()
  maxPage?: number;

  @Prop()
  total?: number;

  preventNextPageChangeEvent = false;

  get buttonVisible(): boolean {
    if (this.page) {
      if (this.page === this.maxPage) {
        return false;
      }
      return this.page < 3;
    }
    return false;
  }

  get currentPageForChild(): number {
    return this.page ? this.page : 1;
  }

  set currentPageForChild(page: number) {
    this.onCurrentChange(page);
  }

  get pageSizeForChild(): number {
    return this.pageSize ? this.pageSize : 10;
  }

  set pageSizeForChild(pageSize: number) {
    this.onSizeChange(pageSize);
  }

  onSizeChange(size: number) {
    this.$emit('update:page-size', size);
    this.$emit('size-change', size);
  }

  onCurrentChange(page: number) {
    if (this.preventNextPageChangeEvent) {
      this.preventNextPageChangeEvent = false;
      return;
    }
    this.$emit('update:page', page);
    this.$emit('page-change', page);
  }

  loadingNextPage() {
    this.preventNextPageChangeEvent = true;
    this.$emit('loading-next-page');
  }
}
</script>

<style lang="scss" scoped>
  .pagination-component {
    @extend .text-color-primary;
    @extend .text-body;
    width: 100%;
    padding-top: 16px;
    padding-bottom: 16px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .btn-load-more {
    margin-bottom: 16px;
  }
</style>
