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

export default function formatServiceTemplateApiResponse(
  serviceTemplate: ServiceTemplateApiResponse,
): ServiceTemplateResponse {
  const typeDescription = formatServiceType(serviceTemplate.type);
  const date = new Date(serviceTemplate.created_at);
  const createdAtDescription = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  const packageDescription: string = formatBandwidthToString(serviceTemplate.package);

  return Object.assign(serviceTemplate, {
    typeDescription,
    createdAtDescription,
    packageDescription,
  });
}
