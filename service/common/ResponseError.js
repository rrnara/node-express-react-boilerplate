const httpStatus = require('http-status');

class ResponseError extends Error {
  constructor(param, status = httpStatus.INTERNAL_SERVER_ERROR) {
    const isErrorParam = param instanceof Error;
    const message = isErrorParam ? param.message : param;
    super(message);
    this.status = status;
    this.originalError = isErrorParam ? param : null;
  }

  static createOrReuse(error) {
    return error instanceof ResponseError ? error : new ResponseError(error);
  }

  respond(res) {
    res.status(this.status).send({ error: this.message });
  }
}

module.exports = ResponseError;
