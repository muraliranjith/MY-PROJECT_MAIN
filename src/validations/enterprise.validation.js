const Joi = require('joi');
const { password } = require('./custom.validation');

const createEnterprise = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        role: Joi.string().required().valid('employee','user', 'admin','enterprise'),
    }),
};
const getenterprises = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};


module.exports = {
    createEnterprise,
    getenterprises,
};