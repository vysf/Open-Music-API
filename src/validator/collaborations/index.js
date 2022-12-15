/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const CollabrorationPayloadSchema = require('./schema');

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollabrorationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
