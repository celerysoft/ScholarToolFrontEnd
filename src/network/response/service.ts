export interface ServiceApiResponse {
  uuid: string

  title: string

  package: number

  usage: number

  port: string

  status: number
}

export interface ServiceResponse extends ServiceApiResponse {
  statusDescription: string;

  balance: string;
}

function formatServiceStatus(status: number): string {
  const statusTextMap: Map<number, string> = new Map([
    [0, '待开通'],
    [1, '有效'],
    [2, '待续费'],
    [3, '失效'],
  ]);
  let statusDescription: string | undefined = statusTextMap.get(status);
  if (typeof statusDescription === 'undefined') {
    statusDescription = '未知状态';
  }
  return statusDescription;
}

function calculateRemainingPackage(total: number, usage: number): string {
  const balance: number = (total - usage) / (1024 * 1024);
  if (balance < 1024) {
    return `${balance.toFixed(2)} MB`;
  }

  return `${(balance / 1024).toFixed(2)} GB`;
}

export default function formatServiceApiResponse(service: ServiceApiResponse): ServiceResponse {
  const statusDescription = formatServiceStatus(service.status);
  const balance = calculateRemainingPackage(service.package, service.usage);
  return Object.assign(service, { statusDescription, balance });
}
