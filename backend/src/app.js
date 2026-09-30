import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mlRoutes from './routes/mlRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { store } from './models/store.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'QueueLess Backend API',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Public Services list endpoint
app.get('/api/public/services', (req, res) => {
  const enrichedServices = store.services.map(s => {
    const dept = store.departments.find(d => d.departmentId === s.departmentId);
    const org = dept ? store.organizations.find(o => o.organizationId === dept.organizationId) : null;
    return {
      ...s,
      departmentName: dept ? dept.name : 'General',
      organizationName: org ? org.name : 'QueueLess Facility'
    };
  });
  res.json({ success: true, data: enrichedServices });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ml', mlRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` }
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
