const Joi = require('joi');

// POST /sorteos
const createSorteoSchema = Joi.object({
  nombre: Joi.string().min(1).max(100).required(),
  // Acepta "YYYY-MM-DD" o ISO completo (e.g. "2025-12-24T20:00:00-04:00")
  fechaEvento: Joi.alternatives().try(
    Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/), // solo fecha
    Joi.date().iso()                             // fecha-hora ISO
  ).required()
});

// PUT /sorteos/:id
const updateSorteoSchema = Joi.object({
  nombre: Joi.string().min(1).max(100),
  fechaEvento: Joi.alternatives().try(
    Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    Joi.date().iso()
  )
}).min(1); // exige al menos un campo

module.exports = {
  createSorteoSchema,
  updateSorteoSchema
};
