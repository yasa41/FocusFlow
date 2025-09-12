import mongoose from "mongoose";
const groupSchema = new mongoose.Schema({
  // Basic group info
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },

    // Ownership & membership
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Invite code to join group
    inviteCode: {
        type: String,
        unique: true,
        required: true
    },

    // Group settings
    isPrivate: {
        type: Boolean,
        default: false
    },

    maxMembers: {
        type: Number,
        default: 50
    }

}, {
    timestamps: true 
});
const groupModel = mongoose.models.Group || mongoose.model("Group", groupSchema);
export default groupModel;
