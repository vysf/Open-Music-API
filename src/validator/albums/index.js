/* eslint-disable linebreak-style */
const AlbumPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validate = AlbumPayloadSchema.validate(payload);
    if (validate.error) {
      throw new InvariantError(validate.error.message);
    }
  },
};

module.exports = AlbumValidator;
