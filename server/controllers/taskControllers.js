import taskModel from "../models/taskModel.js";
import groupModel from "../models/groupModel.js";

export const createTask = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;
        const { title, description, dueDate, priority, assignedTo, subject, estimatedTime } = req.body;

        const group = await groupModel.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        const isMember = group.members.includes(userId) || group.owner.toString() === userId;

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'Only group members can create tasks'
            });
        }

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            });
        }
        // Filter to only include valid group members
        let validAssignees = [];
        if (assignedTo && assignedTo.length > 0) {

            validAssignees = assignedTo.filter(assigneeId =>
                group.members.includes(assigneeId) || group.owner.toString() === assigneeId
            );
        } else {

            validAssignees = [userId];// Default assign to creator
        }

        const task = new taskModel({
            title: title.trim(),
            description: description?.trim() || '',
            group: groupId,
            createdBy: userId,
            assignedTo: validAssignees,
            dueDate: dueDate || null,
            priority: priority || 'medium',
            subject: subject?.trim() || '',
            estimatedTime: estimatedTime || null
        });

        await task.save();

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                group: {
                    id: groupId,
                    name: group.name
                },
                status: task.status,
                priority: task.priority,
                subject: task.subject,
                estimatedTime: task.estimatedTime,
                createdBy: userId,
                assignedTo: validAssignees,
                dueDate: task.dueDate,
                createdAt: task.createdAt
            }
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Find the task with group info
    const task = await taskModel.findById(taskId).populate('group');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    //Task creator or group owner can delete
    const isCreator = task.createdBy.toString() === userId;
    const isGroupOwner = task.group.owner.toString() === userId;

    if (!isCreator && !isGroupOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only task creator or group owner can delete this task'
      });
    }

    // Delete the task
    await taskModel.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: 'Task deleted successfully',
      deletedTask: {
        id: task._id,
        title: task.title,
        group: {
          id: task.group._id,
          name: task.group.name
        }
      }
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, dueDate, priority, assignedTo, subject, estimatedTime } = req.body;

    const task = await taskModel.findById(taskId).populate('group');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    //Only creator or group owner can edit task details
    const isCreator = task.createdBy.toString() === userId;
    const isGroupOwner = task.group.owner.toString() === userId;

    if (!isCreator && !isGroupOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only task creator or group owner can edit task details'
      });
    }

    // Update task details
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (subject !== undefined) updateData.subject = subject.trim();
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime;

    const updatedTask = await taskModel.findByIdAndUpdate(taskId, updateData, { new: true });

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, in-progress, or completed'
      });
    }

    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    //Assigned users can update status
    const canUpdate = task.createdBy.toString() === userId || task.assignedTo.includes(userId);
    if (!canUpdate) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updateData = { status };
    
    //Calculate time spent in days
    if (status === 'completed' && task.status !== 'completed') {
      const completionDate = new Date();
      updateData.completedAt = completionDate;
      
      // Calculate days between creation and completion
      const createdDate = new Date(task.createdAt);
      const timeDifferenceMs = completionDate.getTime() - createdDate.getTime();
      const daysDifference = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
      
      
      updateData.actualTimeSpent = daysDifference;
    }
    
    // If changing from completed back to pending/in-progress, clear completion data
    if (status !== 'completed' && task.status === 'completed') {
      updateData.completedAt = null;
      updateData.actualTimeSpent = 0;
    }

    const updatedTask = await taskModel.findByIdAndUpdate(taskId, updateData, { new: true });

    res.json({
      success: true,
      message: `Task marked as ${status}`,
      task: { 
        id: updatedTask._id, 
        status: updatedTask.status, 
        completedAt: updatedTask.completedAt,
        actualTimeSpent: updatedTask.actualTimeSpent,
        timeUnit: 'days'
      }
    });

  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

export const getGroupTasks = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // Find the group to check permissions
    const group = await groupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    //User must be group member to view tasks
    const isMember = group.members.includes(userId) || group.owner.toString() === userId;

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only group members can view group tasks'
      });
    }

    // Get all tasks for this group
    const tasks = await taskModel.find({ group: groupId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 }); 

    // Organize tasks according to status
    const organizedTasks = {
      pending: tasks.filter(task => task.status === 'pending'),
      inProgress: tasks.filter(task => task.status === 'in-progress'),
      completed: tasks.filter(task => task.status === 'completed')
    };

    res.json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        description: group.description
      },
      tasks: {
        all: tasks,
        byStatus: organizedTasks,
        summary: {
          total: tasks.length,
          pending: organizedTasks.pending.length,
          inProgress: organizedTasks.inProgress.length,
          completed: organizedTasks.completed.length
        }
      }
    });

  } catch (error) {
    console.error('Get group tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group tasks'
    });
  }
}; 

// Add to your task controller

export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all tasks assigned to the user
    const assignedTasks = await taskModel.find({
      assignedTo: userId
    })
    .populate('group', 'name description')
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ dueDate: 1, createdAt: -1 });

    // Organize tasks by status
    const organizedTasks = {
      pending: assignedTasks.filter(task => task.status === 'pending'),
      inProgress: assignedTasks.filter(task => task.status === 'in-progress'),
      completed: assignedTasks.filter(task => task.status === 'completed')
    };

    // Get upcoming tasks (due within 7 days)
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingTasks = assignedTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= now && 
      new Date(task.dueDate) <= weekFromNow &&
      task.status !== 'completed'
    );

    // Get overdue tasks
    const overdueTasks = assignedTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now &&
      task.status !== 'completed'
    ).map(task => ({
      ...task.toObject(),
      daysOverdue: Math.ceil((now - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))
    }));

    res.json({
      success: true,
      tasks: {
        all: assignedTasks,
        byStatus: organizedTasks,
        upcoming: upcomingTasks,
        overdue: overdueTasks,
        summary: {
          total: assignedTasks.length,
          pending: organizedTasks.pending.length,
          inProgress: organizedTasks.inProgress.length,
          completed: organizedTasks.completed.length,
          upcoming: upcomingTasks.length,
          overdue: overdueTasks.length
        }
      }
    });

  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

export const getCreatedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const createdTasks = await taskModel.find({
      createdBy: userId
    })
    .populate('group', 'name description')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

    const organizedTasks = {
      pending: createdTasks.filter(task => task.status === 'pending'),
      inProgress: createdTasks.filter(task => task.status === 'in-progress'),
      completed: createdTasks.filter(task => task.status === 'completed')
    };

    res.json({
      success: true,
      tasks: {
        all: createdTasks,
        byStatus: organizedTasks,
        summary: {
          total: createdTasks.length,
          pending: organizedTasks.pending.length,
          inProgress: organizedTasks.inProgress.length,
          completed: organizedTasks.completed.length
        }
      }
    });

  } catch (error) {
    console.error('Get created tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch created tasks'
    });
  }
};
