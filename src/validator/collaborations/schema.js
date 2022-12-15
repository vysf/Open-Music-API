/* eslint-disable linebreak-style */
const Joi = require('joi');

const CollabrorationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = CollabrorationPayloadSchema;
