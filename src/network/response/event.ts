/* eslint-disable camelcase */
export interface EventApiResponse {
  uuid: string

  title: string

  summary: string

  content: string

  created_at: string

  author_uuid: string

  author_username?: string
}
/* eslint-enable camelcase */

export interface EventResponse extends EventApiResponse {
  createdAt: string;
}

export default function formatEventApiResponse(event: EventApiResponse): EventResponse {
  const date = new Date(event.created_at);
  const createdAt = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return Object.assign(event, { createdAt });
}
