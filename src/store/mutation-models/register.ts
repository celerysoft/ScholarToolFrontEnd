/* eslint-disable no-underscore-dangle */
export default class RegisterPayload {
  private _jwt: string;

  private _username: string;

  private _email: string;

  private _uuid: string;

  get jwt(): string {
    return this._jwt;
  }

  set jwt(value: string) {
    this._jwt = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get uuid(): string {
    return this._uuid;
  }

  set uuid(value: string) {
    this._uuid = value;
  }

  constructor(jwt: string, username: string, email: string, uuid: string) {
    this._jwt = jwt;
    this._username = username;
    this._email = email;
    this._uuid = uuid;
  }
}
