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
    },
    userValidation: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
            subscription: Joi.string(),
            token: Joi.string(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error)
            return res.status(400).json({ message: validationResult.error.details });

        next();
    },
    updateEmailValidation: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error)
            return res.status(400).json({ message: validationResult.error.details });

        next();
    }
}

