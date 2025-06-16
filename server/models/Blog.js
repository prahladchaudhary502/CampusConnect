import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {type: String, requied: true},
    subTitle: {type: String},
    description: {type: String, requied: true},
    category: {type: String, requied: true},
    image: {type: String, requied: true},
    isPublished: {type: Boolean, requied: true},
}, {timestamps: true});

const Blog = mongoose.model('blog', blogSchema);

export default Blog;