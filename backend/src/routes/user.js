import express from 'express';
import User from '../models/User.js';
import Board from '../models/Board.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's boards
router.get('/boards', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const boards = await Board.find({
      $or: [
        { owner: userId },
        { collaborators: userId }
      ],
      isArchived: false
    })
      .populate('owner', 'username avatar')
      .populate('collaborators', 'username avatar')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Board.countDocuments({
      $or: [
        { owner: userId },
        { collaborators: userId }
      ],
      isArchived: false
    });

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
    console.error('Get user boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Promise.all([
      Board.countDocuments({ owner: userId }),
      Board.countDocuments({ collaborators: userId }),
      Board.countDocuments({ owner: userId }).where('lastActivity').gte(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    ]);

    res.json({
      stats: {
        boardsCreated: stats[0],
        boardsCollaborated: stats[1],
        activeBoards: stats[2]
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
