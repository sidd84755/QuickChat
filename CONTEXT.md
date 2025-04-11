# QuickChat App - Developer Guide

A secure, minimal, and privacy-focused chat application with disappearing messages.

## 🛠 Tech Stack

- **Frontend**: React Native using Expo
- **Backend**: Node.js
- **Database**: MongoDB (user and room metadata only)
- **Storage**: Messages saved in local storage only

## 🌐 Architecture Overview

```
Expo (React Native) — Frontend UI
   |
   |--- REST API (Node.js/Express)
   |        |
   |        |--- MongoDB (User & Room Data)
   |
   |--- Local Storage (AsyncStorage)
            |
            |--- Stores Messages for Each Room
```

## 🚀 Features & Implementation

### 1. 🔐 Authentication

#### Signup Flow
- Secure authentication using email/password with JWT
- Required user information:
  - Name
  - Email
  - Password
  - Unique username (for search & connections)

#### Login Flow
- Credential validation
- Fetch user's rooms and details
- JWT token generation

### 2. 🏠 Home Screen

#### Components
- **Search Bar**
  - Search chat rooms by username or room name
- **Room List**
  - Display connected rooms (from MongoDB)
  - Room information:
    - Other user's username
    - Last message snippet
    - Timestamp
- **Navigation**
  - Tap to enter chat room
  - Load messages from local storage
  - Set message expiry based on room settings

### 3. ➕ Add User Screen

#### Flow
1. User enters username
2. System checks MongoDB for match
3. If found:
   - Display user details
   - Show "Connect" button
4. On connect:
   - Create new room in MongoDB
   - Navigate to chat room

#### Room Schema
```json
{
  "user1": "username1",
  "user2": "username2",
  "messageExpiryTime": 60 // default in seconds
}
```

### 4. 📞 Contact/Support Page

#### Features
- Contact Information:
  - Email: support@quickchat.com
  - Phone: +123-456-789
- Support Form:
  - Name
  - Email
  - Subject
  - Message
- Integration with support tools (Formspree, Google Forms)

### 💬 Chat Room Features

#### Message Storage
- Local storage only (AsyncStorage)
- Timestamp tagging
- Configurable expiry time per room
- Default expiry: 60 seconds

#### Message Schema
```json
{
  "id": "msg_1",
  "text": "Hello!",
  "sender": "username1",
  "timestamp": 1678903240,
  "expiresIn": 60
}
```

#### Message Cleanup
```javascript
setTimeout(() => {
  deleteMessage(messageId);
}, message.expiresIn * 1000);
```

## 🧭 Navigation Structure

```
app/
│
├── app/index.tsx           -> Home Screen
├── app/add-user.tsx        -> Add User Screen
├── app/contact.tsx         -> Contact/Support Screen
├── app/chat/[roomId].tsx   -> Dynamic Chat Room
├── app/(auth)/login.tsx    -> Login
├── app/(auth)/signup.tsx   -> Signup
└── app/_layout.tsx         -> Bottom Tabs Navigation
```

### 🛠 Bottom Tab Navigation
- Home
- Add User
- Contact

## 🎨 UI/UX Guidelines

### Design System
- Dark/light mode support
- Rounded cards
- Smooth animations
- Modern components

### Key Libraries
- `react-native-paper` or `native-base` for components
- `react-native-async-storage` for local messages
- `axios` or `fetch` for API communication
- `react-native-reanimated` or `framer-motion` for animations

## 📦 Backend API Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `GET /users/search?username=...`
- `POST /rooms/connect`
- `GET /rooms/:userId`

## 🔐 Security & Privacy

### Data Storage
- MongoDB: User and room metadata only
- Local storage: Messages (never sent to backend)

### Security Measures
- JWT for session management
- Rate limiting
- Input validation
- Basic sanitization

