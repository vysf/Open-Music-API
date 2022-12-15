/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * servis autentikasi
 */
class AuthenticationsService {
  /**
   * instance pooling
   */
  constructor() {
    this.__pool = new Pool();
  }

  /**
   *
   * @param {string} token refresh token
   */
  async addRefreshToken(token) {
    // query simpan token
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.__pool.query(query);
  }

  /**
   *
   * @param {string} token refresh token
   */
  async verifyRefreshToken(token) {
    // query cek token
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.__pool.query(query);

    // handle error
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  /**
   *
   * @param {string} token refresh token
   */
  async deleteRefreshToken(token) {
    // query hapus token
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.__pool.query(query);
  }
}

module.exports = AuthenticationsService;
