import Comment from "../models/commentModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const createComment = catchAsync(async (req, res, next) => {
  const { comment } = req.body;
  const user = req.user._id;
  if (!comment) {
    return next(new AppError("Enter comment", 403));
  }

  const commentData = await Comment.create({
    comment,
    user,
  });

  res.status(201).json({
    status: "success",
    data: commentData,
  });
});

export const updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req.body;
  const user = req.user._id;
  const commentData = await Comment.findOneAndUpdate(
    { user },
    {
      comment,
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    commentData,
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const commentData = await Comment.findOneAndUpdate(
    { user },
    {
      commentActive: false,
    },
    { new: true }
  );
  if (!commentData) {
    return next(new AppError("comment not found with this comment Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

export const getAllComments = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) {
    return next(new AppError("Enter post Id", 403));
  }
  const commentData = await Comment.findOne({ post: postId });
  if (!commentData) {
    return next(new AppError("comment not found with this comment Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: commentData,
  });
});
