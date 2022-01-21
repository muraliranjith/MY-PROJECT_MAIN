const httpStatus = require('http-status');
const { pick, pickLike } = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { employeeService } = require('../services');

const createEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  res.status(httpStatus.CREATED).send(employee);
});

const getEmployees = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  let name1 = {};

  if (req.query.name && req.query.name !== '') {

    const data3 = pickLike(req.query, ['name']);
    name1 = { name: data3.name }
  }
  const payload = { ...filter, ...name1 }
  const result = await employeeService.queryEmployees(payload, options);
  res.send(result);
});

const getEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }
  res.send(employee);
});

const updateEmployee = catchAsync(async (req, res) => {
  const employeeOld = await employeeService.getEmployeeById(req.params.employeeId);
  if (!employeeOld) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }
  const employee = await employeeService.updateEmployee(employeeOld, req.body);
  res.send(employee);
});

const deleteEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.employeeId);
  await employeeService.deleteEmployeeById(req.params.employeeId);
  res.status(httpStatus.NO_CONTENT).send(employee);
});

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};