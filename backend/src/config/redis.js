import { createClient } from 'redis';

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('🚀 Redis Client Ready');
    });

    redisClient.on('end', () => {
      console.log('⚠️ Redis Client Disconnected');
    });

    await redisClient.connect();
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await redisClient.quit();
      console.log('🔌 Redis connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  }
};

// Session management helpers
const setSession = async (sessionId, data, ttl = 3600) => {
  try {
    await redisClient.setEx(sessionId, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting session:', error);
  }
};

const getSession = async (sessionId) => {
  try {
    const data = await redisClient.get(sessionId);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

const deleteSession = async (sessionId) => {
  try {
    await redisClient.del(sessionId);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

// Room management helpers
const addUserToRoom = async (roomId, userId, userData) => {
  try {
    await redisClient.hSet(`room:${roomId}`, userId, JSON.stringify(userData));
    await redisClient.expire(`room:${roomId}`, 86400); // 24 hours
  } catch (error) {
    console.error('Error adding user to room:', error);
  }
};

const removeUserFromRoom = async (roomId, userId) => {
  try {
    await redisClient.hDel(`room:${roomId}`, userId);
  } catch (error) {
    console.error('Error removing user from room:', error);
  }
};

const getRoomUsers = async (roomId) => {
  try {
    const users = await redisClient.hGetAll(`room:${roomId}`);
    return Object.values(users).map(user => JSON.parse(user));
  } catch (error) {
    console.error('Error getting room users:', error);
    return [];
  }
};

export { 
  connectRedis, 
  redisClient, 
  setSession, 
  getSession, 
  deleteSession,
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers
};

