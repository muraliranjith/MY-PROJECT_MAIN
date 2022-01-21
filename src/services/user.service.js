const httpStatus = require('http-status');
const { models } = require('../models');
const ApiError = require('../utils/ApiError');

const { User } = models;
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (userBody) => {

  try {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError();
    }
    const user = await User.create(userBody);
    return user;

  } catch {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.findAll({
    filter,
    options,
    where: filter,
  });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  return User.findByPk(userId);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */

const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  try {

    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
      throw new ApiError();
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  } catch {

    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
};

/**
 * Update user
 * @param {Object} user
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUser = async (user, updateBody) => {
  try {
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, user.id))) {
      throw new ApiError();
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;

  } catch {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  try {

    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError();
    }

    return user.destroy(userId);
  } catch {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUser,
  deleteUserById,
};