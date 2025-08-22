
import userModel from '../models/userModel.js';
import taskModel from '../models/taskModel.js';


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

//Dashboard controller to get groups and tasks specific to the user

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get group information
    const user = await userModel.findById(userId)
      .populate('groups', 'name description memberCount owner')
      .populate('ownedGroups', 'name description memberCount');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get task statistics using aggregation
    const taskStats = await taskModel.aggregate([
      {
        $match: {
          $or: [
            { assignedTo: mongoose.Types.ObjectId(userId) },
            { createdBy: mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get upcoming tasks (next 7 days)
    const upcomingTasks = await taskModel.find({
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    .populate('group', 'name')
    .sort({ dueDate: 1 })
    .limit(5);

    // Get overdue tasks
    const overdueTasks = await taskModel.find({
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    })
    .populate('group', 'name')
    .sort({ dueDate: 1 })
    .limit(5);

    // Get recent activity (tasks created/completed in last 7 days)
    const recentActivity = await taskModel.find({
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ],
      $or: [
        { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        { 
          completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: 'completed'
        }
      ]
    })
    .populate('group', 'name')
    .sort({ updatedAt: -1 })
    .limit(10);

    // Calculate study streak (simplified - days with completed tasks)
    const completedTasksLast7Days = await taskModel.countDocuments({
      assignedTo: userId,
      status: 'completed',
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Format task statistics
    const formattedStats = {
      pending: 0,
      inProgress: 0,
      completed: 0
    };

    taskStats.forEach(stat => {
      if (stat._id === 'pending') formattedStats.pending = stat.count;
      if (stat._id === 'in-progress') formattedStats.inProgress = stat.count;
      if (stat._id === 'completed') formattedStats.completed = stat.count;
    });

    res.json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          totalPoints: user.totalPoints || 0,
          currentStreak: user.currentStreak || 0,
          level: user.level || 1
        },
        groups: {
          memberOf: user.groups.map(group => ({
            id: group._id,
            name: group.name,
            description: group.description,
            memberCount: group.memberCount || 0,
            isOwner: group.owner?.toString() === userId
          })),
          owned: user.ownedGroups.map(group => ({
            id: group._id,
            name: group.name,
            description: group.description,
            memberCount: group.memberCount || 0
          })),
          summary: {
            totalGroups: user.groups.length + user.ownedGroups.length,
            ownedCount: user.ownedGroups.length,
            memberCount: user.groups.length
          }
        },
        tasks: {
          statistics: {
            ...formattedStats,
            total: formattedStats.pending + formattedStats.inProgress + formattedStats.completed
          },
          upcoming: upcomingTasks.map(task => ({
            id: task._id,
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            subject: task.subject,
            group: {
              id: task.group._id,
              name: task.group.name
            },
            daysUntilDue: Math.ceil((task.dueDate - new Date()) / (1000 * 60 * 60 * 24))
          })),
          overdue: overdueTasks.map(task => ({
            id: task._id,
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            group: {
              id: task.group._id,
              name: task.group.name
            },
            daysOverdue: Math.ceil((new Date() - task.dueDate) / (1000 * 60 * 60 * 24))
          }))
        },
        activity: {
          recentTasks: recentActivity.map(task => ({
            id: task._id,
            title: task.title,
            status: task.status,
            group: task.group.name,
            updatedAt: task.updatedAt,
            isCompleted: task.status === 'completed',
            completedAt: task.completedAt
          })),
          weeklyProgress: {
            completedTasks: completedTasksLast7Days,
            studyStreak: Math.min(completedTasksLast7Days, 7) // Simple streak calculation
          }
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard'
    });
  }
};
