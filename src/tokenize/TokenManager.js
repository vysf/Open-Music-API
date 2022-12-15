/* eslint-disable linebreak-style */
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const config = require('../utils/config');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(
      payload, config.token.keyAccess,
  ),
  generateRefreshToken: (payload) => Jwt.token.generate(
      payload, config.token.keyRefresh,
  ),
  verifyRefreshToken: (refreshToken) => {
    try {
      // decode refresh token
      const artifacts = Jwt.token.decode(refreshToken);

      // verifikasi signature
      Jwt.token.verifySignature(artifacts, config.token.keyRefresh);

      // ambil payload
      const {payload} = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
