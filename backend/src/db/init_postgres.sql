-- Create database for Natural Language Task Manager (Single-Task Edition)
CREATE DATABASE natural_language_task_manager;

\c natural_language_task_manager;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name TEXT NOT NULL,
    assignee TEXT NOT NULL,
    due_datetime TIMESTAMPTZ NOT NULL,
    priority VARCHAR(2) NOT NULL DEFAULT 'P3' CHECK (priority IN ('P1', 'P2', 'P3', 'P4'))
);
