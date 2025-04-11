const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all rooms for a user
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      participants: req.user.username
    })
    .populate('participants', 'username name profilePicture status')
    .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

// Create a new room
router.post('/', auth, async (req, res) => {
  try {
    const { username } = req.body;

    // Check if user exists
    const otherUser = await User.findOne({ username });
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({
      participants: { $all: [req.user.username, username] }
    });

    if (existingRoom) {
      return res.json(existingRoom);
    }

    // Create new room
    const room = new Room({
      participants: [req.user.username, username],
      messageExpiryTime: 60 // Default 60 seconds
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
});

module.exports = router; 