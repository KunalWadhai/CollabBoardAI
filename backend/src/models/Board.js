import mongoose from 'mongoose';

const drawingActionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['draw', 'erase', 'shape', 'text', 'image'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 800
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    gridEnabled: {
      type: Boolean,
      default: false
    }
  },
  drawingHistory: [drawingActionSchema],
  thumbnail: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
boardSchema.index({ owner: 1 });
boardSchema.index({ collaborators: 1 });
boardSchema.index({ isPublic: 1 });
boardSchema.index({ tags: 1 });
boardSchema.index({ lastActivity: -1 });
boardSchema.index({ name: 'text', description: 'text' });

// Update last activity timestamp
boardSchema.methods.updateLastActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Add drawing action
boardSchema.methods.addDrawingAction = function(actionData) {
  const action = {
    ...actionData,
    timestamp: new Date()
  };
  
  this.drawingHistory.push(action);
  this.updateLastActivity();
  
  return this.save();
};

// Get recent drawing actions
boardSchema.methods.getRecentActions = function(limit = 50) {
  return this.drawingHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

// Check if user has access to board
boardSchema.methods.hasAccess = function(userId) {
  return this.owner.toString() === userId.toString() || 
         this.collaborators.some(id => id.toString() === userId.toString()) ||
         this.isPublic;
};

// Add collaborator
boardSchema.methods.addCollaborator = function(userId) {
  if (!this.collaborators.includes(userId)) {
    this.collaborators.push(userId);
    this.updateLastActivity();
    return this.save();
  }
  return Promise.resolve(this);
};

// Remove collaborator
boardSchema.methods.removeCollaborator = function(userId) {
  this.collaborators = this.collaborators.filter(id => id.toString() !== userId.toString());
  this.updateLastActivity();
  return this.save();
};

const Board = mongoose.model('Board', boardSchema);

export default Board;

