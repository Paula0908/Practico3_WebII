const Joi = require("joi");

const identificarSchema = Joi.object({
    participanteId: Joi.number().integer().positive().required()
});

const wishlistSchema = Joi.object({
    wishlist: Joi.string().allow("").max(2000).required()
});

module.exports = { identificarSchema, wishlistSchema };