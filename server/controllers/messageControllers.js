import messageModel from '../models/messageModel.js';
import groupModel from '../models/groupModel.js';
import mongoose from 'mongoose';

export const getMyConversations = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user.id);

    const partners = await messageModel.aggregate([
      {
        $match: {
          type: 'private',
          $or: [
            { sender: myId },
            { recipient: myId }
          ]
        }
      },
      {
        $project: {
          partner: {
            $cond: [{ $eq: ['$sender', myId] }, '$recipient', '$sender']
          }
        }
      },
      {
        $group: {
          _id: '$partner'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user._id': 1,
          'user.name': 1,
          'user.email': 1,
          'user.avatar': 1
        }
      }
    ]);

    res.json({ success: true, conversations: partners.map(p => p.user) });
  } catch (err) {
    console.error('Error in getMyConversations:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all groups user is member of
export const getMyGroups = async (req, res) => {
  try {
    const myId = req.user.id;
    const groups = await groupModel.find({ members: myId })
      .select('name description avatar');
    res.json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get private messages with a specific user
export const getPrivateMessages = async (req, res) => {
  try {
    const myId = req.user.id;
    const userId = req.params.userId;
    const messages = await messageModel.find({
      type: 'private',
      $or: [
        { sender: myId, recipient: userId },
        { sender: userId, recipient: myId }
      ]
    }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get group messages by group ID
export const getGroupMessages = async (req, res) => {
  try {
    const myId = req.user.id;
    const groupId = req.params.groupId;
    const group = await groupModel.findById(groupId);
    if (!group || !group.members.includes(myId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const messages = await messageModel.find({
      type: 'group',
      group: groupId
    }).sort({ createdAt: 1 })
    .populate('sender', '_id name email');
    
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
