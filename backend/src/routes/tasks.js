const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const chrono = require('chrono-node');

function toMySQLDateTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

function parseTask(input) {
    // Extract assignee: look for a word after "by" or "for"
    const assigneeMatch = input.match(/\b(?:by|for)\s+(\w+)\b/i);
    const assignee = assigneeMatch ? assigneeMatch[1] : 'Unknown';

    // Extract due date/time using chrono-node
    const parsedDate = chrono.parseDate(input);
    const due_datetime = parsedDate ? toMySQLDateTime(parsedDate) : null;

    // Extract task name: remove assignee and date parts
    let task_name = input;
    if (assigneeMatch) {
        task_name = task_name.replace(assigneeMatch[0], '').trim();
    }
    if (parsedDate) {
        task_name = task_name.replace(parsedDate.toString(), '').trim();
    }

    // Default priority is P3 unless specified
    let priority = 'P3';
    if (input.match(/\bP1\b/i)) priority = 'P1';
    else if (input.match(/\bP2\b/i)) priority = 'P2';
    else if (input.match(/\bP4\b/i)) priority = 'P4';

    return { task_name, assignee, due_datetime, priority };
}

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY due_datetime ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a new task
router.post('/parse', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Missing task text' });
        }

        const { task_name, assignee, due_datetime, priority } = parseTask(text);
        if (!due_datetime) {
            return res.status(400).json({ error: 'Could not parse due date/time' });
        }

        const task = {
            id: uuidv4(),
            task_name,
            assignee,
            due_datetime,
            priority
        };

        await pool.query(
            'INSERT INTO tasks (id, task_name, assignee, due_datetime, priority) VALUES (?, ?, ?, ?, ?)',
            [task.id, task.task_name, task.assignee, task.due_datetime, task.priority]
        );

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task_name, assignee, due_datetime, priority } = req.body;

        const mysqlDueDatetime = toMySQLDateTime(due_datetime);
        if (!mysqlDueDatetime) {
            return res.status(400).json({ error: 'Invalid due_datetime format' });
        }

        const [result] = await pool.query(
            'UPDATE tasks SET task_name = ?, assignee = ?, due_datetime = ?, priority = ? WHERE id = ?',
            [task_name, assignee, mysqlDueDatetime, priority, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ id, task_name, assignee, due_datetime: mysqlDueDatetime, priority });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router; 