## 📊 Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string", // unique
  "email": "string", // unique
  "password": "string", // hashed
  "name": "string",
  "createdAt": "Date",
  "lastActive": "Date",
  "profilePicture": "string", // URL or base64
  "status": "string" // online, offline, away
}
```

### Rooms Collection
```json
{
  "_id": "ObjectId",
  "participants": ["string"], // array of usernames
  "createdAt": "Date",
  "lastMessage": {
    "text": "string",
    "sender": "string",
    "timestamp": "Date"
  },
  "messageExpiryTime": "number", // in seconds
  "isActive": "boolean"
}
```

### Messages (Local Storage Schema)
```json
{
  "id": "string",
  "roomId": "string",
  "text": "string",
  "sender": "string",
  "timestamp": "number",
  "expiresIn": "number",
  "status": "string" // sent, delivered, read
}
```

## 📁 Project Structure

```
quickchat/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── chat/                # Chat related screens
│   │   └── [roomId].tsx
│   ├── components/          # Reusable components
│   │   ├── ChatBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── RoomCard.tsx
│   │   └── UserAvatar.tsx
│   ├── constants/           # App constants
│   │   ├── colors.ts
│   │   ├── theme.ts
│   │   └── config.ts
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   └── useStorage.ts
│   ├── services/           # API and storage services
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   ├── utils/             # Utility functions
│   │   ├── validation.ts
│   │   └── helpers.ts
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── add-user.tsx       # Add user screen
│   └── contact.tsx        # Contact screen
├── backend/               # Node.js backend
│   ├── config/           # Configuration files
│   │   ├── database.js
│   │   └── jwt.js
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   └── userController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/          # Database models
│   │   ├── User.js
│   │   └── Room.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   └── users.js
│   ├── utils/          # Utility functions
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── .env           # Environment variables
│   └── server.js      # Main server file
├── docs/              # Documentation
│   └── CONTEXT.md
├── .gitignore
├── app.json          # Expo config
├── package.json      # Frontend dependencies
├── package-lock.json
└── README.md
```

## 🚀 Step-by-Step Development Guide

### Phase 1: Project Setup and Authentication
1. **Initial Setup**
   - Create Expo project: `npx create-expo-app quickchat`
   - Install required dependencies:
     ```bash
     npm install @react-navigation/native @react-navigation/bottom-tabs
     npm install react-native-paper react-native-async-storage
     npm install axios @react-native-async-storage/async-storage
     ```
   - Set up Expo Router for navigation
   - Configure TypeScript and ESLint

2. **Backend Setup**
   - Initialize Node.js project in backend directory
   - Set up Express server with MongoDB connection
   - Create basic authentication routes
   - Implement JWT token generation and validation

3. **Authentication Screens**
   - Create login screen with email/password fields
   - Implement signup screen with all required fields
   - Add form validation and error handling
   - Connect to backend authentication endpoints
   - Set up secure token storage

### Phase 2: Core Chat Features
4. **Home Screen Development**
   - Implement room list component
   - Create search functionality
   - Add room card component with last message preview
   - Set up navigation to chat rooms

5. **Chat Room Implementation**
   - Create chat room screen layout
   - Implement message input component
   - Add message bubble component
   - Set up local storage for messages
   - Implement message expiry logic

6. **Add User Feature**
   - Create user search interface
   - Implement user profile preview
   - Add room creation functionality
   - Set up navigation to new chat rooms

### Phase 3: Message Management
7. **Local Storage Implementation**
   - Set up AsyncStorage for messages
   - Create message CRUD operations
   - Implement message expiry system
   - Add message status tracking

8. **Message Synchronization**
   - Implement message delivery status
   - Add read receipts functionality
   - Create message cleanup system
   - Handle offline message storage

### Phase 4: UI/UX Enhancement
9. **Theme Implementation**
   - Set up dark/light mode
   - Create custom theme with colors
   - Implement theme switching
   - Add theme persistence

10. **Animations and Transitions**
    - Add loading animations
    - Implement message transitions
    - Create smooth navigation transitions
    - Add gesture-based interactions

### Phase 5: Additional Features
11. **Contact/Support Page**
    - Create contact form
    - Implement form validation
    - Add support ticket submission
    - Set up email notifications

12. **User Profile**
    - Add profile editing functionality
    - Implement status updates
    - Create avatar upload feature
    - Add last seen functionality

### Phase 6: Testing and Optimization
13. **Testing**
    - Write unit tests for components
    - Add integration tests for API calls
    - Implement end-to-end testing
    - Test message expiry system

14. **Performance Optimization**
    - Optimize message loading
    - Implement pagination
    - Add message caching
    - Optimize image loading

### Phase 7: Deployment
15. **Backend Deployment**
    - Set up production environment
    - Configure MongoDB Atlas
    - Deploy Node.js server
    - Set up SSL certificates

16. **Frontend Deployment**
    - Build Expo app for production
    - Configure app signing
    - Submit to app stores
    - Set up CI/CD pipeline

### Development Checklist
- [ ] Project setup and configuration
- [ ] Authentication system
- [ ] Chat room functionality
- [ ] Message management
- [ ] UI/UX implementation
- [ ] Additional features
- [ ] Testing
- [ ] Optimization
- [ ] Deployment

### Best Practices
1. **Code Organization**
   - Follow the established folder structure
   - Use consistent naming conventions
   - Implement proper error handling
   - Add comprehensive comments

2. **Security**
   - Implement proper input validation
   - Use secure storage for sensitive data
   - Follow JWT best practices
   - Implement rate limiting

3. **Performance**
   - Optimize image loading
   - Implement proper caching
   - Use efficient data structures
   - Minimize re-renders

4. **Testing**
   - Write tests for all components
   - Test edge cases
   - Implement proper error handling
   - Use proper testing tools
