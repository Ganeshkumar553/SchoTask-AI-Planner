const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS to allow both local and production URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://scho-task-ai-planner.vercel.app",
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map(origin => origin.replace(/\/$/, "")); // Remove trailing slashes

console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // If no origin (like mobile apps or curl), allow it
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) {
      // Reflect the EXACT origin sent by the browser
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('SchoTask Backend is running...');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    } else {
        console.error('Server error:', error);
    }
});
