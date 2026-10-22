import authService from '../services/authService.js';
import { cookieOptions, clearAuthCookies } from '../config/cookies.js';
import { generateCsrfToken } from '../middleware/csrf.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  return sendSuccess(
    res,
    {
      userId: user._id,
      email: user.email,
    },
    'Verification email sent. Please check your inbox.',
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.loginUser(req.body);

  // Set tokens strictly in httpOnly cookies (never in response JSON)
  res.cookie('accessToken', tokens.accessToken, cookieOptions.accessToken);
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions.refreshToken);

  // Also issue an initial CSRF token cookie if not present
  const csrfToken = req.cookies?.['XSRF-TOKEN'] || generateCsrfToken();
  res.cookie('XSRF-TOKEN', csrfToken, cookieOptions.csrf);

  return sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        ...(user.resolverStatus ? { resolverStatus: user.resolverStatus } : {}),
        ...(user.rejectionReason !== undefined ? { rejectionReason: user.rejectionReason } : {}),
      },
    },
    'Login successful'
  );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logoutUser(refreshToken);

  clearAuthCookies(res);

  return sendSuccess(res, null, 'Logged out successfully');
});

export const refresh = asyncHandler(async (req, res) => {
  const currentRefreshToken = req.cookies?.refreshToken;
  const { user, tokens } = await authService.refreshSession(currentRefreshToken);

  res.cookie('accessToken', tokens.accessToken, cookieOptions.accessToken);
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions.refreshToken);

  return sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    'Session refreshed'
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  return sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        isEmailVerified: user.isEmailVerified,
        photo: user.photo,
        ...(user.resolverStatus ? { resolverStatus: user.resolverStatus } : {}),
        ...(user.rejectionReason !== undefined ? { rejectionReason: user.rejectionReason } : {}),
        createdAt: user.createdAt,
      },
    },
    'Current user profile'
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body.token);

  return sendSuccess(res, null, 'Email address verified successfully. You may now sign in.');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email);

  return sendSuccess(
    res,
    null,
    'If an account with that email address exists, a password reset link has been sent.'
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword({
    token: req.body.token,
    newPassword: req.body.newPassword,
  });

  clearAuthCookies(res);

  return sendSuccess(res, null, 'Password reset successfully. Please sign in with your new password.');
});

export const getCsrfToken = asyncHandler(async (req, res) => {
  const csrfToken = generateCsrfToken();
  res.cookie('XSRF-TOKEN', csrfToken, cookieOptions.csrf);

  return sendSuccess(res, { csrfToken }, 'CSRF token dispatched');
});

export default {
  register,
  login,
  logout,
  refresh,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCsrfToken,
};
