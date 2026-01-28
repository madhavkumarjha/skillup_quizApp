import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import { filterUserData } from '../utils/filteredUserData.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken.js';
import imagekit, { listProjectMediaGrouped } from '../utils/imageKit.js';
import path from 'path';
// import { log } from "console";

// register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      isAdmin: true,
      role: 'admin',
    });
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({ token: accessToken, refreshToken, newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    const safeUser = filterUserData(user);
    delete safeUser.password;
    res.status(200).json({ token: accessToken, refreshToken, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body; // or from cookie
  if (!refreshToken)
    return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const safeUser = filterUserData(user);
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: 'Server error' });
  }
};

// update user profile
export const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const user = await User.findOneAndUpdate({ _id: userId }, updates, {
      new: true,
    });
    console.log(updates);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    filterUserData(user);
    res
      .status(200)
      .json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// change user password
export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new filename
    const originalExt = path.extname(req.file.originalname);

    const newFileName = `profile_${userId}${originalExt}`;

    const oldFileId = user?.avatar?.fileId || null;

    // Upload to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: newFileName,
      folder: '/skillUp/profile',
    });

    // Save in DB
    user.avatar = {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
    };

    await user.save();

    // Delete old image from ImageKit
    if (oldFileId) {
      try {
        await imagekit.deleteFile(oldFileId);
      } catch (err) {
        console.log('⚠ Failed to delete old file:', err.message);
      }
    }

    const safeUser = filterUserData(user);

    res.status(200).json({
      success: true,
      user: safeUser,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.log(error); // <-- add this to see actual error
    res.status(500).json({ message: 'Server error' });
  }
};

// forget password (to be implemented)
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (for simplicity, using JWT here)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Save token hash + expiry in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Send reset link (frontend URL can vary)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `;
    await sendEmail(user.email, 'Password Reset Request', message);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// reset password (to be implemented)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//
export const getProjectMedia = async (req, res) => {
  try {
    const { folder } = req.params;
    const groupedMedia = await listProjectMediaGrouped();
    const folderMedia = groupedMedia.find((g) => g.folder === folder);

    if (!folderMedia) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json({ media: folderMedia.files });
  } catch (error) {
    console.error('Get project media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCourseMedia = async (req, res) => {
  try {
    const { courseName } = req.params;
    const grouped = await listCoursesMediaGrouped();
    const match = grouped.find((g) => g.course === courseName);

    if (!match) {
      return res.status(404).json({ message: 'Course folder not found' });
    }

    res.status(200).json({ media: match.files });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
