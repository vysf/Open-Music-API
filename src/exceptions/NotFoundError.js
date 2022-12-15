/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const ClientError = require('./ClientError');
class NotFoundError extends ClientError {
  // Custom error yang mengindikasikan eror karena resource
  // yang diminta client tidak ditemukan.
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;

