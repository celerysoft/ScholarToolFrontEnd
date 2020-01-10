/* eslint-disable camelcase */
export interface PermissionApiResponse {
  uuid: string

  status: number

  created_at: string

  updated_at: string

  name: string

  label: string

  description: string
}
/* eslint-enable camelcase */

export interface PermissionResponse extends PermissionApiResponse {}
