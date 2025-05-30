import type { Task, TaskUpdate } from "../types/task"
import { TaskCard } from "./TaskCard"

interface TaskBoardProps {
  tasks: Task[]
  onUpdateTask: (id: string, updates: TaskUpdate) => void
  onDeleteTask: (id: string) => void
  isLoading?: boolean
}

export function TaskBoard({ tasks, onUpdateTask, onDeleteTask, isLoading }: TaskBoardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-2">Task Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {tasks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No tasks found.</p>
        </div>
      )}
    </div>
  )
}
