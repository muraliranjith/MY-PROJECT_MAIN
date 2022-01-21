const httpStatus = require('http-status');
const { pick } = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const fs = require('fs');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const down = await JSON.stringify(user);
    fs.writeFileSync('file', down, 'binary')
  res.download('file')
  // res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  try {
    const result = await userService.queryUsers(filter, options);

    if (result.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'error');
    }
    const down = await JSON.stringify(result);
    fs.writeFileSync('file', down, 'binary');
    res.download('file')
    // res.send(result);

  } catch {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
});

const getUser = catchAsync(async (req, res) => {
  console.log("111111111111");
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const down = await JSON.stringify(user);
  fs.writeFileSync('file', down, 'binary');
  res.download('file')
  // res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const userOld = await userService.getUserById(req.params.userId);
  if (!userOld) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const user = await userService.updateUser(userOld, req.body);
  const con = JSON.stringify(user)
  fs.writeFileSync('file', con);
  res.download('file');
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  const down = await JSON.stringify(user);
  fs.writeFileSync('file', down, 'binary');
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).download('file');
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};