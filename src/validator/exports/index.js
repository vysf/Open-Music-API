/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const ExportsSongsPayloadSchema = require('./schema');

const ExportsValidator = {
  validateExportSongsPayload: (payload) => {
    const validationResult = ExportsSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
