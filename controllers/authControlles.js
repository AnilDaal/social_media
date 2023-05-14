import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const authUser = catchAsync(async function (req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return next(
      new AppError(
        "token not found or token not start with Bearer or token is null",
        401
      )
    );
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    let tokenData = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    console.log(tokenData);

    let freshData;
    if (tokenData.role === "admin") {
      freshData = await User.findById(tokenData.id);
      if (!freshData) {
        return next(
          new AppError(
            `The ${tokenData.role} belonging to this token does no longer exist`,
            401
          )
        );
      }
    } else if (tokenData.role === "user") {
      freshData = await User.findById(tokenData.id);
      if (!freshData) {
        return next(
          new AppError(
            `The ${tokenData.role} belonging to this token does no longer exist`,
            401
          )
        );
      }
    } else {
      return next(new AppError("user dont have any role", 401));
    }
    req.user = freshData;
  }
  next();
});

export const restrictTo = function (roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action ", 403)
      );
    }
    next();
  };
};
