const Joi = require('joi');
const { password } = require('./custom.validation');

const createEmployee = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required().custom(password),
        email: Joi.string().required().email(),
        role: Joi.string().required().valid('employee','user', 'admin'),
    }),
};

const getemployees = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getemployee = {
    params: Joi.object().keys({
        employeeId: Joi.string(),
    }),
};

const updateemployee = {
    params: Joi.object().keys({
        employeeId: Joi.required(),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            name: Joi.string(),
        })
        .min(1),
};

const deleteemployee = {
    params: Joi.object().keys({
        employeeId: Joi.string(),
    }),
};

module.exports = {
    createEmployee,
    getemployees,
    getemployee,
    updateemployee,
    deleteemployee,
};