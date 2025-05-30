import axiosInstance from './axiosInstance';
import type { ParseRequest, ParseResponse, Task, TaskUpdate } from '../types/task';

export async function parseTasks(request: ParseRequest): Promise<ParseResponse> {
  const response = await axiosInstance.post<{ tasks: Task[] }>('/parse', request);
  return response.data;
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await axiosInstance.get('/tasks');
    console.log('Fetched tasks response:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function updateTask(id: string, updates: TaskUpdate): Promise<Task> {
  const response = await axiosInstance.put<{ task: Task }>(`/tasks/${id}`, updates);
  return response.data.task;
}

export async function deleteTask(id: string): Promise<{ message: string }> {
  const response = await axiosInstance.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
}
