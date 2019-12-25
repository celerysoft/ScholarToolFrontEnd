/* eslint-disable camelcase */
export interface InvitationCodeApiResponse {
  uuid: string

  status: number

  created_at: string

  updated_at: string

  code: string

  inviter_uuid: string

  invitee_uuid: string

  invited_at: string

  inviter_username?: string

  invitee_username?: string
}
/* eslint-enable camelcase */

export interface InvitationCodeResponse extends InvitationCodeApiResponse {
  createdAt: string;

  invitedAt: string;

  statusDescription: string;
}

function formatCodeStatus(status: number): string {
  const statusTextMap: Map<number, string> = new Map([
    [0, '初始化'],
    [1, '有效'],
    [2, '已删除'],
    [3, '已使用'],
  ]);
  let statusDescription: string | undefined = statusTextMap.get(status);
  if (statusDescription === undefined) {
    statusDescription = '未知状态';
  }
  return statusDescription;
}

export default function formatInvitationCodeApiResponse(
  invitationCode: InvitationCodeApiResponse,
): InvitationCodeResponse {
  const date = new Date(invitationCode.created_at);
  const createdAt = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  let invitedAt: string;
  if (invitationCode.invited_at && invitationCode.invited_at.length > 0) {
    const invitedDate: Date = new Date(invitationCode.invited_at);
    invitedAt = `${invitedDate.getFullYear()}年${invitedDate.getMonth() + 1}月${invitedDate.getDate()}日`;
  } else {
    invitedAt = '';
  }
  const statusDescription = formatCodeStatus(invitationCode.status);
  return Object.assign(invitationCode, { createdAt, invitedAt, statusDescription });
}
