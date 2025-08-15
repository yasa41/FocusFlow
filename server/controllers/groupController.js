import mongoose from "mongoose";
import groupModel from "../models/groupModel.js";
import { generateInviteCode } from "../utils/inviteCode.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user.id;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    // Generate unique invite code
    const inviteCode = generateInviteCode();

    // Create group
    const group = new groupModel({
      name: name.trim(),
      description: description?.trim() || '',
      owner: ownerId,
      members: [ownerId],
      inviteCode
    });

    await group.save();

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        memberCount: group.members.length,
        createdAt: group.createdAt
      }
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group'
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      })
    }

    if (group.owner.toString() != userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.Only the group owner can delete the group'
      })
    }
    await groupModel.findByIdAndDelete(groupId);
    return res.json({
      success: true,
      message: 'Group successfuly deleted'
    })
  } catch (error) {
    console.log('Delete group error:', error);
    res.json({
      success: false,
      message: 'Deletion failed server error occured'
    })
  }
};

