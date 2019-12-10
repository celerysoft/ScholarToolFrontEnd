/* eslint-disable camelcase */
export interface TradeOrderApiResponse {
  uuid: string

  status: number

  created_at: string

  updated_at: string

  user_uuid: string

  type: number

  amount: string

  description: string

  title?: string
}
/* eslint-enable camelcase */

export const enum TradeOrderStatus {
  initialization = 0,
  finish = 1,
  unpaid = 3,
}

export interface TradeOrderResponse extends TradeOrderApiResponse {
  createdAtDescription: string;
}

export default function formatTradeOrderApiResponse(
  tradeOrder: TradeOrderApiResponse,
): TradeOrderResponse {
  const date = new Date(tradeOrder.created_at);
  const createdAtDescription = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return Object.assign(tradeOrder, {
    createdAtDescription,
  });
}
