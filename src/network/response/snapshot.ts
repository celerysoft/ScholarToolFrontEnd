/* eslint-disable camelcase */
import { ServiceTemplateType } from '@/network/response/service-template';

export interface SnapshotApiResponse {
  uuid: string

  status: number

  created_at: string

  updated_at: string

  trade_order_uuid: string

  user_uuid: string

  service_password: string

  auto_renew: number

  service_template_uuid: string

  type: number

  title: string

  subtitle: string

  description: string

  package: number

  price: number

  initialization_fee: number
}
/* eslint-enable camelcase */

export const enum SnapshotStatus {
  initialization = 0,
  valid = 1,
  invalid = 2,
}

function formatSnapshotType(serviceType: ServiceTemplateType): string {
  switch (serviceType) {
    case ServiceTemplateType.monthly:
      return '包月套餐';
    case ServiceTemplateType.data:
    default:
      return '流量套餐';
  }
}

function formatBandwidthToString(bandwidth: number): string {
  const formatBandwidth: number = bandwidth / (1024 * 1024);
  if (formatBandwidth < 1024) {
    return `${formatBandwidth.toFixed(2)} MB`;
  }

  return `${(formatBandwidth / 1024).toFixed(2)} GB`;
}

export interface SnapshotResponse extends SnapshotApiResponse {
  typeDescription: string;

  packageDescription: string;

  createdAtDescription: string;
}

export default function formatSnapshotApiResponse(
  snapshot: SnapshotApiResponse,
): SnapshotResponse {
  const typeDescription = formatSnapshotType(snapshot.type);
  const packageDescription: string = formatBandwidthToString(snapshot.package);
  const date = new Date(snapshot.created_at);
  const createdAtDescription = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return Object.assign(snapshot, {
    typeDescription,
    packageDescription,
    createdAtDescription,
  });
}
