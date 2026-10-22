import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import tokenService from './tokenService.js';
import emailService from './emailService.js';
import welcomeVerifyTemplate from '../templates/email/welcomeVerify.js';
import resetPasswordTemplate from '../templates/email/resetPassword.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const registerUser = async ({ name, email, phone, password, address }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const rawVerifyToken = tokenService.generateRandomToken();
  const hashedVerifyToken = tokenService.hashToken(rawVerifyToken);
  const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Citizen registration strictly enforces role: "User"
  const user = await User.create({
    name,
    email,
    phone,
    password,
    address,
    role: 'User',
    isEmailVerified: false,
    emailVerificationToken: hashedVerifyToken,
    emailVerificationExpires: verifyExpires,
  });

  // Dispatch verification email in background
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${rawVerifyToken}`;
  emailService.sendMail({
    to: user.email,
    subject: 'Verify Your Email Address - Crowd Report',
    html: welcomeVerifyTemplate({ name: user.name, verifyUrl }),
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.isLocked) {
    throw new AppError(
      'Account is temporarily locked due to multiple failed login attempts. Please try again after 15 minutes.',
      403
    );
  }

  if (user.isBlocked) {
    throw new AppError(user.blockReason || 'Account is suspended. Please contact platform administration.', 403);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    await user.incLoginAttempts();
    throw new AppError('Invalid email or password', 401);
  }

  // Reset failed login attempts on successful authentication
  await user.resetLoginAttempts();

  const tokens = tokenService.generateAuthTokens(user);
  const tokenHash = tokenService.hashToken(tokens.refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  const userObj = user.toObject();
  if (user.role === 'Resolver') {
    const profile = await ResolverProfile.findOne({ user: user._id });
    userObj.resolverStatus = profile?.status || 'Pending';
    userObj.rejectionReason = profile?.rejectionReason || null;
  }

  return { user: userObj, tokens };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  const tokenHash = tokenService.hashToken(refreshToken);
  await RefreshToken.deleteOne({ tokenHash });
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  const tokenHash = tokenService.hashToken(refreshToken);
  const tokenRecord = await RefreshToken.findOne({ tokenHash });

  if (!tokenRecord) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Token reuse detection: if revoked token is presented, revoke entire family
  if (tokenRecord.isRevoked) {
    await RefreshToken.deleteMany({ user: tokenRecord.user });
    throw new AppError('Compromised session detected. All sessions terminated. Please log in again.', 401);
  }

  const user = await User.findById(tokenRecord.user);
  if (!user || user.isBlocked) {
    throw new AppError('User not found or account suspended', 401);
  }

  const tokens = tokenService.generateAuthTokens(user);
  const newHash = tokenService.hashToken(tokens.refreshToken);

  // Rotate token: revoke old token and record new hash
  tokenRecord.isRevoked = true;
  tokenRecord.replacedByTokenHash = newHash;
  await tokenRecord.save();

  // Create new active refresh token
  await RefreshToken.create({
    user: user._id,
    tokenHash: newHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, tokens };
};

export const verifyEmail = async (token) => {
  const tokenHash = tokenService.hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return user;
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  // Always return safely without revealing user existence (timing safe)
  if (!user || user.isBlocked) {
    return;
  }

  const rawToken = tokenService.generateRandomToken();
  const tokenHash = tokenService.hashToken(rawToken);

  user.passwordResetToken = tokenHash;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
  emailService.sendMail({
    to: user.email,
    subject: 'Reset Your Password - Crowd Report',
    html: resetPasswordTemplate({ name: user.name, resetUrl }),
  });
};

export const resetPassword = async ({ token, newPassword }) => {
  const tokenHash = tokenService.hashToken(token);
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new AppError('Invalid or expired password reset token', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  // Revoke all existing refresh tokens for security
  await RefreshToken.deleteMany({ user: user._id });
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const userObj = user.toObject();
  if (user.role === 'Resolver') {
    const profile = await ResolverProfile.findOne({ user: userId });
    userObj.resolverStatus = profile?.status || 'Pending';
    userObj.rejectionReason = profile?.rejectionReason || null;
  }
  return userObj;
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getMe,
};
