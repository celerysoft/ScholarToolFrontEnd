<template>
  <div class="management-service-usage-view">
    <el-alert
      :title="warningMessage"
      type="warning"
      effect="dark"
      :closable="false"
      center
      show-icon>
    </el-alert>
    <el-alert
      class="usage-item"
      v-for="usage in usages"
      :key="usage"
      :title="usage"
      type="info"
      :closable="false"
      center>
    </el-alert>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';
import MutationTypes from '@/store/mutation-types';
import { MenuIndex } from '@/toolkits/constant';

@Component({
  components: {
    Footer,
  },
})

export default class ManagementServiceUsage extends Vue {
  warningMessage: string = '';

  usages: string[] = [];

  mounted() {
    this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Management);

    this.getData();
  }

  getData() {
    Api.getServiceUsageForManagement()
      .then((response) => {
        this.warningMessage = response.data.warning_message;
        this.usages = response.data.usages;
      });
  }
}
</script>

<style lang="scss" scoped>
  .management-service-usage-view {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .placeholder {
    flex-grow: 1;
  }

  .usage-item {
    margin-top: 8px;
  }
</style>
