require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Route imports
const stakingRoutes = require('./routes/staking');
const userRoutes = require('./routes/users');
const nftRoutes = require('./routes/nft');
const lendingRoutes = require('./routes/lending');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.API_RATE_LIMIT || 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://strawhat-defi.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'StrawHat DeFi Backend',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/staking', stakingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/lending', lendingRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏴‍☠️ Welcome to StrawHat DeFi Platform API',
    version: '1.0.0',
    hackathon: 'IndiaCodex 2024',
    documentation: '/api/docs',
    endpoints: {
      staking: '/api/staking',
      users: '/api/users',
      nft: '/api/nft',
      lending: '/api/lending'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The endpoint ${req.originalUrl} does not exist.`
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/strawhat-defi');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    logger.info(`🏴‍☠️ StrawHat DeFi Backend running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info('Ready to set sail for DeFi adventures!');
  });
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(() => {
    logger.info('Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  mongoose.connection.close(() => {
    logger.info('Database connection closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;