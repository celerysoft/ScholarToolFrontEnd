/* eslint-disable camelcase */
export interface ServiceApiResponse {
  uuid: string

  user_uuid: string

  template_uuid: string

  type: number

  title: string

  price: number

  package: number

  usage: number

  port: string

  password: string

  status: number

  auto_renew: number

  billing_date: string
}
/* eslint-enable camelcase */

export interface ServiceResponse extends ServiceApiResponse {
  statusDescription: string;

  balance: number

  balanceDescription: string;

  usageDescription: string;

  packageDescription: string;

  autoRenewDescription: string;

  billingDate: string;
}

export const enum ServiceType {
  monthly = 0,
  data = 1,
}

function formatServiceType(serviceType: ServiceType): string {
  switch (serviceType) {
    case ServiceType.monthly:
      return '包月套餐';
    case ServiceType.data:
    default:
      return '流量套餐';
  }
}

function formatAutoRenewDescription(autoRenew: number): string {
  switch (autoRenew) {
    case 0:
      return '否';
    case 1:
    default:
      return '是';
  }
}

function formatServiceStatus(status: number): string {
  const statusTextMap: Map<number, string> = new Map([
    [0, '待开通'],
    [1, '有效'],
    [3, '已暂停'],
    [4, '失效'],
    [5, '已欠费'],
  ]);
  let statusDescription: string | undefined = statusTextMap.get(status);
  if (typeof statusDescription === 'undefined') {
    statusDescription = '未知状态';
  }
  return statusDescription;
}

function formatBandwidthToString(bandwidth: number): string {
  const formatBandwidth: number = bandwidth / (1024 * 1024);
  if (formatBandwidth < 1024) {
    return `${formatBandwidth.toFixed(2)} MB`;
  }

  return `${(formatBandwidth / 1024).toFixed(2)} GB`;
}

export default function formatServiceApiResponse(service: ServiceApiResponse): ServiceResponse {
  let billingDate: string;
  if (service.billing_date) {
    const date = new Date(service.billing_date);
    billingDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    billingDate = '';
  }
  let autoRenewDescription: string;
  if (service.type === ServiceType.monthly) {
    autoRenewDescription = formatAutoRenewDescription(service.auto_renew);
  } else {
    autoRenewDescription = '不适用';
  }
  const statusDescription: string = formatServiceStatus(service.status);
  const balance: number = service.package - service.usage;
  const balanceDescription: string = formatBandwidthToString(service.package - service.usage);
  const usageDescription: string = formatBandwidthToString(service.usage);
  const packageDescription: string = formatBandwidthToString(service.package);

  return Object.assign(service, {
    statusDescription,
    balance,
    balanceDescription,
    usageDescription,
    packageDescription,
    autoRenewDescription,
    billingDate,
  });
}
