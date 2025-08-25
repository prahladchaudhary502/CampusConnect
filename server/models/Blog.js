import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  status: {
    type: String,
    enum: ["draft", "in-review", "published", "rejected"],
    default: "draft"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // assuming your user model is named 'User'
    required: true
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
