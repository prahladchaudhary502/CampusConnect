import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js'
import User from "../models/User.js"; // adjust import path
import { isValidDomain } from "../configs/domain.js"; // your custom function

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validations
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!isValidDomain(email)) {
            return res.status(400).json({ success: false, message: "Invalid email domain" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Save user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Create JWT payload
        const payload = { id: newUser._id, email: newUser.email, role: newUser.role };

        // Sign JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Send JWT in HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true, // cannot be accessed by JS
            secure: process.env.NODE_ENV === "prod", // only HTTPS in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { username: newUser.username, email: newUser.email },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validations
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Find user
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create JWT payload
        const payload = { id: existingUser._id, email: existingUser.email, role: existingUser.role };

        // Sign JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Send JWT in HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod", // only HTTPS in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Success response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: { username: existingUser.username, email: existingUser.email },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const getUsers = async (req, res) => {
    try {
        const { email, role, page = 1, limit = 20 } = req.query;

        const query = {};
        if (email) query.email = email;
        if (role) query.role = role;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select("-password")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / parseInt(limit));

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalUsers,
                totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    const validRoles = ["default", "moderator", "admin"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, error: "Invalid role" });
    }

    try {
        // requester from auth middleware
        const requesterRole = req.user.role;

        // role hierarchy mapping
        const rank = { default: 1, moderator: 2, admin: 3 };

        // target user
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check: requester must be higher rank than target
        if (rank[requesterRole] <= rank[targetUser.role]) {
            return res.status(403).json({ success: false, message: "You cannot update a user of equal or higher rank" });
        }

        // Check: requester cannot assign role higher or equal to their own
        if (rank[role] > rank[requesterRole]) {
            return res.status(403).json({ success: false, message: "You cannot assign a role equal or higher than yours" });
        }

        targetUser.role = role;
        await targetUser.save();

        const updatedUser = await User.findById(id).select("-password");
        res.json({ success: true, user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};


export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 })
        res.json({ success: true, comments })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getDashboard = async (req, res) => {
    try {
        const filter = {};
        if (req.user.role === "default") {
            filter.createdBy = req.user.id;
        }

        const recentBlogs = await Blog.find({ ...filter })
            .sort({ createdAt: -1 })
            .limit(5);

        const blogs = await Blog.countDocuments({ ...filter });
        const comments = await Comment.countDocuments({ ...filter });
        const drafts = await Blog.countDocuments({ status: "draft", ...filter });

        const dashboardData = {
            blogs,
            comments,
            drafts,
            recentBlogs,
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Comment approved successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}