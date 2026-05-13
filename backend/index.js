const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: "https://scho-task-ai-planner.vercel.app/",
    credentials: true
}));

// Middleware
app.use(cors());
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
