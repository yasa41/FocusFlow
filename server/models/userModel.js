import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  // New fields for StudySync profile and collaboration
  avatar: { type: String, default: "" },        // Avatar URL, emoji, or color code string
  bio: { type: String, maxlength: 200, default: "" },  // Short user bio
  interests: [{ type: String }],                 // Array of interest tags/keywords
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],  // IDs of groups user belongs to

  // Gamification fields
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
