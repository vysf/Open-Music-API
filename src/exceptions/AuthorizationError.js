/* eslint-disable linebreak-style */
const ClientError = require('./ClientError');

/**
 * handle error autorisasi
 */
class AuthorizationError extends ClientError {
  /**
   * inisialisasi
   * @param {string} message pesan error
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
