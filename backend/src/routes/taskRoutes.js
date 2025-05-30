const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Parse text and extract tasks
router.post('/parse', taskController.parseText);

// Get all tasks
router.get('/', taskController.getTasks);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
