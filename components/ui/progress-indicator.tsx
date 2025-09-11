import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number // 0-100
  size?: "sm" | "md" | "lg"
  variant?: "default" | "subject" | "module"
  className?: string
}

export function CircularProgress({ 
  value, 
  size = "sm", 
  variant = "default",
  className 
}: CircularProgressProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }
  
  const strokeWidth = size === "sm" ? 2 : size === "md" ? 2.5 : 3
  const radius = size === "sm" ? 6 : size === "md" ? 9 : 12
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference
  
  const colorClasses = {
    default: "text-primary",
    subject: "text-primary",
    module: "text-secondary"
  }

  return (
    <div className={cn(sizeClasses[size], "relative flex items-center justify-center", className)}>
      <svg
        className={cn("transform -rotate-90", sizeClasses[size])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(colorClasses[variant], "transition-all duration-300 ease-in-out")}
          fill="none"
        />
      </svg>
      {/* Center dot for completed items */}
      {value === 100 && (
        <div className={cn(
          "absolute rounded-full bg-current",
          size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-2.5 w-2.5",
          colorClasses[variant]
        )} />
      )}
    </div>
  )
}

interface LinearProgressProps {
  value: number // 0-100
  size?: "sm" | "md"
  variant?: "default" | "subject" | "module"
  className?: string
}

export function LinearProgress({ 
  value, 
  size = "sm", 
  variant = "default",
  className 
}: LinearProgressProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-1.5"
  }
  
  const colorClasses = {
    default: "bg-primary",
    subject: "bg-primary",
    module: "bg-secondary"
  }

  return (
    <div className={cn(
      "w-full bg-muted/20 rounded-full overflow-hidden",
      sizeClasses[size],
      className
    )}>
      <div
        className={cn(
          "h-full transition-all duration-300 ease-in-out rounded-full",
          colorClasses[variant]
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

interface ProgressBadgeProps {
  value: number // 0-100
  size?: "sm" | "md"
  showPercentage?: boolean
  className?: string
}

export function ProgressBadge({ 
  value, 
  size = "sm", 
  showPercentage = false,
  className 
}: ProgressBadgeProps) {
  const isCompleted = value === 100
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1"
  }

  if (showPercentage) {
    return (
      <span className={cn(
        "inline-flex items-center rounded-md bg-muted/30 font-medium text-muted-foreground",
        sizeClasses[size],
        isCompleted && "bg-primary/10 text-primary",
        className
      )}>
        {value}%
      </span>
    )
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-md font-medium",
      sizeClasses[size],
      isCompleted 
        ? "bg-primary/10 text-primary" 
        : "bg-muted/30 text-muted-foreground",
      className
    )}>
      {isCompleted ? "✓" : `${value}%`}
    </span>
  )
}
