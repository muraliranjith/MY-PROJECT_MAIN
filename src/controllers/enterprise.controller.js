const httpStatus = require('http-status');
const { pick, pickLike } = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { enterpriseService } = require('../services');

const createEnterprise = catchAsync(async (req, res) => {
  const enterprise = await enterpriseService.createEnterprise(req.body);
  res.status(httpStatus.CREATED).send(enterprise);
});

const getEnterprises = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

    let name1 = {};

    if (req.query.name && req.query.name !== '') {

        const data3 = pickLike(req.query, ['name']);
        name1 = { name: data3.name }
    }
    const payload = { ...filter, ...name1 }
  const result = await enterpriseService.queryEnterprises(payload, options);
  res.send(result);
});

module.exports = {
  createEnterprise,
  getEnterprises,
};