import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Board from '../models/Board.js';
import { addUserToRoom, removeUserFromRoom, getRoomUsers } from '../config/redis.js';

export const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = {
        id: user._id.toString(),
        username: user.username,
        avatar: user.avatar
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);

    // Join board room
    socket.on('join-board', async (boardId) => {
      try {
        // Verify user has access to board
        const board = await Board.findById(boardId);
        if (!board || !board.hasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied to board' });
          return;
        }

        // Leave previous room if any
        if (socket.currentRoom) {
          socket.leave(socket.currentRoom);
          await removeUserFromRoom(socket.currentRoom, socket.userId);
        }

        // Join new room
        socket.join(boardId);
        socket.currentRoom = boardId;

        // Add user to Redis room
        await addUserToRoom(boardId, socket.userId, {
          id: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar,
          cursor: { x: 0, y: 0 },
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });

        // Get current room users
        const roomUsers = await getRoomUsers(boardId);

        // Notify room about new user
        socket.to(boardId).emit('user-joined', {
          id: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar,
          cursor: { x: 0, y: 0 },
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });

        // Send current room state to user
        socket.emit('board-joined', {
          boardId,
          boardName: board.name,
          users: roomUsers,
          drawingHistory: board.getRecentActions(50)
        });

        console.log(`📝 User ${socket.user.username} joined board ${boardId}`);
      } catch (error) {
        console.error('Join board error:', error);
        socket.emit('error', { message: 'Failed to join board' });
      }
    });

    // Leave board room
    socket.on('leave-board', async (boardId) => {
      try {
        socket.leave(boardId);
        
        if (socket.currentRoom === boardId) {
          await removeUserFromRoom(boardId, socket.userId);
          socket.currentRoom = null;
        }

        // Notify room about user leaving
        socket.to(boardId).emit('user-left', socket.userId);
        
        console.log(`👋 User ${socket.user.username} left board ${boardId}`);
      } catch (error) {
        console.error('Leave board error:', error);
      }
    });

    // Handle drawing actions
    socket.on('drawing-action', async (data) => {
      try {
        const { boardId, action } = data;

        if (!socket.currentRoom || socket.currentRoom !== boardId) {
          socket.emit('error', { message: 'Not in board room' });
          return;
        }

        // Verify board access
        const board = await Board.findById(boardId);
        if (!board || !board.hasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Add action to board history
        await board.addDrawingAction({
          ...action,
          userId: socket.userId
        });

        // Broadcast to all users in room except sender
        socket.to(boardId).emit('drawing-action', {
          ...action,
          userId: socket.userId,
          username: socket.user.username
        });

        console.log(`🎨 Drawing action from ${socket.user.username} in board ${boardId}`);
      } catch (error) {
        console.error('Drawing action error:', error);
        socket.emit('error', { message: 'Failed to process drawing action' });
      }
    });

    // Handle cursor updates
    socket.on('cursor-update', async (data) => {
      try {
        const { boardId, cursor } = data;

        if (!socket.currentRoom || socket.currentRoom !== boardId) {
          return;
        }

        // Update user cursor in Redis
        await addUserToRoom(boardId, socket.userId, {
          id: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar,
          cursor,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });

        // Broadcast cursor update to room
        socket.to(boardId).emit('user-cursor-update', {
          userId: socket.userId,
          username: socket.user.username,
          cursor
        });
      } catch (error) {
        console.error('Cursor update error:', error);
      }
    });

    // Handle chat messages
    socket.on('chat-message', async (data) => {
      try {
        const { boardId, message } = data;

        if (!socket.currentRoom || socket.currentRoom !== boardId) {
          socket.emit('error', { message: 'Not in board room' });
          return;
        }

        // Verify board access
        const board = await Board.findById(boardId);
        if (!board || !board.hasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        const chatMessage = {
          id: Date.now().toString(),
          userId: socket.userId,
          username: socket.user.username,
          message,
          timestamp: Date.now(),
          boardId
        };

        // Broadcast to all users in room
        io.to(boardId).emit('chat-message', chatMessage);

        console.log(`💬 Chat message from ${socket.user.username} in board ${boardId}`);
      } catch (error) {
        console.error('Chat message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle AI requests
    socket.on('ai-request', async (data) => {
      try {
        const { boardId, request, type } = data;

        if (!socket.currentRoom || socket.currentRoom !== boardId) {
          socket.emit('error', { message: 'Not in board room' });
          return;
        }

        // Verify board access
        const board = await Board.findById(boardId);
        if (!board || !board.hasAccess(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Process AI request based on type
        let aiResponse;
        switch (type) {
          case 'shape-recognition':
            aiResponse = await processShapeRecognition(request);
            break;
          case 'text-extraction':
            aiResponse = await processTextExtraction(request);
            break;
          case 'suggestion':
            aiResponse = await processSuggestion(request);
            break;
          default:
            aiResponse = { error: 'Unknown AI request type' };
        }

        // Send AI response back to user
        socket.emit('ai-response', {
          type,
          request,
          response: aiResponse
        });

        console.log(`🤖 AI request from ${socket.user.username} in board ${boardId}`);
      } catch (error) {
        console.error('AI request error:', error);
        socket.emit('error', { message: 'Failed to process AI request' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.currentRoom) {
          await removeUserFromRoom(socket.currentRoom, socket.userId);
          socket.to(socket.currentRoom).emit('user-left', socket.userId);
        }
        
        console.log(`❌ User disconnected: ${socket.user.username} (${socket.id})`);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });
};

// AI Processing Functions
const processShapeRecognition = async (request) => {
  // Mock AI processing - in real implementation, this would use OpenAI API
  return {
    detectedShapes: ['rectangle', 'circle'],
    confidence: 0.95,
    suggestions: ['Perfect circle detected', 'Consider adding a border']
  };
};

const processTextExtraction = async (request) => {
  // Mock AI processing - in real implementation, this would use OCR
  return {
    extractedText: 'Sample extracted text',
    confidence: 0.88,
    boundingBoxes: []
  };
};

const processSuggestion = async (request) => {
  // Mock AI processing - in real implementation, this would use OpenAI API
  return {
    suggestions: [
      'Try using a different color scheme',
      'Add more visual hierarchy',
      'Consider adding icons'
    ]
  };
};

