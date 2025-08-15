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

export const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    const { name, description, isPrivate } = req.body;
    //find group
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    if (group.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group owner can update group settings'
      });
    }
    // Update group
    const updatedGroup = await groupModel.findByIdAndUpdate(
      groupId,
      { name, description, isPrivate },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Group updated successfully',
      group: {
        id: updatedGroup._id,
        name: updatedGroup.name,
        description: updatedGroup.description,
        isPrivate: updatedGroup.isPrivate
      }
    });
  } catch (error) {
    console.log('error:', error);
    res.json({
      success: false,
      message: 'Failed to update details'
    })
  }
};


export const removeMember = async (req, res) => {
  try {
    const groupId = req.params.id;
    const targetUserId = req.params.userId;  
    const ownerId = req.user.id;            
    
    // Find the group
    const group = await groupModel.findById(groupId);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Only owner can remove members
    if (group.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'Only group owner can remove members'
      });
    }
    
    // Can't remove yourself as owner 
    if (targetUserId === ownerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove yourself as owner. Transfer ownership first.'
      });
    }
    
    // Check if user is actually a member
    if (!group.members.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this group'
      });
    }
    
    // Remove user 
    group.members = group.members.filter(memberId => memberId.toString() !== targetUserId);
    
    await group.save();
    
    res.json({
      success: true,
      message: 'Member removed successfully',
      group: {
        id: group._id,
        name: group.name,
        memberCount: group.members.length,
        removedUserId: targetUserId
      }
    });
    
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing member'
    });
  }
};


export const transferOwnership = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { newOwnerId } = req.body;
    const currentOwnerId = req.user.id;
    
    // Find the group
    const group = await groupModel.findById(groupId);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Only current owner can transfer ownership
    if (group.owner.toString() !== currentOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'Only the current group owner can transfer ownership'
      });
    }
    
    // Validate new owner ID 
    if (!newOwnerId) {
      return res.status(400).json({
        success: false,
        message: 'New owner ID is required'
      });
    }
    
    // Can't transfer to yourself
    if (newOwnerId === currentOwnerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer ownership to yourself'
      });
    }
    
    // New owner must be a member of the group
    if (!group.members.includes(newOwnerId)) {
      return res.status(400).json({
        success: false,
        message: 'New owner must be a member of the group'
      });
    }
    
    // Transfer ownership
    group.owner = newOwnerId;
    await group.save();
    
    res.json({
      success: true,
      message: 'Ownership transferred successfully',
      group: {
        id: group._id,
        name: group.name,
        previousOwner: currentOwnerId,
        newOwner: newOwnerId,
        memberCount: group.members.length
      }
    });
    
  } catch (error) {
    console.error('Transfer ownership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while transferring ownership'
    });
  }
};
