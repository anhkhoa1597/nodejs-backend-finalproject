import express from "express";
import {
  getAllUsers,
  getUserById,
  register,
  deleteUser,
  updatePassword,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/userController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /users - Get all users
router.get("/", getAllUsers);

// Get /users/me - Get information of user
router.get("/me", authenticateToken, getMe);

// GET /users/:id - Get user by ID
router.get("/:userId", getUserById);

// POST /users/register - Create a new user
router.post("/register", register);

// POST /users/login - Logging in user
router.post("/login", loginUser);

// POST /users/logout - Logging out user
router.post("/logout", logoutUser);

// PUT /users/update-password - Update user password
router.put("/update-password", authenticateToken, updatePassword);

// DELETE /users/:id - Delete user by ID
router.delete("/:userId", deleteUser);

export default router;
