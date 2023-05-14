import express from "express";
import { authUser, restrictTo } from "../controllers/authControlles.js";
import {
  getAllUsers,
  userLogin,
  userSignup,
  updateUser,
  deleteUser,
  followUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);
router.route("/").get(authUser, restrictTo("User", "Admin"), getAllUsers);
router
  .route("/userId")
  .patch(authUser, restrictTo("User"), updateUser)
  .delete(authUser, restrictTo("User", "Admin"), deleteUser);

router.route("/addFriend/:userId").patch(authUser, restrictTo("User"), addUser);
router
  .route("/deleteFriend/:userId")
  .patch(authUser, restrictTo("User"), removeFriendUser);

export default router;
