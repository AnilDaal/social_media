import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
