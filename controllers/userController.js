import User from "../models/user.js";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  PasswordMismatchError,
} from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/tokenUtils.js";

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    logger.info("Fetched all users");
    res.json(users);
  } catch (err) {
    logger.error("Error fetching users", { stack: err.stack });
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId, "-password");
    if (!user) {
      logger.warn(`User not found: ${req.params.userId}`);
      throw new NotFoundError("User not found");
    }
    logger.info(`Fetched user with id ${req.params.userId}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user by id ${req.params.userId}`, {
      stack: err.stack,
    });
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId, "-password");
    if (!user) {
      logger.warn("User not found");
      throw new NotFoundError("User not found");
    }
    logger.info("Fetch Info User successfully");
    res.json({ message: "Fetch Info User Successfully", user });
  } catch (error) {
    logger.error("Eeror fetching information of user", { stack: error.stack });
    next(error);
  }
};

// Create a new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      logger.warn(
        "Username, email, and password are required for user creation"
      );
      throw new ValidationError(
        "Username, email, and password are required for user creation"
      );
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      logger.warn(`User already exists: ${username}, ${email}`);
      throw new ValidationError("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = generateToken({ userId: user._id, username: user.username });
    logger.info(`User created: ${user.username}`);
    res.status(201).json({
      message: "User registered",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    logger.error("Error registering user", { stack: err.stack });
    next(err);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn("Username and password are required for user login");
      throw new ValidationError("Username and password are required");
    }
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login failed for username: ${username}`);
      throw new UnauthorizedError("Invalid username or password");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed for username: ${username}`);
      throw new UnauthorizedError("Invalid username or password");
    }
    const token = generateToken({ userId: user._id, username: user.username });
    logger.info(`User logged in: ${user.username}`);
    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    logger.error("Error logging in user", { stack: error.stack });
    next(error);
  }
};

// Logout user (for JWT, client should just delete token)
export const logoutUser = async (req, res, next) => {
  try {
    // For stateless JWT, logout is handled on client by deleting token
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

// Update user password
export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      logger.warn(
        "Old password and new password is required for password change"
      );
      throw new ValidationError("Old password and new password is required");
    }

    const { userId, username } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      logger.warn("User not found", { userId });
      throw new NotFoundError("User not found");
    }
    const oldPasswordIsMatch = await comparePassword(
      oldPassword,
      user.password
    );
    if (!oldPasswordIsMatch) {
      logger.warn("Old password is mismatch");
      throw new PasswordMismatchError("Old password is mismatch");
    }
    user.password = await hashPassword(newPassword);
    await user.save();
    logger.info("Password updated", { userId, username });
    res.json({ message: "Password updated successfully", userId, username });
  } catch (err) {
    logger.error(`Error updating password`, { stack: err.stack });
    next(err);
  }
};

// Delete user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      logger.warn(`User not found for deletion: ${req.params.userId}`);
      throw new NotFoundError("User not found");
    }
    logger.info(`User deleted: ${req.params.userId}`);
    res.json({ message: `User with id ${req.params.userId} deleted` });
  } catch (err) {
    logger.error(`Error deleting user ${req.params.userId}`, {
      stack: err.stack,
    });
    next(err);
  }
};
