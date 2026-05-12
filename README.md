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
│   │   │   ├── JoinScreen.jsx      # Username entry
│   │   │   ├── ChatLayout.jsx      # Main layout
│   │   │   ├── Sidebar.jsx         # Online users
│   │   │   ├── ChatArea.jsx        # Messages area
│   │   │   ├── Message.jsx         # Individual message
│   │   │   ├── MessageInput.jsx    # Text input
│   │   │   ├── EmojiPicker.jsx     # Emoji selector
│   │   │   └── TypingIndicator.jsx # Typing status
│   │   ├── utils/
│   │   │   └── formatTime.js       # Time formatting
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
| `userTyping` | Server → Client | Someone is typing |
| `userJoined` | Server → Client | New user notification |
| `userLeft` | Server → Client | User disconnect notification |

## Design

- **Theme**: Dark cinematic Netflix-inspired
- **Colors**: Deep black (#0a0a0a) + Crimson red (#dc2626)
- **Typography**: Outfit (headings) + DM Sans (body)
- **Effects**: Glassmorphism, glow effects, smooth animations

## License

MIT License - feel free to use this project for learning or personal projects.