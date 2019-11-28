export interface EventResponse {
  uuid: string

  title: string

  summary: string

  content: string

  /* eslint-disable-next-line camelcase */
  created_at: string
}

export interface EventExResponse extends EventResponse {
  createAt: string;
}

export default function getEventExFromEvent(event: EventResponse): EventExResponse {
  const date = new Date(event.created_at);
  const createAt = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return Object.assign(event, { createAt });
}
