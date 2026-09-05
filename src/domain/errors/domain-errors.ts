export abstract class DomainError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidUrlError extends DomainError {
  readonly statusCode = 400;

  constructor(message: string = 'The provided URL is invalid. It must be a valid HTTP or HTTPS URL.') {
    super(message);
  }
}

export class InvalidCustomCodeError extends DomainError {
  readonly statusCode = 400;

  constructor(message: string = 'The custom short code is invalid. It must be 3-30 alphanumeric or hyphen/underscore characters.') {
    super(message);
  }
}

export class UrlNotFoundError extends DomainError {
  readonly statusCode = 404;

  constructor(shortCode: string) {
    super(`URL with short code '${shortCode}' was not found.`);
  }
}

export class DuplicateCodeError extends DomainError {
  readonly statusCode = 409;

  constructor(shortCode: string) {
    super(`Short code '${shortCode}' already exists.`);
  }
}
