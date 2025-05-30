# Natural Language Task Manager (Single-Task Edition)

Transform your natural language into actionable tasks with a modern, mobile-responsive task board. This app uses a MySQL backend and a React + Tailwind CSS frontend for a seamless, intuitive experience.

## Features

- **Natural Language Input**: Create tasks by describing them in plain English
- **Task Extraction**: Automatically extracts task name, assignee, due date, and priority from your input
- **Task Board**: Clean, modern interface to view, edit, and delete tasks
- **Inline Editing**: Edit any task field directly from the board
- **Priority Levels**: P1 (Critical), P2 (High), P3 (Medium), P4 (Low)
- **Mobile Responsive**: Works beautifully on phones, tablets, and desktops
- **MySQL Database**: Reliable, production-ready data storage
- **Simple Setup**: Easy to run locally with clear environment variable configuration

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- MySQL database

---

### Database Setup

1. Ensure your MySQL server is running and accessible.
2. Create a database (e.g. `task_manager`).
3. Run the SQL script at `backend/src/db/init_postgres.sql` to create the necessary tables.

**Schema Note:**
- The `due_datetime` column is now a `TEXT` field and stores the original natural language string (e.g., '20th June, 11pm'), not a date/time value.

---

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following content:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=task_manager
   PORT=3000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on [http://localhost:3000](http://localhost:3000)

---

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory with the following content:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173)

---

## Mobile Responsiveness

- The UI is fully responsive and adapts to all screen sizes using Tailwind CSS utility classes.
- No additional configuration is needed for mobile support.

---

## .gitignore Best Practices

Make sure your `.gitignore` includes:
```
node_modules/
.env
.env.*
dist/
build/
coverage/
*.log
.DS_Store
Thumbs.db
```

---

## Notes
- The app is designed for single-task input and management.
- All test files have been removed for production use.
- For any issues, check your environment variables and database connection first.

---


