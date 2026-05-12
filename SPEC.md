# Chatroom - Real-Time Messaging App Specification

## 1. Project Overview

**Project Name:** NoirChat
**Type:** Real-time WebSocket Chat Application
**Core Functionality:** A premium dark-themed chatroom where users can join with a username, see online users, send messages in real-time, and enjoy a cinematic experience.
**Target Users:** Anyone looking for a sleek, modern chat experience

---

## 2. Technical Architecture

### Backend (backend/)
- **Framework:** Node.js + Express
- **Real-time:** Socket.IO
- **Port:** 3001

### Frontend (frontend/)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State Management:** React hooks
- **Port:** 5173 (dev)

---

## 3. UI/UX Specification

### Color Palette
- **Background Primary:** #0a0a0a (near black)
- **Background Secondary:** #141414 (dark charcoal)
- **Background Tertiary:** #1a1a1a (card backgrounds)
- **Accent Primary:** #dc2626 (deep red)
- **Accent Secondary:** #991b1b (darker red)
- **Accent Glow:** rgba(220, 38, 38, 0.4) (red glow)
- **Text Primary:** #f5f5f5 (off-white)
- **Text Secondary:** #a3a3a3 (muted gray)
- **Text Muted:** #525252 (dark gray)
- **Success:** #22c55e (green for online)
- **Glass Background:** rgba(26, 26, 26, 0.7)
- **Glass Border:** rgba(255, 255, 255, 0.08)

### Typography
- **Font Family:** 'Outfit' (headings), 'DM Sans' (body)
- **Heading Large:** 28px, weight 600
- **Heading Medium:** 20px, weight 500
- **Body:** 14px, weight 400
- **Small:** 12px, weight 400

### Spacing System
- **Base unit:** 4px
- **Padding small:** 8px
- **Padding medium:** 16px
- **Padding large:** 24px
- **Border radius small:** 8px
- **Border radius medium:** 12px
- **Border radius large:** 16px
- **Border radius full:** 9999px

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

---

## 4. Component Specifications

### 4.1 Join Screen
- Centered glassmorphism card
- Username input field with red focus glow
- "Join Chat" button with gradient and hover animation
- Ambient animated background with floating orbs

### 4.2 Chat Layout
- **Desktop:** Sidebar (280px) + Main chat area
- **Tablet:** Collapsible sidebar + Main chat
- **Mobile:** Full-screen chat with slide-out user list

### 4.3 Sidebar (Online Users)
- Fixed width on desktop (280px)
- Header with "ONLINE" label and user count badge
- Scrollable user list with avatars
- User item: Avatar circle + username + status dot
- Collapse button on tablet/mobile

### 4.4 Chat Area
- Header: Chat room name + connection status
- Message list: Scrollable, auto-scroll to bottom
- Input area: Fixed at bottom with send button

### 4.5 Messages
- **Own messages:** Right-aligned, red gradient background
- **Other messages:** Left-aligned, dark card background
- Avatar for other users
- Username above message (for others)
- Timestamp below message (relative time)
- "Typing" indicator with animated dots

### 4.6 Input Area
- Fixed position at bottom
- Glassmorphism background
- Text input with placeholder "Type a message..."
- Send button with paper plane icon
- Send button animation on click (scale + glow)

### 4.7 Emoji Picker
- Triggered by emoji button
- Popup with common emojis
- Click to insert emoji in message

### 4.8 Sound Toggle
- Icon button in header
- Toggle sound effects on/off
- Persists in localStorage

---

## 5. Animations & Effects

### Background
- Animated gradient orbs floating (CSS keyframes)
- Subtle noise texture overlay
- Radial gradient from center

### Messages
- Fade-in + slide-up on receive (0.3s ease-out)
- Slide-out + fade on send (0.2s)
- Staggered animation for multiple messages

### Buttons
- Scale up on hover (1.05)
- Glow pulse on hover
- Press scale down (0.95)

### Transitions
- Sidebar slide: 0.3s ease-in-out
- Message appear: 0.3s ease-out
- Input focus: 0.2s ease

### Loading States
- Skeleton pulse animation
- Spinner with red accent

---

## 6. Functionality Specification

### Socket Events
- `join`: User joins with username
- `message`: Send/receive messages
- `typing`: Typing indicator
- `stopTyping`: Stop typing indicator
- `users`: Online users list update
- `userLeft`: User disconnect notification

### Message Structure
```json
{
  "id": "unique-id",
  "userId": "socket-id",
  "username": "string",
  "message": "string",
  "timestamp": "ISO timestamp",
  "isOwn": boolean
}
```

### User Structure
```json
{
  "id": "socket-id",
  "username": "string"
}
```

### Features
1. Join with unique username (validation: 2-20 chars, alphanumeric + underscore)
2. Real-time message sending/receiving
3. Typing indicator (shows when user is typing)
4. Online users list (updates on join/leave)
5. Auto-scroll to newest message
6. Enter to send, Shift+Enter for new line
7. Emoji picker
8. Sound effects toggle (stored in localStorage)
9. Message timestamps (relative: "just now", "2m ago", etc.)
10. Smooth scroll behavior

---

## 7. Mobile-Specific Features

### Touch Interactions
- Swipe from left to open user list
- Pull down to load earlier messages (future)
- Tap and hold for message options (future)

### Layout Adjustments
- Full-width chat area
- Bottom-anchored input (not fixed, flows with content)
- Larger touch targets (min 44px)
- Hidden sidebar, accessible via hamburger menu
- Keyboard-aware input (adjusts for virtual keyboard)

### Visual Adjustments
- Smaller avatars on mobile (36px vs 40px)
- Reduced padding
- Full-width messages

---

## 8. Acceptance Criteria

### Must Have
- [ ] User can join with username
- [ ] Messages appear in real-time
- [ ] Online users list updates correctly
- [ ] Typing indicator works
- [ ] Enter sends message
- [ ] Auto-scroll works
- [ ] Mobile responsive layout works
- [ ] No broken layouts at any viewport

### Nice to Have
- [ ] Emoji picker functional
- [ ] Sound toggle works
- [ ] Smooth animations throughout
- [ ] Glassmorphism effects visible

---

## 9. File Structure

```
/chatroom
├── backend/
│   ├── package.json
│   ├── index.js
│   └── .env (optional)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── JoinScreen.jsx
│   │   │   ├── ChatLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatArea.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── EmojiPicker.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   └── utils/
│   │       └── formatTime.js
│   └── public/
├── README.md
└── SPEC.md
```

---

## 10. Setup Instructions

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Production Build
```bash
cd frontend
npm run build
```