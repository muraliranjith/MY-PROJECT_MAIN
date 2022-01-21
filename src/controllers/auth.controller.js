const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { emailVerificationRequired } = require('../config/config');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  if (emailVerificationRequired) {
    const emailVerificationToken = await tokenService.generateEmailVerificationToken(user);
    await emailService.sendEmailVerificationEmail(email, emailVerificationToken);
  }
  res
    .cookie('refreshToken', tokens.refresh.token, {
      maxAge: tokens.refresh.maxAge,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .status(httpStatus.CREATED)
    .send({ user, token: tokens.access });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res
    .cookie('refreshToken', tokens.refresh.token, {
      maxAge: tokens.refresh.maxAge,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .send({ user, token: tokens.access });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.refreshAuth(req.cookies.refreshToken);
  res
    .cookie('refreshToken', tokens.refresh.token, {
      maxAge: tokens.refresh.maxAge,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    .send({ user, token: tokens.access });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const emailVerification = catchAsync(async (req, res) => {
  const user = await authService.emailVerification(req.query.token);
  res.send({ isEmailVerified: !!user.isEmailVerified });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  emailVerification,
};