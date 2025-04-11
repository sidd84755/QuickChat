const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  participants: [{
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    profilePicture: String,
    status: String
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
roomSchema.index({ 'participants.username': 1 });
roomSchema.index({ updatedAt: -1 });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 