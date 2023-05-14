import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const adminSignup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return next(new AppError("Enter all fields", 403));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );

  res.status(201).json({
    status: "success",
    data: user,
  });
});

export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Enter all fields", 403));
  }

  const adminData = await User.findOne({ email }).select("password");
  if (!adminData || !adminData.correctPassword(password, adminData.password)) {
    return next(new AppError("Email or Password not match", 401));
  }
  const token = jwt.sign(
    { id: adminData._id, role: adminData.role },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );

  res.status(201).json({
    status: "success",
    token,
  });
});
