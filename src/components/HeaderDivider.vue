<template>
  <div class="header-divider"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HeaderDivider extends Vue {}
</script>

<style scoped>
  .header-divider {
    width: 1px;
    height: 65%;
    background: #e6e6e6;
  }
</style>
