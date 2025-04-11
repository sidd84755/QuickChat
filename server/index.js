const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:19006',
    'exp://192.168.1.100:19000',
    'exp://192.168.1.100:19000',
    'exp://localhost:19000',
    'exp://localhost:19000',
    'https://quickchat-38n9.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickchat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join room when user connects
  socket.on('join-room', async (roomId, token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      
      if (user) {
        socket.join(roomId);
        console.log(`User ${user.username} joined room ${roomId}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  // Handle new messages
  socket.on('new-message', (roomId, message) => {
    io.to(roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rooms', require('./routes/rooms'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 