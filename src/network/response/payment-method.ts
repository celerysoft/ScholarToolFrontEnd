/* eslint-disable camelcase */
export interface PaymentMethodApiResponse {
  uuid: string

  status: number

  created_at: string

  updated_at: string

  name: string
}
/* eslint-enable camelcase */

export const enum PaymentMethodStatus {
  initialization = 0,
  valid = 1,
  invalid = 2,
}

export interface PaymentMethodResponse extends PaymentMethodApiResponse {}

export default function formatPaymentMethodApiResponse(
  paymentMethod: PaymentMethodApiResponse,
): PaymentMethodResponse {
  return paymentMethod;
}
