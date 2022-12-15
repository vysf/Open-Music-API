/* eslint-disable linebreak-style */
const SongPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongValidator = {

  validateSongPayload: (payload) => {
    const validate = SongPayloadSchema.validate(payload);
    if (validate.error) {
      throw new InvariantError(validate.error.message);
    }
  },
};

module.exports = SongValidator;
