import Post from "../models/postModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const createPost = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const user = req.user._id;
  if (!title) {
    return next(new AppError("Enter title of Post", 403));
  }

  const postData = await Post.creat({
    title,
    user,
  });

  res.status(201).json({
    status: "success",
    data: postData,
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const user = req.user._id;
  const postData = await Post.findOneAndUpdate(
    { user },
    {
      title,
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    postData,
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const postData = await Post.findOneAndUpdate(
    { user },
    {
      postActive: false,
    },
    { new: true }
  );
  if (!postData) {
    return next(new AppError("post not found with this post Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

export const getPost = catchAsync(async (req, res, next) => {
  const postData = await Post.findById(req.params.id);
  if (!postData) {
    return next(new AppError("post not found with this post Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: postData,
  });
});

export const getAllPosts = catchAsync(async (req, res, next) => {
  const postData = await Post.find();
  if (!postData) {
    return next(new AppError("No post have created yet!", 401));
  }
  res.status(201).json({
    status: "success",
    results: postData.length,
    data: postData,
  });
});
