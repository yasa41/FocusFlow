import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  // Basic task information
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    default: "", 
    trim: true,
    maxlength: 500 
  },

  // Relationships
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Group", 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  assignedTo: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],

  // Task properties
  dueDate: { 
    type: Date,
    required: false
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high','Low','Medium','High'], 
    default: 'medium' 
  },

  // Study-specific fields
  subject: { 
    type: String, 
    trim: true,
    maxlength: 50 
  },
  estimatedTime: { 
    type: Number, 
    min: 0,
    max: 1440 // 24 hours max
  },
  actualTimeSpent: { 
    type: Number, 
    default: 0 
  },

  // Progress tracking
  notes: { 
    type: String, 
    default: "",
    maxlength: 1000 
  },
  completedAt: { 
    type: Date 
  },
  
}, {
  timestamps: true 
});

const taskModel = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default taskModel;
