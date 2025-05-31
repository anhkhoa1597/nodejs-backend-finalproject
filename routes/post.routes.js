import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// GET /posts - Get all posts
router.get("/", authenticateToken, getAllPosts);

// GET /posts/:postId - Update post by ID
router.put("/:postId", authenticateToken, updatePost);

// POST /posts/post - create a new post
router.post("/post", authenticateToken, createPost);

// DELETE /posts/:postId - Delete post by id
router.delete("/:postId", authenticateToken, deletePost);

export default router;
