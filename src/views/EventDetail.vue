<template>
  <div class="root">
    <div class="event" v-if="event">
      <div class="title">{{ event.title }}</div>
      <div class="created-at">发表于{{ event.createdAt }}</div>
      <vue-markdown class="markdown">{{ event.content }}</vue-markdown>
    </div>
    <div class="placeholder"></div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import formatEventApiResponse, { EventApiResponse, EventResponse } from '@/network/response/event';
import Footer from '@/components/Footer.vue';
import Api from '@/network/api';

const VueMarkdown = require('vue-markdown').default;

@Component({
  components: {
    VueMarkdown,
    Footer,
  },
})

export default class EventDetail extends Vue {
  event: EventResponse | null = null;

  eventUuid: string = '';

  mounted() {
    this.eventUuid = this.$route.params.uuid;
    this.getEvent(this.eventUuid);
  }

  getEvent(uuid: string) {
    Api.getEvent(uuid).then((response) => {
      this.event = formatEventApiResponse(response.data.event as EventApiResponse);
    });
  }
}
</script>

<style lang="scss">
  .root {
    margin: 0 auto;
    min-height: 100%;
    max-width: 960px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .event {
    width: 100%;
  }

  .title {
    @extend .text-main-title;
    @extend .text-color-accent;
    margin: 16px 0;
  }

  .created-at {
    @extend .text-comment;
    @extend .text-color-secondary;
  }

  .placeholder {
    flex-grow: 1;
  }
</style>
