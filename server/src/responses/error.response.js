import { STATUS_CODE } from "../constants/index.js";

class ErrorResponse extends Error {
  constructor(message, statusCode, error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message, statusCode = STATUS_CODE.BAD_REQUEST_400, error = message.err ?? statusCode) {
    super(typeof message == "string" ? message : message.msg, statusCode, error);
  }
}
