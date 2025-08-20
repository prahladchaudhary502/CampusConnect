import fs from 'fs'
import imageKit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import imagekit from '../configs/imageKit.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

// TODO(): Add checkRole to ensure backend safety.

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, status } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        //check if all fields are present
        if (!title || !description || !category || !status) {
            return res.json({ success: false, message: "Missing required fields" })
        }

        let image = null;
        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path)

            // Upload Image to ImageKit
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: "/blogs"
            })

            //optimization through imagekit URL transformation
            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' }, // auto compression
                    { format: 'webp' }, // convert to modern format
                    { width: '1280' } //width resizing
                ]
            })
            image = optimizedImageUrl;
        }

        await Blog.create({ title, subTitle, description, category, image, status, createdBy: req.user.id })
        res.json({ success: true, message: "Blog added successfully" })

    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({status:"published"}).sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const { status, createdBy } = req.query;

    let filter = {};
    if (status) {
      // Convert comma-separated values into array
      const statuses = status.split(",");
      
      if (statuses.includes("draft")) {
        // Drafts → only user’s own
        filter.$or = [
          { status: { $in: statuses.filter(s => s !== "draft") } }, // public statuses
          { status: "draft", createdBy: req.user.id }               // drafts owned by user
        ];
      } else {
        filter.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
      }
    } else {
      // No status filter → general rule
      filter.$or = [
        { status: { $ne: "draft" } },                    // all non-drafts
        { status: "draft", createdBy: req.user.id }      // own drafts
      ];
    }
    
    if (createdBy) {
      filter.$and = [...(filter.$and || []), { createdBy }];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId)
      .populate("createdBy", "username email"); 

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const updateBlogById = async (req, res) => {
    try {
        const { blog,blogId } = JSON.parse(req.body.newBlogData);
        const imageFile = req.file;
        
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            blog,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            throw new Error('Blog not found');
        }

        res.json({ success: true, message: "Blog updated Scuccessfully" })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const updateBlogStatusById = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updated = await Blog.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) throw new Error("Blog not found");

    res.json({ success: true, blog: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        // Delete all comments associated with the blog
        await Comment.deleteMany({ blog: id });

        res.json({ success: true, message: 'Blog deleted successfully' })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: 'Blog status updated' })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: 'Comment added for review' })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort
            ({ createdAt: -1 });
        res.json({ success: true, comments })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
        res.json({ success: true, content });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

