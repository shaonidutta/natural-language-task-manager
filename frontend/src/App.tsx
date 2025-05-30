import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { InputForm } from './components/InputForm'
import { TaskBoard } from './components/TaskBoard'
import type { ParseRequest, Task, TaskUpdate } from './types/task'
import { parseTasks, fetchTasks, updateTask, deleteTask } from './api/tasks'

export default function App() {
  const queryClient = useQueryClient()

  // Fetch tasks
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    initialData: []
  })

  // Parse tasks mutation
  const { mutate: parseTasksMutation, isPending: isParsingTasks } = useMutation({
    mutationFn: (request: ParseRequest) => parseTasks(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Update task mutation
  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) => 
      updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Delete task mutation
  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const handleParseTasks = (request: ParseRequest) => {
    parseTasksMutation(request)
  }

  const handleUpdateTask = (id: string, updates: TaskUpdate) => {
    updateTaskMutation({ id, updates })
  }

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation(id)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <InputForm onParse={handleParseTasks} isLoading={isParsingTasks} />
        <TaskBoard 
          tasks={tasks} 
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          isLoading={isLoadingTasks} 
        />
      </div>
    </main>
  )
}
