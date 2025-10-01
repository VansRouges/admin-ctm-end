import { Badge } from "@/components/ui/badge"

type Priority = "low" | "medium" | "high"

const priorityColors: Record<Priority, string> = {
    high: "bg-red-500 hover:bg-red-600",
    medium: "bg-yellow-500 hover:bg-yellow-600",
    low: "bg-green-500 hover:bg-green-600",
}

interface PriorityBadgeProps {
    priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    return (
        <Badge className={`${priorityColors[priority]} text-white border-0`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
    )
}

