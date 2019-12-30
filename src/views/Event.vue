<template>
  <div class="event">
    <div>
      <event-list :data="events" v-on:item-click="onEventClick"></event-list>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import MutationTypes from '@/store/mutation-types';
import { MenuIndex } from '@/toolkits/constant'; // @ is an alias to /src
import formatEventApiResponse, { EventApiResponse, EventResponse } from '@/network/response/event';
import EventList from '@/components/EventList.vue';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';

@Component({
  components: {
    EventList,
    Footer,
  },
})

export default class Event extends Vue {
    events: EventResponse[] = [];

    /* eslint-disable class-methods-use-this */
    // beforeRouteEnter(to: Route, from: Route, next: any) {
    //   next((vm: Event) => {
    //     if (!vm.$store.getters.isLogin) {
    //       const toPath: string = '/login/';
    //       next(toPath);
    //     }
    //   });
    // }

    mounted() {
      this.$store.commit(MutationTypes.ON_ACTIVATED_MENU_CHANGE, MenuIndex.Event);

      this.getEvents();
    }

    getEvents() {
      Api.getEvents(1, 10)
        .then((response) => {
          this.events = (response.data.events as EventApiResponse[]).map(formatEventApiResponse);
        });
    }

    onEventClick(index: number) {
      const { uuid } = this.events[index];
      this.$router.push({
        path: `/event/${uuid}/`,
      });
    }
}
</script>

<style lang="scss" scoped>
  .event {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input {
    margin-top: 1px;
    margin-bottom: 16px;
  }

  .button {
    margin-top: 16px;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
