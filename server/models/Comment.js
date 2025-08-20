import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      required: true,
      enum: ["blog", "notice"],
    },

    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // original author (if logged-in)
    name: { type: String }, // guest name (if not logged-in)

    content: { type: String, required: true },

    lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // moderator/admin/user who last edited
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
