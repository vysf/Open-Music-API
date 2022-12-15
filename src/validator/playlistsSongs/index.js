/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const {PlaylistSongPayloadSchema} = require('./schema');

const PlaylistSongValidator = {
  validatePlaylistSongsPayload: (payload) => {
    const validateResult = PlaylistSongPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
