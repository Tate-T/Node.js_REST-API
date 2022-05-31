const Joi = require('joi');

module.exports = {
    validation: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().alphanum().min(3).max(20).required(),
            email: Joi.string().email().required(),
            phone: Joi.number().min(14).max(16),
        });
        const validationResult = schema.validate({ name, email, phone });
        if (validationResult.error) return false;
        next()
    }
}

