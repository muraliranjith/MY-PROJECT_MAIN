const httpStatus = require('http-status');
const { models } = require('../models');
const ApiError = require('../utils/ApiError');

const { Enterprise } = models;
/**
 * Create a enterprise
 * @param {Object} enterpriseBody
 * @returns {Promise<Enterprise>}
 */

const createEnterprise = async (enterpriseBody) => {
  if (await Enterprise.isEmailTaken(enterpriseBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const enterprise = await Enterprise.create(enterpriseBody);
  return enterprise;

};

const queryEnterprises = async (filter, options) => {
  const enterprises = await Enterprise.findAndCountAll({
    filter,
    options,
    where: filter ,
  });
return enterprises;
};


module.exports = {
  createEnterprise,
  queryEnterprises,
};