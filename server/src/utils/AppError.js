export class AppError extends Error {
  constructor(status, code, body) {
    super(code);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}
