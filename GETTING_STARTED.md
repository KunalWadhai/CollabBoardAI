# 🚀 Getting Started with CollabBoard AI

## Quick Start

### Option 1: Local Development Setup

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

3. **Visit the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Option 2: Docker Setup

1. **Start all services with Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Visit the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Prerequisites

- Node.js 18+ 
- MongoDB (or use Docker)
- Redis (or use Docker)
- Git

## Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/collabboard
   REDIS_URL=redis://localhost:6379
   
   # JWT Secret (generate a strong secret)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # OpenAI API (for AI features)
   OPENAI_API_KEY=your-openai-api-key-here
   ```

## Development Commands

```bash
# Start all services
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Project Structure

```
CollabBoardAI/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── docs/             # Documentation
├── docker-compose.yml # Docker configuration
├── package.json      # Root package.json
└── README.md         # Project overview
```

## Features

### ✅ Implemented
- Real-time collaborative whiteboard
- User authentication and authorization
- Drawing tools (pen, eraser, shapes, text)
- Live cursor tracking
- WebSocket communication
- Responsive design
- Dark/Light theme support
- User management
- Board management
- Drawing history

### 🚧 In Progress
- AI-powered drawing assistance
- Shape recognition
- Text extraction (OCR)
- Smart suggestions
- Advanced animations
- Export/Import functionality

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board details
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Collaboration
- `POST /api/boards/:id/collaborators` - Add collaborator
- `DELETE /api/boards/:id/collaborators/:userId` - Remove collaborator

## WebSocket Events

### Client → Server
- `join-board` - Join a board room
- `leave-board` - Leave a board room
- `drawing-action` - Send drawing action
- `cursor-update` - Update cursor position
- `chat-message` - Send chat message
- `ai-request` - Request AI assistance

### Server → Client
- `board-joined` - Confirmation of joining board
- `user-joined` - New user joined board
- `user-left` - User left board
- `drawing-action` - Receive drawing action
- `user-cursor-update` - Receive cursor update
- `chat-message` - Receive chat message
- `ai-response` - Receive AI response

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill processes on ports 3001 and 5173
   lsof -ti:3001 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   ```

2. **MongoDB connection failed:**
   - Make sure MongoDB is running
   - Check connection string in .env file
   - Verify MongoDB credentials

3. **Redis connection failed:**
   - Make sure Redis is running
   - Check Redis URL in .env file

4. **Build errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Docker Issues

1. **Container won't start:**
   ```bash
   # Check logs
   docker-compose logs
   
   # Rebuild containers
   docker-compose down
   docker-compose up --build
   ```

2. **Database connection issues:**
   - Wait for MongoDB to fully start (30 seconds)
   - Check if ports are available

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Create an issue on GitHub
- Check the documentation
- Join our Discord community (coming soon)

---

Happy collaborating! 🎨✨

