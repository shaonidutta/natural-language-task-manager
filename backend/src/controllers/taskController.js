const taskService = require('../services/taskService');

const taskController = {
  // Parse text and extract tasks
  async parseText(req, res) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Only single mode supported now
      const tasks = await taskService.parseAndCreateTasks(text, 'single');
      res.json({ tasks });
    } catch (error) {
      console.error('Error parsing text:', error);
      res.status(500).json({ error: 'Error parsing text', details: error.message });
    }
  },

  // Get all tasks
  async getTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      res.json({ tasks });
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Error getting tasks' });
    }
  },

  // Update task
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate required fields (no status now)
      const requiredFields = ['task_name', 'assignee', 'due_date_time', 'priority'];
      const missingFields = requiredFields.filter(field => !updates[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          missingFields 
        });
      }

      // Validate priority including P4
      if (!['P1', 'P2', 'P3', 'P4'].includes(updates.priority)) {
        return res.status(400).json({ 
          error: 'Invalid priority. Must be P1, P2, P3, or P4' 
        });
      }

      const updatedTask = await taskService.updateTask(id, updates);
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ task: updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Error updating task' });
    }
  },

  // Delete task
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const result = await taskService.deleteTask(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Error deleting task' });
    }
  }
};

module.exports = taskController;
