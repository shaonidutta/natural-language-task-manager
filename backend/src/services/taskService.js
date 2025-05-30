const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
// const { extractTasksFromText } = require('./openaiService');

function ruleBasedExtract(text) {
  // Priority
  let priority = 'P3';
  if (/\bp1\b/i.test(text)) priority = 'P1';
  else if (/\bp2\b/i.test(text)) priority = 'P2';
  else if (/\bp4\b/i.test(text)) priority = 'P4';

  // Date/Time patterns
  const datePatterns = [
    /(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)/g, // 20th June
    /(\d{1,2}(?::\d{2})?\s*(?:am|pm))/ig, // 5pm, 11:30am
    /([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?,\s+\d{4},\s+\d{1,2}:\d{2}\s*(?:am|pm))/ig, // Jun 20, 2025, 05:30 PM
    /(tomorrow|today)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/ig, // tomorrow 5pm, today 11:30am
  ];

  // Find all date/time patterns in the text
  let matches = [];
  for (const pattern of datePatterns) {
    matches = matches.concat([...text.matchAll(pattern)]);
  }
  // Sort matches by length (longest first), then by index
  matches.sort((a, b) => b[0].length - a[0].length || a.index - b.index);
  // Filter out overlapping matches, keep only the longest at each position
  let used = Array(text.length).fill(false);
  let filteredMatches = [];
  for (const m of matches) {
    let start = m.index;
    let end = m.index + m[0].length;
    let overlap = false;
    for (let i = start; i < end; i++) {
      if (used[i]) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      filteredMatches.push(m);
      for (let i = start; i < end; i++) used[i] = true;
    }
  }
  // Concatenate all matched date/time phrases
  let dueDateTime = filteredMatches.map(m => m[0]).join(' ').trim();
  // If no date found, use empty string
  if (!dueDateTime) {
    dueDateTime = '';
  }

  // Remove the date/time from the text
  let remainingText = text;
  if (filteredMatches.length > 0) {
    for (const m of filteredMatches) {
      remainingText = remainingText.replace(m[0], '').trim();
    }
  }

  // Find assignee (looking for a capitalized word that's not part of common task words)
  const commonTaskWords = ['client', 'meeting', 'call', 'email', 'review', 'submit', 'finish', 'create', 'update'];
  const words = remainingText.split(/\s+/);
  let assignee = 'Unassigned';
  let taskName = remainingText;

  // Look for the last capitalized word that's not a common task word
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    if (/^[A-Z][a-z]+$/.test(word) && !commonTaskWords.includes(word.toLowerCase())) {
      assignee = word;
      // Everything before the assignee is the task name
      taskName = words.slice(0, i).join(' ').trim();
      break;
    }
  }

  // If no assignee found, the entire remaining text is the task name
  if (assignee === 'Unassigned') {
    taskName = remainingText;
  }

  const result = {
    taskName,
    assignee,
    dueDateTime,
    priority
  };
  console.log('ruleBasedExtract:', result); // Debug log
  return result;
}

