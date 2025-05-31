import { NotFoundError, ValidationError } from "../middlewares/errorHandler.js";
import Post from "../models/post.js";
import logger from "../utils/logger.js";

export const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      logger.warn("Post text is required");
      throw new ValidationError("Post text is required");
    }
    const post = new Post({ userId: req.user.userId, text });
    await post.save();
    logger.info("Post created successfully", { postId: post._id });
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    logger.error("Error creating post", { stack: error.stack });
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user.userId }).populate(
      "userId",
      "username email"
    );
    logger.info("Fetched all posts successfully", { count: posts.length });
    res.status(200).json({ posts });
  } catch (error) {
    logger.error("Error fetching posts", { stack: error.stack });
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId, userId: req.user.userId },
      { text },
      { new: true }
    );
    if (!post) {
      logger.warn(`Post not found ${req.params.postId}`);
      throw new NotFoundError("Post not found");
    }
    res.json({ message: "Post updated successfully", updatedPost: post });
  } catch (error) {
    logger.error("Error updating post", { stack: error.stack });
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
      userId: req.user.userId,
    });
    if (!post) {
      logger.warn(`Post not found for deletion ${req.params.postId}`);
      throw new NotFoundError("Post not found");
    }
    logger.info(`Post deleted: ${req.params.postId}`);
    res.json({ message: "Post deleted", postId: req.params.postId });
  } catch (error) {
    logger.error(`Error deleting Post ${req.params.postId}`, {
      stack: error.stack,
    });
  }
};
