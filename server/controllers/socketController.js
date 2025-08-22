import messageModel from '../models/messageModel.js';
import groupModel from '../models/groupModel.js';
import userModel from '../models/userModel.js';
import { validatePrivateMessage, validateGroupMessage } from '../middleware/socketValidation.js';

class SocketController {
  // Main connection handler
  handleConnection(socket, io) {
    console.log(`${socket.userName} connected`);
    
    // Handle request for unread messages (when user comes back online)
    socket.on('get_unread_messages', async () => {
      await this.sendUnreadMessages(socket);
    });
    
    // User joins their groups
    socket.on('join_groups', async (groupIds) => {
      await this.handleJoinGroups(socket, groupIds);
    });
    
    // Private message 
    socket.on('private_message', async (data) => {
      await this.handlePrivateMessage(socket, io, data);
    });
    
    // Group message 
    socket.on('group_message', async (data) => {
      await this.handleGroupMessage(socket, io, data);
    });
    
    // Mark messages as read
    socket.on('mark_messages_read', async (data) => {
      await this.markMessagesAsRead(socket, data);
    });
    
    // User disconnects
    socket.on('disconnect', () => {
      console.log(`${socket.userName} disconnected`);
    });
  }
  
  // NEW: Send unread messages when user comes online
  async sendUnreadMessages(socket) {
    try {
      // Find all unread private messages for this user
      const unreadMessages = await messageModel
        .find({
          recipient: socket.userId,
          read: false
        })
        .populate('sender', 'name email')
        .sort({ createdAt: 1 }); // Oldest first
      
      if (unreadMessages.length > 0) {
        // Send them all at once
        socket.emit('unread_messages', unreadMessages);
        console.log(`📬 Sent ${unreadMessages.length} unread messages to ${socket.userName}`);
      }
      
    } catch (error) {
      console.error('Send unread messages error:', error);
      socket.emit('error', { message: 'Failed to load unread messages' });
    }
  }
  
  //  Mark messages as read
  async markMessagesAsRead(socket, data) {
    try {
      const { fromUserId } = data;
      
      // Mark all messages from specific user as read
      await messageModel.updateMany(
        { 
          recipient: socket.userId,
          sender: fromUserId,
          read: false 
        },
        { read: true }
      );
      
      console.log(`${socket.userName} marked messages from ${fromUserId} as read`);
      
    } catch (error) {
      console.error('Mark messages read error:', error);
    }
  }
  
  // Handle joining groups
  async handleJoinGroups(socket, groupIds) {
    try {
      if (!Array.isArray(groupIds)) {
        return socket.emit('error', { message: 'Invalid group list' });
      }
      
      // Find groups where user is a member
      const userGroups = await groupModel.find({
        _id: { $in: groupIds },
        members: socket.userId
      });
      
      // Join socket rooms for each group
      userGroups.forEach(group => {
        socket.join(`group_${group._id}`);
        console.log(`${socket.userName} joined ${group.name}`);
      });
      
      socket.emit('groups_joined', { 
        count: userGroups.length,
        groups: userGroups.map(g => ({ id: g._id, name: g.name }))
      });
      
    } catch (error) {
      console.error('Join groups error:', error);
      socket.emit('error', { message: 'Failed to join groups' });
    }
  }
  
  // Handle private messages 
  async handlePrivateMessage(socket, io, data) {
    try {
      // Validate the message
      const validationError = validatePrivateMessage(data);
      if (validationError) {
        return socket.emit('error', { message: validationError });
      }
      
      // Check if recipient exists
      const recipient = await userModel.findById(data.toUserId);
      if (!recipient) {
        return socket.emit('error', { message: 'User not found' });
      }
      
      // Save message to database (read: false by default)
      const message = new messageModel({
        content: data.content,
        sender: socket.userId,
        recipient: data.toUserId,
        type: 'private',
        read: false,  // 🔥 Important: Mark as unread
        replyTo: data.replyTo || null
      });
      
      await message.save();
      
      // Get sender info for the response
      await message.populate('sender', 'name email');
      
      // Prepare message data
      const messageData = {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        recipient: data.toUserId,
        type: 'private',
        read: false,
        replyTo: message.replyTo,
        createdAt: message.createdAt
      };
      
      // Send to recipient (if online)
      io.to(data.toUserId).emit('private_message_received', messageData);
      
      // Confirm to sender 
      socket.emit('private_message_sent', messageData);
      
      console.log(`Private: ${socket.userName} → ${recipient.name}`);
      
    } catch (error) {
      console.error('Private message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }
  
  // Handle group messages 
  async handleGroupMessage(socket, io, data) {
    try {
      // Validate the message
      const validationError = validateGroupMessage(data);
      if (validationError) {
        return socket.emit('error', { message: validationError });
      }
      
      // Check if user is in the group
      const group = await groupModel.findOne({
        _id: data.groupId,
        members: socket.userId
      });
      
      if (!group) {
        return socket.emit('error', { message: 'You are not in this group' });
      }
      
      // Save message to database
      const message = new messageModel({
        content: data.content,
        sender: socket.userId,
        group: data.groupId,
        type: 'group',
        replyTo: data.replyTo || null
      });
      
      await message.save();
      
      // Get sender info
      await message.populate('sender', 'name email');
      
      // Prepare message data
      const messageData = {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        group: data.groupId,
        type: 'group',
        replyTo: message.replyTo,
        createdAt: message.createdAt
      };
      
      // Send to all group members (including sender)
      io.to(`group_${data.groupId}`).emit('group_message_received', messageData);
      
      console.log(` Group: ${socket.userName} → ${group.name}`);
      
    } catch (error) {
      console.error('Group message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }
}

export default new SocketController();
