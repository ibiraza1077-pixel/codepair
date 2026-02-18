# CodePair

> Real-time collaborative coding interview platform built with TypeScript, React, Socket.io, and Express

A full-stack web application that enables multiple users to practice technical interviews together in real-time. Features live code synchronization, problem bank, code execution, chat, and intelligent hints.

![CodePair Demo](https://img.shields.io/badge/Status-Live-success) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)

---

## Overview

CodePair is a collaborative coding platform designed to simulate technical interview environments. It provides real-time code synchronization, integrated problem sets, and execution capabilities to help developers practice coding interviews together.

---

## Core Features

### Real-Time Collaboration
- **Live Code Synchronization** - Instant propagation of code changes across all participants
- **Multi-User Sessions** - Support for concurrent users in shared coding environments
- **Integrated Chat** - In-session communication without context switching
- **Session Timer** - Built-in timing for interview simulation

### Development Environment
- **Monaco Editor Integration** - Professional code editor with syntax highlighting and IntelliSense
- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, and C++ with language-specific features
- **Code Execution Engine** - Sandboxed runtime environment for testing solutions
- **Smart Autocomplete** - Context-aware code completion

### Interview Practice
- **Curated Problem Bank** - Collection of algorithmic challenges covering fundamental data structures and algorithms
- **Intelligent Hint System** - Progressive hints to guide problem-solving without revealing solutions
- **Difficulty Classification** - Problems organized by complexity level
- **Topic Categorization** - Filtering by algorithmic concepts (Arrays, Hash Tables, Dynamic Programming, etc.)

### User Interface
- **Dark Theme** - Professional development environment aesthetic
- **Responsive Design** - Optimized for desktop and tablet devices
- **Session Management** - Simple sharing mechanism via session identifiers
- **Participant Tracking** - Real-time display of active session members

---

## Technology Stack

### Frontend
- React 18 with TypeScript
- Socket.io Client for WebSocket communication
- Monaco Editor (Microsoft's VS Code editor component)
- React Router for client-side routing
- Vite for build tooling and development server
- Lucide React for iconography

### Backend
- Node.js with Express framework
- Socket.io for real-time bidirectional communication
- TypeScript for type safety and developer experience
- VM2 for secure JavaScript code execution
- UUID for session identifier generation

---

## Installation and Setup

### Prerequisites
- Node.js version 18 or higher
- npm or yarn package manager

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/ibiraza1077-pixel/codepair.git
cd codepair
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

### Development

Start the backend server (from `server/` directory):
```bash
npm run dev
```
The server will run on `http://localhost:5000`

Start the frontend application (from `client/` directory):
```bash
npm run dev
```
The client will run on `http://localhost:5173`

Access the application by navigating to `http://localhost:5173` in your browser.

---

## Usage Guide

### Creating a Session
1. Enter your display name
2. Click "Create New Session"
3. Share the generated Session ID with collaborators

### Joining an Existing Session
1. Enter your display name
2. Input the Session ID provided by the session creator
3. Click "Join Existing Session"

### Collaborative Coding
1. Select a problem from the available problem bank
2. Write code in the shared editor environment
3. Execute code to verify functionality
4. Communicate via integrated chat
5. Request hints for guidance when needed

---

## Problem Collection

The platform includes algorithmic challenges across multiple difficulty levels:

**Easy Difficulty:**
- Two Sum
- Reverse String
- Valid Parentheses
- FizzBuzz
- Palindrome Number
- Climbing Stairs
- Reverse Linked List
- Binary Search
- Merge Sorted Array

**Medium Difficulty:**
- Maximum Subarray

---

## Architecture
```
codepair/
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── data/              # Problem definitions and test cases
│   │   ├── services/          # Code execution and validation services
│   │   └── index.ts           # Express server and Socket.io configuration
│   ├── package.json
│   └── tsconfig.json
│
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── pages/             # Route components (Home, Session)
│   │   ├── App.tsx            # Application root and routing
│   │   └── App.css            # Global styles
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Security Implementation

- Sandboxed code execution environment using VM2
- Execution timeout limits (5 seconds maximum)
- Session-based isolation between concurrent users
- No persistent storage of user code or personal data
- Rate limiting on code execution requests

---

## Future Development

**Planned Features:**
- User authentication and persistent profiles
- Session recording and playback functionality
- Complete Python execution support
- AI-powered code review and optimization suggestions
- WebRTC integration for video/audio communication
- Expanded problem library (target: 50+ problems)
- Company-specific problem collections
- Performance analytics and progress tracking
- Interview preparation roadmaps

---

## Contributing

Contributions are welcome. Please submit pull requests with:
- Clear description of changes
- Adherence to existing code style
- Updated tests where applicable
- Documentation updates for new features

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Author

**Ibrahim**
- GitHub: [@ibiraza1077-pixel](https://github.com/ibiraza1077-pixel)
- Portfolio demonstration of full-stack development capabilities

---

## Acknowledgments

- Monaco Editor by Microsoft for the code editing component
- Socket.io for real-time communication infrastructure
- LeetCode for algorithmic problem inspiration
- Open-source community for tooling and libraries

---

**If you find this project useful, please consider starring the repository.**
