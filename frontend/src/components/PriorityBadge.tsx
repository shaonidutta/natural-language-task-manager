interface PriorityBadgeProps {
  priority: "P1" | "P2" | "P3" | "P4"
  className?: string
}

const priorityConfig = {
  P1: {
    label: "Critical",
    className: "bg-red-900/30 text-red-300 border-red-700/50",
    dotColor: "bg-red-400",
  },
  P2: {
    label: "High",
    className: "bg-orange-900/30 text-orange-300 border-orange-700/50",
    dotColor: "bg-orange-400",
  },
  P3: {
    label: "Medium",
    className: "bg-blue-900/30 text-blue-300 border-blue-700/50",
    dotColor: "bg-blue-400",
  },
  P4: {
    label: "Low",
    className: "bg-yellow-900/30 text-yellow-300 border-yellow-700/50",
    dotColor: "bg-yellow-400",
  }
}

export function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
        transition-all duration-200 hover:scale-105
        ${config.className} ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {priority} - {config.label}
    </span>
  )
}
