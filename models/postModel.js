import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: "Title is required",
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    comment: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
    activePost: { type: Boolean, default: true },
  },
  { timestamps: true }
);

postSchema.pre("/find/", function (next) {
  this.find({ activePost: { $ne: false } });
});

export default mongoose.model("Post", postSchema);
