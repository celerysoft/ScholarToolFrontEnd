/* eslint-disable camelcase */
export interface UserApiResponse {
  uuid: string

  username: string

  email: string

  status: number

  register_date?: string

  created_at?: string

  last_login_at?: string
}
/* eslint-enable camelcase */

export interface UserResponse extends UserApiResponse {
  registerDate: string;
  lastLoginDate: string;
}

export default function formatUserApiResponse(user: UserApiResponse): UserResponse {
  let registerDate: string;
  if (user.register_date) {
    const date = new Date(user.register_date);
    registerDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } else if (user.created_at) {
    const date = new Date(user.created_at);
    registerDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    registerDate = '保密';
  }

  let lastLoginDate: string;
  if (user.last_login_at) {
    const date = new Date(user.last_login_at);
    lastLoginDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } else if (user.created_at) {
    const date = new Date(user.created_at);
    lastLoginDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    lastLoginDate = '保密';
  }

  return Object.assign(user, { registerDate, lastLoginDate });
}