class TaskService {
  parseDateTime(dateTimeStr) {
    try {
      const today = new Date();
      let year = today.getFullYear();
      let month, day, hour = 23, minute = 59; // Defaults
      let matched = false;
      let lowerStr = dateTimeStr.toLowerCase();

      // Match '11pm 20th June' or '20th June 11pm'
      let match = lowerStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)/i);
      if (match) {
        // e.g. 11pm 20th June
        hour = parseInt(match[1], 10);
        minute = match[2] ? parseInt(match[2], 10) : 0;
        const ampm = match[3];
        day = parseInt(match[4], 10);
        month = match[5];
        if (ampm) {
          if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
          if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
        }
        matched = true;
      } else {
        // Match '20th June' (no time)
        match = lowerStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)/i);
        if (match) {
          day = parseInt(match[1], 10);
          month = match[2];
          hour = 23;
          minute = 59;
          matched = true;
        }
      }

      if (matched) {
        // Convert month name to number
        const monthNames = [
          'january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december'
        ];
        let monthIndex = monthNames.indexOf(month.toLowerCase());
        if (monthIndex === -1) monthIndex = today.getMonth(); // fallback to current month
        let parsedDate = new Date(year, monthIndex, day, hour, minute, 0, 0);
        // JavaScript Date months are 0-based, so subtract 1
        parsedDate = new Date(year, monthIndex, day, hour, minute, 0, 0);
        if (monthIndex >= 0) {
          parsedDate = new Date(year, monthIndex, day, hour, minute, 0, 0);
        } else {
          parsedDate = new Date(year, today.getMonth(), day, hour, minute, 0, 0);
        }
        // If the date has already passed this year, use next year
        if (parsedDate < today) {
          parsedDate.setFullYear(year + 1);
        }
        return parsedDate.toISOString().slice(0, 19).replace('T', ' ');
      }

      // Fallback to existing logic
      // ... existing code ...
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      let baseDate = null;
      let timeMatch = null;

      if (/tomorrow/.test(lowerStr)) {
        baseDate = tomorrow;
        timeMatch = lowerStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      } else if (/today/.test(lowerStr)) {
        baseDate = today;
        timeMatch = lowerStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      }
      if (baseDate && timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        let minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        let ampm = timeMatch[3];
        if (ampm) {
          if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
          if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
        }
        baseDate.setHours(hour, minute, 0, 0);
        return baseDate.toISOString().slice(0, 19).replace('T', ' ');
      }

      // Handle 'end of week', 'next week', etc.
      const dateMap = {
        'today': today,
        'tomorrow': tomorrow,
        'end of week': (() => {
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (5 - today.getDay())); // Friday
          endOfWeek.setHours(23, 59, 59, 999);
          return endOfWeek;
        })(),
        'next week': (() => {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return nextWeek;
        })()
      };
      let parsedDate = new Date(dateTimeStr);
      if (isNaN(parsedDate) || !dateTimeStr.includes('-')) {
        for (const [key, value] of Object.entries(dateMap)) {
          if (lowerStr.includes(key)) {
            parsedDate = value;
            break;
          }
        }
      }
      if (isNaN(parsedDate)) {
        today.setHours(23, 59, 59, 999);
        return today.toISOString().slice(0, 19).replace('T', ' ');
      }
      return parsedDate.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      console.error('Error parsing date:', error);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return today.toISOString().slice(0, 19).replace('T', ' ');
    }
  }

  async parseAndCreateTasks(text, mode) {
    try {
      // Use rule-based extraction
      let task = ruleBasedExtract(text);
      const validatePriority = (priority) => {
        const validPriorities = ['P1', 'P2', 'P3', 'P4'];
        return validPriorities.includes(priority) ? priority : 'P3';
      };
      task.priority = validatePriority(task.priority);
      const id = uuidv4();
      const dueDateTime = task.dueDateTime || '';
      console.log('Storing dueDateTime:', dueDateTime); // Debug log
      const assignee = task.assignee || "Unassigned";
      await pool.execute(
        'INSERT INTO tasks (id, task_name, assignee, due_datetime, priority) VALUES (?, ?, ?, ?, ?)',
        [id, task.taskName, assignee, dueDateTime, task.priority]
      );
      const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
      return rows;
    } catch (error) {
      console.error('Error in parseAndCreateTasks:', error);
      throw error;
    }
  }

  async getAllTasks() {
    try {
      const [tasks] = await pool.execute(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
      return tasks;
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      throw error;
    }
  }

  async updateTask(id, updates) {
    try {
      const { task_name, assignee, due_date_time, priority } = updates;
      await pool.execute(
        'UPDATE tasks SET task_name = ?, assignee = ?, due_datetime = ?, priority = ? WHERE id = ?',
        [task_name, assignee, due_date_time, priority, id]
      );
      // Get the updated task
      const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();
