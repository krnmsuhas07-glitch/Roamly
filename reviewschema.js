const Joi = require("joi");

reviewschema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5),
})
module.exports = reviewschema;