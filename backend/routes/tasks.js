const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all tasks for logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const [result] = await db.execute('INSERT INTO tasks (user_id, title) VALUES (?, ?)', [req.user.id, title]);
        res.status(201).json({ id: result.insertId, user_id: req.user.id, title, status: 'pending' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task status (optional but useful)
router.put('/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        await db.execute('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, id, req.user.id]);
        res.json({ message: 'Task updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
