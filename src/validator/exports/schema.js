/* eslint-disable linebreak-style */
const Joi = require('joi');

const ExportsSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});

module.exports = ExportsSongsPayloadSchema;
