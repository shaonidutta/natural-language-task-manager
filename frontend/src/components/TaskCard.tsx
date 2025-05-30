import { useState } from "react"
import type { Task, TaskUpdate } from "../types/task"
import { PriorityBadge } from "./PriorityBadge"
import { formatDateTime } from "../utils/dateFormat"
import { Calendar, User, Edit3, Check, X, Trash2, AlertCircle } from "lucide-react"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: TaskUpdate) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editedTask, setEditedTask] = useState<TaskUpdate>({
    task_name: task.task_name,
    assignee: task.assignee,
    due_datetime: task.due_datetime || '',
    priority: task.priority
  })
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    try {
      // Validate task name
      if (!editedTask.task_name.trim()) {
        throw new Error("Task name is required")
      }

      // Validate assignee
      if (!editedTask.assignee.trim()) {
        throw new Error("Assignee is required")
      }

      // Validate due date
      if (!editedTask.due_datetime) {
        throw new Error("Due date is required")
      }

      // Validate priority
      if (!['P1', 'P2', 'P3', 'P4'].includes(editedTask.priority)) {
        throw new Error("Invalid priority")
      }

      onUpdate(task.id, editedTask)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid task data")
    }
  }

  const handleCancel = () => {
    setEditedTask({
      task_name: task.task_name,
      assignee: task.assignee,
      due_datetime: task.due_datetime || '',
      priority: task.priority
    })
    setIsEditing(false)
    setError(null)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 w-full">
        <div className="flex items-start justify-between mb-4">
          <PriorityBadge priority={editedTask.priority} />
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="sm:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
              aria-label="Edit task"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="sm:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-900/50 transition-all duration-200"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 text-red-300 rounded-lg border border-red-700/50">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
              <input
                type="text"
                value={editedTask.task_name}
                onChange={(e) => setEditedTask({ ...editedTask, task_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
              <input
                type="text"
                value={editedTask.assignee}
                onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={editedTask.due_datetime ? editedTask.due_datetime.slice(0, 16) : ''}
                onChange={(e) => setEditedTask({ ...editedTask, due_datetime: new Date(e.target.value).toISOString() })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task["priority"] })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
                <option value="P4">P4 - Low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 w-full sm:w-auto"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 w-full sm:w-auto"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-100 text-base sm:text-lg leading-tight">{task.task_name}</h3>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{task.assignee}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{task.due_datetime || ''}</span>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Delete Task</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
