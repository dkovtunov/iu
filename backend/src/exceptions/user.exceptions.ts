export class EmailExistsException extends Error {
  constructor() {
    super('email already exists');
  }
}
