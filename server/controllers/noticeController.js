import Notice from "../models/Notice.js";

export const createNotice = async (req, res) => {
    try {

        const { title, content, category, audience, attachments, status, expiresAt } = JSON.parse(req.body.notice);
        const userId = req.user.id;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const notice = new Notice({
            title,
            content,
            category: category || "general",
            audience: audience?.length ? audience : ["all"],
            attachments: attachments || [],
            status: status || "draft",
            publishedAt: status === "published" ? new Date() : null,
            expiresAt: expiresAt || null,
            createdBy: userId,
        });

        await notice.save();

        res.status(201).json({ success: true, message: "Notice created successfully", notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllNotices = async (req, res) => {
    try {
        const { status, category, audience, page = 1, limit = 10 } = req.query;

        const filter = {
            $or: [
                { status: "published" },           
                { createdBy: req.user.id }               
            ]
        };

        // Apply optional filters inside the $and
        const andFilters = [];

        if (category) {
            andFilters.push({ category });
        }
        if (audience) {
            andFilters.push({ audience: { $in: [audience, "all"] } });
        }
        if (status) {
            andFilters.push({ status });
        }

        if (andFilters.length > 0) {
            filter.$and = andFilters;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Notice.countDocuments(filter);

        const notices = await Notice.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalNotices: total,
            notices
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await Notice.findById(id);

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({ success: true, notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const updateNoticeById = async (req, res) => {
    try {
        // if (req.user.role !== "admin") {
        //     return res.status(403).json({ success: false, message: "Only admin can update notices" });
        // }
        const { id } = req.params;
        const newNotice = JSON.parse(req.body.notice);

        const notice = await Notice.findByIdAndUpdate(id, newNotice, { new: true });

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({ success: true, message: "Notice updated successfully", notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const deleteNoticeById = async (req, res) => {
    try {
        // if (req.user.role !== "admin") {
        //   return res.status(403).json({ success: false, message: "Only admin can delete notices" });
        // }

        const { id } = req.params;
        const notice = await Notice.findByIdAndDelete(id);

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const publishNoticeById = async (req, res) => {
    try {
        // if (req.user.role !== "admin") {
        //     return res.status(403).json({ success: false, message: "Only admin can update notices" });
        // }
        const { id } = req.params;

        const notice = await Notice.findByIdAndUpdate(id, { status: "published" }, { new: true });

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({ success: true, message: "Notice updated successfully", notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}