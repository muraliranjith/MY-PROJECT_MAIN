const { file } = require('@babel/types');
const httpStatus = require('http-status');
const { models } = require('../models');
const ApiError = require('../utils/ApiError');

const { File } = models;

/**
 * Create a file
 * @param {Object} fileBody
 * @returns {Promise<File>}
 */

const createFile = async (fileBody) => {
    const file = await File.create(fileBody);

    return file;
};

/**
 * Query for files
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFiles = async (filter, options) => {  
    try {
        const files = await File.findAndCountAll({
            filter,
            options,
            where: filter,
        });
        if (!files) {
            throw new ApiError();
        }
        return files;
    } catch {
        throw new ApiError(httpStatus.NOT_FOUND, 'file not found');
    }
};
const getfileById = async (fileId) => {
    const file = await File.findByPk(fileId);
    try {
        if (!file) {
            throw new ApiError();
        }
        return file;
    } catch {
        throw new ApiError(httpStatus.NOT_FOUND, ` FileId:  "${fileId}" File Not Found `);
    }  
}
/**
 * Delete file by id
 * @param {ObjectId} fileId
 * @returns {Promise<FIle>}
 */
const deleteFileById = async (fileId) => {
    try{
        const file = await getfileById(fileId);
        if (!file) {
            throw new ApiError();
        }
        await File.destroy(fileId);
        return file;

    }catch{
        throw new ApiError(httpStatus.NOT_FOUND, 'File Not Found');
    }
};

const deleteFiles = async (fileId) => {
    
    try {
        const result = await File.destroy({ where: { id: fileId } });
        if (result === 0) {
            throw new ApiError();
        }
        return result;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, `${fileId} File Not Found`);
    }
};

/**
 * Update file by id
 * @param {ObjectId} fileId
 * @param {Object} updateBody
 * @returns {Promise<File>}
 */
 const updateFileById = async (fileId, updateBody) => {
    const file = await getfileById(fileId);
    if (!file) {
        throw new ApiError(httpStatus.NOT_FOUND, 'file not found');
    }
    Object.assign(file, updateBody);
    await file.save();
    return file;
};



module.exports = {
    queryFiles,
    createFile,
    getfileById,
    updateFileById,
    deleteFileById,
    deleteFiles,
};
