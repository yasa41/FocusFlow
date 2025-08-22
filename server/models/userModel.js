import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  //Authentication fields
  name: { type: String, required: true, trim: true },
  email: {
    type: String, required: true, unique: true, lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  //Profile fields
  avatar: { type: String, default: "" },
  bio: { type: String, maxlength: 200, default: "", trim: true },
  interests: [{
    type: String,
    trim: true,
    maxlength: 50
  }],

  // Group relationships
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  }],
  ownedGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  }],

  //Gamification fields
  totalPoints: { type: Number, default: 0, min: 0 },
  currentStreak: { type: Number, default: 0, min: 0 },
  longestStreak: { type: Number, default: 0, min: 0 },
  lastActivityDate: { type: Date },
  level: { type: Number, default: 1, min: 1 },

  // Streak tracking
  streakData: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 }
  },


},
  // Adds timestamps for created and updates
  {
    timestamps: true
  });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
