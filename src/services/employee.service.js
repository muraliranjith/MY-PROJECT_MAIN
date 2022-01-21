const httpStatus = require('http-status');
const { models } = require('../models');
const ApiError = require('../utils/ApiError');

const { Employee } = models;
/**
 * Create a employee
 * @param {Object} employeeBody
 * @returns {Promise<Employee>}
 */

const createEmployee = async (employeeBody) => {
  if (await Employee.isEmailTaken(employeeBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const employee = await Employee.create(employeeBody);
  return employee;
};

/**
 * Query for employees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmployees = async (filter, options) => {
  const employees = await Employee.findAndCountAll({
    filter,
    options,
    where: filter ,
  });
  return employees;
};

/**
 * Get employee by id
 * @param {ObjectId} id
 * @returns {Promise<Employee>}
 */
const getEmployeeById = async (employeeId) => {
  return Employee.findByPk(employeeId);
};

/**
 * Get employee by email
 * @param {string} email
 * @returns {Promise<Employee>}
 */

const getEmployeeByEmail = async (email) => {
  return Employee.findOne({ where: { email } });
};

/**
 * Update employee by id
 * @param {ObjectId} employeeId
 * @param {Object} updateBody
 * @returns {Promise<Employee>}
 */
const updateEmployeeById = async (employeeId, updateBody) => {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await Employee.isEmailTaken(updateBody.email, employeeId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

/**
 * Update employee
 * @param {Object} employee
 * @param {Object} updateBody
 * @returns {Promise<Employee>}
 */
const updateEmployee = async (employee, updateBody) => {
  if (updateBody.email && (await Employee.isEmailTaken(updateBody.email, employee.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

/**
 * Delete employee by id
 * @param {ObjectId} employeeId
 * @returns {Promise<Employee>}
 */
const deleteEmployeeById = async (employeeId) => {
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await employee.destroy(employeeId);
  return employee;
};

module.exports = {
  createEmployee,
  queryEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  updateEmployeeById,
  updateEmployee,
  deleteEmployeeById,
};
