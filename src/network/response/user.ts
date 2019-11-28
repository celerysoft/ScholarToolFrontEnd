export interface UserApiResponse {
  uuid: string

  username: string

  email: string

  status: number

  /* eslint-disable-next-line camelcase */
  register_date: string
}

export interface UserResponse extends UserApiResponse {
  registerDate: string;
}

export default function formatUserApiResponse(user: UserApiResponse): UserResponse {
  const date = new Date(user.register_date);
  const registerDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return Object.assign(user, { registerDate });
}
