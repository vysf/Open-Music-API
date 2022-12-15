/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const ClientError = require('./ClientError');
class InvariantError extends ClientError {
  // Custom error yang mengindikasikan eror karena kesalahan
  // bisnis logic pada data yang dikirimkan oleh client.
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'InvariantError';
    this.statusCode = statusCode;
  }
}

module.exports = InvariantError;

