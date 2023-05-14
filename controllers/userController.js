import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

export const userSignup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    next(new AppError("Please Enter all field ", 403));
  }
  const userData = await User({
    name,
    email,
    password,
  });
  if (!userData) {
    return new AppError(`No User found with this Id`, 401);
  }
  const token = await jwt.sign(
    { id: userData._id, role: userData.role },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );

  res.status(201).json({
    status: "success",
    token,
  });
});

export const userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter Password or Email", 401));
  }
  const userData = await User.findOne({ email }).select("password");
  if (!userData.correctPassword(password, userData.password)) {
    return next(new AppError("Email or Password not match", 401));
  }
  if (!userData) {
    return new AppError(`No User found with this Id`, 401);
  }
  const token = jwt.sign(
    { id: userData._id, role: userData.role },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );

  res.status(201).json({
    status: "success",
    token,
  });
});

export const getSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const UserData = await User.findById(userId);
  if (!UserData) {
    return new AppError(`No User found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: UserData,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const UserId = req.params.UserId;
  const UserData = await User.findByIdAndUpdate(
    UserId,
    {
      $set: {
        accountActive: false,
      },
    },
    { new: true }
  );
  if (!UserData) {
    return new AppError(`No User found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { name, address, password } = req.body;
  if (password) {
    return next(new AppError("this route not for password update", 401));
  }
  const UserId = req.user._id;
  // use email for verification
  const UserData = await User.findByIdAndUpdate(
    UserId,
    {
      $set: {
        name,
        address,
      },
    },
    { new: true }
  );
  if (!UserData) {
    return new AppError(`No User found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    data: UserData,
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const UserData = await User.find();
  if (!UserData) {
    return new AppError(`No User found with this Id`, 401);
  }
  res.status(201).json({
    status: "success",
    results: UserData.length,
    data: UserData,
  });
});
