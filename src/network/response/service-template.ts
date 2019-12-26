/* eslint-disable camelcase */
export interface ServiceTemplateApiResponse {
  uuid: string

  type: number

  title: string

  subtitle: string

  description: string

  price: number

  initialization_fee: number

  package: number

  status: number

  created_at: string

  updated_at: string
}
/* eslint-enable camelcase */

export interface ServiceTemplateResponse extends ServiceTemplateApiResponse {
  typeDescription: string;

  packageDescription: string;

  statusDescription: string;

  createdAtDescription: string;
}

export const enum ServiceTemplateType {
  monthly = 0,
  data = 1,
  recommendation = 2,
}

function formatServiceType(serviceType: ServiceTemplateType): string {
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

function formatStatus(status: number): string {
  const statusTextMap: Map<number, string> = new Map([
    [0, '初始化'],
    [1, '有效'],
    [2, '作废'],
    [3, '下架'],
  ]);
  let statusDescription: string | undefined = statusTextMap.get(status);
  if (typeof statusDescription === 'undefined') {
    statusDescription = '未知状态';
  }
  return statusDescription;
}

export default function formatServiceTemplateApiResponse(
  serviceTemplate: ServiceTemplateApiResponse,
): ServiceTemplateResponse {
  const typeDescription = formatServiceType(serviceTemplate.type);
  const date = new Date(serviceTemplate.created_at);
  const createdAtDescription = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  const packageDescription: string = formatBandwidthToString(serviceTemplate.package);
  const statusDescription: string = formatStatus(serviceTemplate.status);

  return Object.assign(serviceTemplate, {
    typeDescription,
    createdAtDescription,
    packageDescription,
    statusDescription,
  });
}
