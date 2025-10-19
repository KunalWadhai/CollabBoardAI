import express from 'express';
import Board from '../models/Board.js';
import User from '../models/User.js';

const router = express.Router();

// Get all boards for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, search, tags } = req.query;

    const query = {
      $or: [
        { owner: userId },
        { collaborators: userId },
        { isPublic: true }
      ],
      isArchived: false
    };

    if (search) {
      query.$and = [
        {
          $text: { $search: search }
        }
      ];
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    const boards = await Board.find(query)
      .populate('owner', 'username avatar')
      .populate('collaborators', 'username avatar')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Board.countDocuments(query);

    res.json({
      boards,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single board
router.get('/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.userId;

    const board = await Board.findById(boardId)
      .populate('owner', 'username avatar')
      .populate('collaborators', 'username avatar');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (!board.hasAccess(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ board });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new board
router.post('/', async (req, res) => {
  try {
    const { name, description, isPublic = false, settings } = req.body;
    const userId = req.user.userId;

    const board = new Board({
      name,
      description,
      owner: userId,
      isPublic,
      settings: settings || {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        gridEnabled: false
      }
    });

    await board.save();
    await board.populate('owner', 'username avatar');

    res.status(201).json({
      message: 'Board created successfully',
      board
    });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update board
router.put('/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.userId;
    const { name, description, isPublic, settings } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only owner can update board' });
    }

    if (name) board.name = name;
    if (description !== undefined) board.description = description;
    if (isPublic !== undefined) board.isPublic = isPublic;
    if (settings) board.settings = { ...board.settings, ...settings };

    await board.save();
    await board.updateLastActivity();

    res.json({
      message: 'Board updated successfully',
      board
    });
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete board
router.delete('/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.userId;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only owner can delete board' });
    }

    await Board.findByIdAndDelete(boardId);

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add collaborator
router.post('/:id/collaborators', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.userId;
    const { email } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only owner can add collaborators' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as collaborator' });
    }

    await board.addCollaborator(user._id);
    await board.populate('collaborators', 'username avatar');

    res.json({
      message: 'Collaborator added successfully',
      board
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove collaborator
router.delete('/:id/collaborators/:userId', async (req, res) => {
  try {
    const boardId = req.params.id;
    const ownerId = req.user.userId;
    const collaboratorId = req.params.userId;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: 'Only owner can remove collaborators' });
    }

    await board.removeCollaborator(collaboratorId);
    await board.populate('collaborators', 'username avatar');

    res.json({
      message: 'Collaborator removed successfully',
      board
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get board drawing history
router.get('/:id/history', async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.userId;
    const { limit = 50 } = req.query;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (!board.hasAccess(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const history = board.getRecentActions(parseInt(limit));

    res.json({ history });
  } catch (error) {
    console.error('Get board history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

