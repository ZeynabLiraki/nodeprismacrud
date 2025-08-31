export class HttpException extends Error {
  message: string;
  statusCode: number;
  errorCode: ErrorCode;
  errors?: { field: string; message: string }[];

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    errors?: { field: string; message: string }[]
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRECT_USERNAME_PASSWORD = 1003,
}
