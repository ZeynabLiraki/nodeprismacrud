export class HttpException extends Error {
  message: string;
  statusCode: number;
  errorCode: ErrorCode;
  error?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    error?: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.error = error;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRECT_USERNAME_PASSWORD = 1003,
  INTERNAL_SERVER_ERROR = 1004,
  INVALID_INPUT_DATA = 1005,
  UNAUTHORIZED = 1006
}
