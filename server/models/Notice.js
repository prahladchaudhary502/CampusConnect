import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["general", "exam", "event", "holiday", "placement", "other"],
    default: "general"
  },
  audience: {
    type: [String],
    default: ["all"]
  },
  attachments: [
    {
      filename: String,
      url: String
    }
  ],
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft"
  },
  publishedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
