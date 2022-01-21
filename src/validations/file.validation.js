const Joi = require('joi');

const createFile = {
    body: Joi.object().keys({
        name: Joi.array().items(
            Joi.object()
        ),
        userId: Joi.number().integer(),
    }),
};
const getFiles = {
    query: Joi.object().keys({
        name: Joi.string(),
        scanStatus: Joi.boolean(),
        fileName: Joi.string(),
        fileType: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        fromDate: Joi.string(),
        toDate: Joi.string(),
    }),
};
const deleteFiles = {
    query: Joi.object().keys({
        ids: Joi.alternatives().try(Joi.number(), Joi.array()),
    })
}
const downfiles = {
    query: Joi.object().keys({
        ids: Joi.alternatives().try(Joi.number(), Joi.array()),
    }),
    downloadType: Joi.string(),
}
const base64 = {
    query: Joi.object().keys({
        ids: Joi.alternatives().try(Joi.number(), Joi.array()),
    })
}

module.exports = {
    getFiles,
    createFile,
    downfiles,
    deleteFiles,
    base64

};
