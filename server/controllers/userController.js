import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import taskModel from '../models/taskModel.js';
import groupModel from '../models/groupModel.js';


export const updateProfile = async (req, res) => {
  try {
    const { avatar, bio, interests } = req.body;
    const userId = req.user.id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        avatar,
        bio,
        interests,
      },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, taskStats, upcomingTasks, overdueTasks, recentActivity, completedTasksLast7Days] =
      await Promise.all([
        userModel.findById(userId)
          .populate("groups", "name description memberCount owner"),

        taskModel.aggregate([
          {
            $match: {
              $or: [
                { assignedTo: new mongoose.Types.ObjectId(userId) },
                { createdBy: new mongoose.Types.ObjectId(userId) }
              ]
            }
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ]),

        taskModel.find({
          assignedTo: userId,
          status: { $ne: "completed" },
          dueDate: {
            $gte: new Date(),
            $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        })
          .populate("group", "name")
          .sort({ dueDate: 1 })
          .limit(5),

        taskModel.find({
          assignedTo: userId,
          status: { $ne: "completed" },
          dueDate: { $lt: new Date() }
        })
          .populate("group", "name")
          .sort({ dueDate: 1 })
          .limit(5),

        taskModel.find({
          $and: [
            { $or: [{ createdBy: userId }, { assignedTo: userId }] },
            {
              $or: [
                { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
                {
                  completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                  status: "completed"
                }
              ]
            }
          ]
        })
          .populate("group", "name")
          .sort({ updatedAt: -1 })
          .limit(10),

        taskModel.countDocuments({
          assignedTo: userId,
          status: "completed",
          completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Format task statistics
    const formattedStats = {
      pending: 0,
      inProgress: 0,
      completed: 0
    };

    taskStats.forEach(stat => {
      if (stat._id === "pending") formattedStats.pending = stat.count;
      if (stat._id === "in-progress") formattedStats.inProgress = stat.count;
      if (stat._id === "completed") formattedStats.completed = stat.count;
    });

    res.json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          totalPoints: user.totalPoints ?? 0,
          currentStreak: user.currentStreak ?? 0,
          level: user.level ?? 1,
          avatar: user.avatar
        },
        groups: {
          memberOf: user.groups.map(group => ({
            id: group._id,
            name: group.name,
            description: group.description,
            memberCount: group.memberCount ?? 0,
            isOwner: group.owner?.toString() === userId
          })),

          summary: {
            totalGroups: user.groups.length + user.ownedGroups.length,
            ownedCount: user.ownedGroups.length,
            memberOfCount: user.groups.length 
          }
        },
        tasks: {
          statistics: {
            ...formattedStats,
            total:
              formattedStats.pending +
              formattedStats.inProgress +
              formattedStats.completed
          },
          upcoming: upcomingTasks.map(task => ({
            id: task._id,
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            subject: task.subject,
            group: task.group
              ? {
                id: task.group._id,
                name: task.group.name
              }
              : null,
            daysUntilDue: Math.ceil(
              (task.dueDate - new Date()) / (1000 * 60 * 60 * 24)
            )
          })),
          overdue: overdueTasks.map(task => ({
            id: task._id,
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            group: task.group
              ? {
                id: task.group._id,
                name: task.group.name
              }
              : null,
            daysOverdue: Math.ceil(
              (new Date() - task.dueDate) / (1000 * 60 * 60 * 24)
            )
          }))
        },
        activity: {
          recentTasks: recentActivity.map(task => ({
            id: task._id,
            title: task.title,
            status: task.status,
            group: task.group?.name ?? null,
            updatedAt: task.updatedAt,
            isCompleted: task.status === "completed",
            completedAt: task.completedAt
          })),
          weeklyProgress: {
            completedTasks: completedTasksLast7Days,
            studyStreak: Math.min(completedTasksLast7Days, 7) 
          }
        }
      }
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard"
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json({ success: false, message: "Search query required" });
    }

    const users = await userModel
      .find({
        name: { $regex: query, $options: 'i' }
      })
      .select('name email avatar')
      .limit(10);

    return res.json({
      success: true,
      users
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
