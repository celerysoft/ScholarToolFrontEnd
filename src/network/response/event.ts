export interface Event {
  uuid: string

  title: string

  summary: string

  content: string

  /* eslint-disable-next-line camelcase */
  created_at: string
}

export interface EventEx extends Event {
  createAt: string;
}

export default function getEventExFromEvent(event: Event): EventEx {
  const date = new Date(event.created_at);
  const createAt = `${date.getFullYear()}年${date.getMonth()}月${date.getDay()}日`;
  return Object.assign(event, { createAt });
}
