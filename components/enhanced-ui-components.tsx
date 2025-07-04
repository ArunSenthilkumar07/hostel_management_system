"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface EnhancedStatCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "increase" | "decrease"
  icon: any
  color: "blue" | "green" | "red" | "yellow" | "purple"
  description?: string
}

export function EnhancedStatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  description,
}: EnhancedStatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center mt-4 space-x-2">
            {changeType === "increase" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface EnhancedProgressCardProps {
  title: string
  current: number
  total: number
  color: "blue" | "green" | "red" | "yellow" | "purple"
  description?: string
}

export function EnhancedProgressCard({ title, current, total, color, description }: EnhancedProgressCardProps) {
  const percentage = Math.round((current / total) * 100)

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {current} / {total}
            </span>
            <span className="text-gray-500">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

interface EnhancedStatusBadgeProps {
  status: string
  variant: "success" | "warning" | "error" | "info"
}

export function EnhancedStatusBadge({ status, variant }: EnhancedStatusBadgeProps) {
  const variantClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  }

  return <Badge className={cn("border", variantClasses[variant])}>{status}</Badge>
}

interface EnhancedActionButtonProps {
  children: React.ReactNode
  variant: "primary" | "secondary" | "success" | "warning" | "danger"
  className?: string
  icon?: any
  onClick?: () => void
}

export function EnhancedActionButton({ children, variant, className, icon: Icon, onClick }: EnhancedActionButtonProps) {
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white",
  }

  return (
    <Button
      className={cn("transition-all duration-200 shadow-md hover:shadow-lg", variantClasses[variant], className)}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </Button>
  )
}
