const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  participants: [{
    type: String,
    required: true
  }],
  lastMessage: {
    text: String,
    sender: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  messageExpiryTime: {
    type: Number,
    default: 60 // Default 60 seconds
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
roomSchema.index({ participants: 1 });
roomSchema.index({ updatedAt: -1 });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 