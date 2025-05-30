import type React from "react"
import { useState } from "react"
import type { ParseRequest } from "../types/task"
import { MessageSquare, FileText, Loader2, Sparkles } from "lucide-react"

interface InputFormProps {
  onParse: (request: ParseRequest) => void
  isLoading?: boolean
}

export function InputForm({ onParse, isLoading }: InputFormProps) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onParse({ 
        text: text.trim()
      })
    }
  }

  return (
    <section className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          AI Task Manager
        </h1>
        <p className="text-gray-300 text-xl">Turn your natural language into actionable tasks</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="task-input" className="block text-lg font-medium text-gray-200 mb-4">
            Describe your task in natural language
          </label>
          <input
            id="task-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Finish the landing page by Shaoni on May 3, 2025 at 7:00 PM"
            className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="
            flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
            text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 
            focus:ring-4 focus:ring-blue-400/25 transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25
            border border-blue-500/20
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Create Task
            </>
          )}
        </button>
      </form>

      {/* Example hints */}
      <div className="p-6 bg-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-700/30">
        <h3 className="font-medium text-blue-300 mb-3 text-lg">
          Example tasks:
        </h3>
        <div className="text-blue-200/80 space-y-2">
          <p>• "Finish landing page Aman by 11pm 20th June"</p>
          <p>• "Call client Rajeev tomorrow 5pm"</p>
        </div>
      </div>
    </section>
  )
}
