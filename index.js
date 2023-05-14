import express from "express";
import mongoose, { mongo } from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import postRouter from "./routes/postRoute.js";
import commentRouter from "./routes/commentRoute.js";
import userRouter from "./routes/userRoute.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config({ path: "./config.env" });
const app = express();

app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("mongoose connected");
});

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/users", userRouter);
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 403));
});

app.use(globalErrorHandler);

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
