<template>
  <div class="management-view">
    <div class="card-list">
      <div v-for="cardData in cardListData" :key="cardData.title">
        <management-card
          :cover-image="cardData.coverImage"
          :redirect-to="cardData.redirectTo">
          {{ cardData.title }}
        </management-card>
      </div>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ManagementCard from '@/components/ManagementCard.vue';
import Footer from '@/components/Footer.vue';

interface cardData {
  title: string

  coverImage: string

  redirectTo: string
}

@Component({
  components: {
    ManagementCard,
    Footer,
  },
})

export default class Management extends Vue {
  cardListData: cardData[] = [
    {
      title: '公告管理',
      coverImage: 'manage_event.jpg',
      redirectTo: '/management/event/',
    },
    {
      title: '用户管理',
      coverImage: 'manage_user.png',
      redirectTo: '/management/user/',
    },
    {
      title: '角色管理',
      coverImage: 'manage_role.png',
      redirectTo: '/management/role/',
    },
    {
      title: '学术服务管理',
      coverImage: 'manage_service.png',
      redirectTo: '/management/service/',
    },
    {
      title: '邀请码管理',
      coverImage: 'manage_invitation_code.jpg',
      redirectTo: '/management/invitation/',
    },
    {
      title: '用量监控',
      coverImage: 'manage_usage.jpg',
      redirectTo: '/management/usage/',
    },
  ];
}
</script>

<style lang="scss" scoped>
  .management-view {
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

  .card-list {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: -16px;
    .management-card {
      margin-top: 16px;
    }
  }
</style>
