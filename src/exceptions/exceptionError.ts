import { ErrorCode, HttpException } from "./root";

export class ExceptionError extends HttpException {
  public error: any;
  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    error: any
  ) {
    super(message, statusCode, errorCode, error);
    this.error = error;
  }
}
