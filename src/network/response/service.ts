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

  balance: number;
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

function calculateRemainingPackage(total: number, usage: number): number {
  return total - usage;
}

export default function formatServiceApiResponse(service: ServiceApiResponse): ServiceResponse {
  const statusDescription = formatServiceStatus(service.status);
  const balance = calculateRemainingPackage(service.package, service.usage);
  return Object.assign(service, { statusDescription, balance });
}
