/* eslint-disable camelcase */
export interface ScholarPaymentAccountApiResponse {
  uuid: string

  status: number

  created_at: string

  updated_at: string

  user_uuid: string

  balance: number
}
/* eslint-enable camelcase */

export interface ScholarPaymentAccountResponse extends ScholarPaymentAccountApiResponse {}

export default function formatScholarPaymentAccountApiResponse(
  paymentMethod: ScholarPaymentAccountApiResponse,
): ScholarPaymentAccountResponse {
  return paymentMethod;
}
