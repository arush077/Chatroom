# NoirChat

A premium dark-themed real-time chatroom built with React, Node.js, and Socket.IO.

![NoirChat](https://img.shields.io/badge/Made_with-React_&_Socket.IO-red)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Real-time Messaging** - Instant message delivery using WebSockets
- **Online Users** - See who's currently in the chatroom
- **Typing Indicators** - Know when someone is typing
- **Emoji Picker** - Express yourself with emojis
- **Sound Effects** - Toggle notification sounds
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful Animations** - Smooth transitions and micro-interactions
- **Cinematic Intro** - Netflix-inspired intro animation
- **Ambient Background** - Animated particles and glow effects
- **Live Presence** - Active/Idle/Offline user states
- **Message Reactions** - Add emoji reactions to messages
- **Reply to Messages** - Quote and reply to specific messages
- **Read Receipts** - Sent/Delivered/Seen status indicators
- **Dynamic Activity Glow** - UI reacts to live activity

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js + Express
- Socket.IO

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd chatroom
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Start the backend** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Backend runs on `http://localhost:3001`

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Project Structure

```
chatroom/
├── backend/
│   ├── index.js          # Express + Socket.IO server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JoinScreen.jsx        # Username entry
│   │   │   ├── ChatLayout.jsx        # Main layout
│   │   │   ├── ChatArea.jsx          # Messages area
│   │   │   ├── Sidebar.jsx           # Online users with presence
│   │   │   ├── Message.jsx           # Individual message with reactions
│   │   │   ├── MessageInput.jsx      # Text input with reply
│   │   │   ├── MessageReactions.jsx  # Reaction display
│   │   │   ├── EmojiPicker.jsx       # Emoji selector
│   │   │   ├── TypingIndicator.jsx   # Typing status
│   │   │   ├── CinematicIntro.jsx    # Intro animation
│   │   │   └── AmbientBackground.jsx # Animated particles
│   │   ├── utils/
│   │   │   └── formatTime.js         # Time formatting
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── README.md
└── SPEC.md
```

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | User joins with username |
| `joined` | Server → Client | Confirmation with user data |
| `message` | Both | Send/receive messages |
| `typing` | Client → Server | User is typing |
| `stopTyping` | Client → Server | User stopped typing |
| `userTyping` | Server → Client | Someone is typing |
| `userStoppedTyping` | Server → Client | Someone stopped typing |
| `userJoined` | Server → Client | New user notification |
| `userLeft` | Server → Client | User disconnect notification |
| `presenceUpdate` | Server → Client | User presence states (active/idle/offline) |
| `activity` | Client → Server | Keep presence active |
| `addReaction` | Client → Server | Add emoji reaction |
| `reactionUpdate` | Server → Client | Reaction changed |
| `markRead` | Client → Server | Mark message as read |
| `markAllRead` | Client → Server | Mark all messages as read |
| `messageStatus` | Server → Client | Message status update (sent/delivered/seen) |

## Design

- **Theme**: Dark cinematic Netflix-inspired
- **Colors**: Deep black (#0a0a0a) + Crimson red (#dc2626)
- **Typography**: Outfit (headings) + DM Sans (body)
- **Effects**: Glassmorphism, glow effects, smooth animations

## License

MIT License - feel free to use this project for learning or personal projects.