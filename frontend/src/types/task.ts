export interface Task {
  id: string;
  task_name: string;
  assignee: string;
  due_datetime: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  created_at: string;
  updated_at: string;
}

export interface ParseRequest {
  text: string;
}

export interface ParseResponse {
  tasks: Task[];
}

export interface TaskUpdate {
  task_name: string;
  assignee: string;
  due_datetime: string;
  priority: Task['priority'];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
