/* eslint-disable no-underscore-dangle */
export default class LoginPayload {
  private _status: number;

  private _username: string;

  private _email: string;

  private _uuid: string;

  private _registerDate: string;

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
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

  get registerDate(): string {
    return this._registerDate;
  }

  set registerDate(value: string) {
    this._registerDate = value;
  }

  constructor(status: number, username: string, email: string, uuid: string, registerDate: string) {
    this._status = status;
    this._username = username;
    this._email = email;
    this._uuid = uuid;
    this._registerDate = registerDate;
  }
}
