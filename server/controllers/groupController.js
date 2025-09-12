import mongoose from "mongoose";
import groupModel from "../models/groupModel.js";
import userModel from "../models/userModel.js";
import { generateInviteCode } from "../utils/inviteCode.js";

//functions related to the owner of a group
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

    //update user model as well
    await userModel.findByIdAndUpdate(ownerId, {
      $addToSet: {
        groups: group._id,
        ownedGroups: group._id
      }
    });

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

    //Remove group from all members (including owner)
    await userModel.updateMany(
      { groups: groupId },           
      { $pull: { groups: groupId } } 
    );

    //Remove group from owner's ownedGroups 
    await userModel.findByIdAndUpdate(userId, {
      $pull: { ownedGroups: groupId }
    });

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

    //Remove group from target users groups array
    await userModel.findByIdAndUpdate(targetUserId, {
      $pull: { groups: groupId }
    });

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

    //update user model
    await userModel.findByIdAndUpdate(currentOwnerId, {
      $pull: { ownedGroups: groupId }
    });

    // Add group to new owner's ownedGroups array
    await userModel.findByIdAndUpdate(newOwnerId, {
      $addToSet: { ownedGroups: groupId }
    });

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

//Functions related to all members of a group 

export const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    // Find group by invite code
    const group = await groupModel.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code. Please check the code and try again.'
      });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Check if user is the owner (they're already a member)
    if (group.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You are the owner of this group'
      });
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Group is full. Cannot join at this time.'
      });
    }

    // Add user 
    group.members.push(userId);
    await group.save();

    //update user model 
    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { groups: group._id }
    });

    res.status(200).json({
      success: true,
      message: `Successfully joined "${group.name}"!`,
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
        maxMembers: group.maxMembers,
        joinedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining group'
    });
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // Populate members with desired fields (adjust as per your User schema)
    const group = await groupModel
      .findById(groupId)
      .populate({
        path: "members",
        select: "name avatar email", 
      })
      .exec();

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Check if user is a member or owner
    const isOwner = group.owner.toString() === userId;
    const isMember = group.members.some((m) =>
      typeof m === "object" ? m._id.toString() === userId : m.toString() === userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Format members as needed
    const formattedMembers = group.members.map((m) => ({
      userId: m._id,
      name: m.name,
      avatar: m.avatar,
      email: m.email,
      isOwner: group.owner.toString() === m._id.toString(),
    }));

    res.json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
        isOwner,
        inviteCode: isOwner ? group.inviteCode : undefined,
        createdAt: group.createdAt,
        members: formattedMembers,
        owner: group.owner, 
      },
    });
  } catch (error) {
    console.error("Error in getGroupDetails:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    const group = await groupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member
    if (!group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Owner cannot leave  
    if (group.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'As owner, you must transfer ownership before leaving the group'
      });
    }

    // Remove user 
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    //update user model
    await userModel.findByIdAndUpdate(userId, {
      $pull: { groups: groupId }
    });
    
    res.json({
      success: true,
      message: `You have successfully left "${group.name}"`,
      group: {
        id: group._id,
        name: group.name,
        memberCount: group.members.length
      }
    });

  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while leaving group'
    });
  }
};
