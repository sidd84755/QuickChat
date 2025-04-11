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
      'participants.username': { $all: [req.user.username, username] }
    });

    if (existingRoom) {
      return res.json(existingRoom);
    }

    // Create new room with full user data
    const room = new Room({
      participants: [
        {
          username: req.user.username,
          name: req.user.name,
          profilePicture: req.user.profilePicture,
          status: req.user.status
        },
        {
          username: otherUser.username,
          name: otherUser.name,
          profilePicture: otherUser.profilePicture,
          status: otherUser.status
        }
      ],
      messageExpiryTime: 60 // Default 60 seconds
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
});

// Get a single room by ID
router.get('/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('participants', 'username name profilePicture status');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is a participant
    if (!room.participants.includes(req.user.username)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
});

// Update last message in a room
router.put('/:roomId/last-message', auth, async (req, res) => {
  try {
    const { lastMessage } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is a participant
    if (!room.participants.includes(req.user.username)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    room.lastMessage = lastMessage;
    await room.save();

    res.json(room);
  } catch (error) {
    console.error('Error updating last message:', error);
    res.status(500).json({ message: 'Error updating last message', error: error.message });
  }
});

module.exports = router; 