import User from '../models/User.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { defaultCategories } from '../utils/defaultCategories.js';

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, currency } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({ name, email, password, currency: currency || 'USD' });
  
  // Seed default categories for this user
  const categoriesToInsert = defaultCategories.map(cat => ({ ...cat, user: user._id }));
  await Category.insertMany(categoriesToInsert);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    data: { 
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency },
      accessToken 
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    data: { 
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency },
      accessToken 
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, 'Not authorized');

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'User not found');

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    setRefreshCookie(res, newRefreshToken);

    res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Incorrect current password');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, data: {} });
});
