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
    const user = await User.findById(req.params.id, "-password");
    if (!user) {
      logger.warn(`User not found: ${req.params.id}`);
      throw new NotFoundError("User not found");
    }
    logger.info(`Fetched user with id ${req.params.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user by id ${req.params.id}`, {
      stack: err.stack,
    });
    next(err);
  }
};

// Create a new user
export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn("Username and password are required for user creation");
      throw new ValidationError("Username and password are required");
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.warn(`Username already exists: ${username}`);
      throw new ValidationError("Username already exists");
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    logger.info(`User created: ${user.username}`);
    res.status(201).json({
      message: "User registered",
      user: { _id: user._id, username: user.username },
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
      logger.warn("Username and password are required for user creation");
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
    const token = generateToken({ _id: user._id, username: user.username });
    logger.info(`User logged in: ${user.username}`);
    res.json({ message: "Login successful", token, userId: user._id });
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

    const { _id, username } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      logger.warn("User not found", _id);
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
    logger.info("Password updated", { _id, username });
    res.json({ message: "Password updated successfully", _id, username });
  } catch (err) {
    logger.error(`Error updating password`, { stack: err.stack });
    next(err);
  }
};

// Delete user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      logger.warn(`User not found for deletion: ${req.params.id}`);
      throw new NotFoundError("User not found");
    }
    logger.info(`User deleted: ${req.params.id}`);
    res.json({ message: `User with id ${req.params.id} deleted` });
  } catch (err) {
    logger.error(`Error deleting user ${req.params.id}`, { stack: err.stack });
    next(err);
  }
};
