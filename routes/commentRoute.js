import express from "express";
import { authUser, restrictTo } from "../controllers/authControlles.js";
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllComments)
  .post(authUser, restrictTo("User"), createComment);
router
  .route("/:commentId")
  .patch(authUser, restrictTo("User"), updateComment)
  .delete(authUser, restrictTo("User"), deleteComment);

export default router;
