import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export const createComment = async (req, res) => {
    try {
        const { targetId, targetType, parentComment, content, name } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, error: "Content is required" });
        }

        const comment = await Comment.create({
            targetId,
            targetType,
            parentComment: parentComment || null,
            createdBy: req.user ? req.user.id : null,
            name: req.user ? req.user.email : name,
            content,
        });

        res.status(201).json({ success: true, comment });
    } catch (err) {
        console.error("Create Comment Error:", err);
        res.status(500).json({ success: false, error: "Internal Server error" });
    }
};

export const getComments = async (req, res) => {
    try {
        const { targetId, targetType, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (targetId) filter.targetId = targetId;
        if (targetType) filter.targetType = targetType;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [comments, total] = await Promise.all([
            Comment.find(filter)
                .populate("createdBy", "username email role")
                .populate("lastEditedBy", "username email role")
                .lean()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),

            Comment.countDocuments(filter),
        ]);

        res.json({
            success: true,
            comments,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("Get Comments Error:", err);
        res.status(500).json({ success: false, error: "Internal Server error" });
    }
};

export const getCommentsForCreator = async (req, res) => {
    try {
        const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({ createdBy: userId }).select("_id");
        const blogIds = blogs.map(b => b._id);

        const total = await Comment.countDocuments({
            targetType: "blog",
            targetId: { $in: blogIds }
        });

        const comments = await Comment.find({
            targetType: "blog",
            targetId: { $in: blogIds }
        })
            .populate("createdBy", "username email role")
            .populate("lastEditedBy", "username email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            comments,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (err) {
        console.error("Get Creator Comments Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        if (
            req.user.role !== "admin" &&
            req.user.role !== "moderator" &&
            comment.createdBy?.toString() !== req.user.id.toString()
        ) {
            return res.status(403).json({ success: false, error: "Unauthorized to edit comment." });
        }

        if (content) {
            comment.content = content;
            comment.lastEditedBy = req.user.id;
        }

        await comment.save();

        res.json({ success: true, comment });
    } catch (err) {
        console.error("Update Comment Error:", err);
        res.status(500).json({ success: false, error: "Internal Server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        if (
            req.user.role !== "admin" &&
            req.user.role !== "moderator" &&
            comment.createdBy?.toString() !== req.user.id.toString()
        ) {
            return res.status(403).json({ success: false, error: "Unauthorized to delete comment." });
        }

        await Comment.deleteMany({
            $or: [{ _id: id }, { parentComment: id }],
        });

        res.json({ success: true, message: "Comment and replies deleted" });
    } catch (err) {
        console.error("Delete Comment Error:", err);
        res.status(500).json({ success: false, error: "Internal Server error" });
    }
};
