/* eslint-disable linebreak-style */
const ClientError = require('./ClientError');

/**
 * error untuk menangani kesalahan authentikasi
 */
class AuthenticationError extends ClientError {
  /**
   * mengindikasikan bahwa authentikasi gagal
   * @param {string} message pesan error
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;

