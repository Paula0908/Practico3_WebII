// validators/participanteSchema.js
const Joi = require('joi');

// POST /sorteos/:id/participantes
const createParticipanteSchema = Joi.object({
  nombreParticipante: Joi.string().min(1).max(120).required(),
});

// PUT /participantes/:id
const updateParticipanteSchema = Joi.object({
  nombreParticipante: Joi.string().min(1).max(120).required()
});

module.exports = {
  createParticipanteSchema,
  updateParticipanteSchema
};
