import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    // What the user typed
    content: {
        type: String,
        required: true,
        maxLength: 500,
        trim: true
    },

    // Who sent it
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // For group messages
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },


    // For private messages 
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // What type of message
    type: {
        type: String,
        enum: ['group', 'private', 'system'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }

}, {
    timestamps: true
});

const messageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default messageModel;
