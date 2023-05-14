import express from "express";
import { authUser, restrictTo } from "../controllers/authControlles.js";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllPosts)
  .post(authUser, restrictTo("User"), createPost);
router
  .route("/:postId")
  .get(getPost)
  .patch(authUser, restrictTo("User"), updatePost)
  .delete(authUser, restrictTo("User"), deletePost);

export default router;
