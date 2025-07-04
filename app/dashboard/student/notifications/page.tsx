"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData } from "@/lib/mock-data"
import {
  Bell,
  CheckCircle,
  Home,
  Info,
  MessageSquare,
  User,
  Users,
  AlertTriangle,
  CreditCard,
  Utensils,
  Clock,
} from "lucide-react"

// Mock notifications data
const notifications = [
  {
    id: "NOT001",
    title: "Leave Application Approved",
    message: "Your leave application for June 15-17 has been approved by the Warden.",
    type: "success",
    category: "Leave",
    timestamp: "2024-06-04T10:30:00Z",
    read: false,
    icon: CheckCircle,
  },
  {
    id: "NOT002",
    title: "Fee Payment Reminder",
    message: "Your semester fee payment is due in 5 days. Please make the payment to avoid late fees.",
    type: "warning",
    category: "Fees",
    timestamp: "2024-06-03T14:15:00Z",
    read: false,
    icon: CreditCard,
  },
  {
    id: "NOT003",
    title: "Room Inspection Scheduled",
    message: "Room inspection is scheduled for tomorrow at 2:00 PM. Please ensure your room is clean.",
    type: "info",
    category: "Room",
    timestamp: "2024-06-03T09:00:00Z",
    read: true,
    icon: Home,
  },
  {
    id: "NOT004",
    title: "Menu Update",
    message: "Special dinner menu for this weekend. Check the food section for details.",
    type: "info",
    category: "Food",
    timestamp: "2024-06-02T16:45:00Z",
    read: true,
    icon: Utensils,
  },
  {
    id: "NOT005",
    title: "Attendance Alert",
    message: "Your attendance has dropped below 90%. Please maintain regular attendance.",
    type: "warning",
    category: "Attendance",
    timestamp: "2024-06-01T11:20:00Z",
    read: true,
    icon: AlertTriangle,
  },
  {
    id: "NOT006",
    title: "Complaint Resolved",
    message: "Your complaint about WiFi connectivity has been resolved. Please check and confirm.",
    type: "success",
    category: "Complaints",
    timestamp: "2024-05-31T13:30:00Z",
    read: true,
    icon: CheckCircle,
  },
  {
    id: "NOT007",
    title: "Health Checkup Reminder",
    message: "Annual health checkup is due. Please visit the health center to schedule an appointment.",
    type: "info",
    category: "Health",
    timestamp: "2024-05-30T08:00:00Z",
    read: true,
    icon: Info,
  },
]

export default function NotificationsPage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [notificationList, setNotificationList] = useState(notifications)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)
    }
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All Notifications Marked as Read",
      description: "All your notifications have been marked as read.",
    })
  }

  const deleteNotification = (notificationId: string) => {
    setNotificationList((prev) => prev.filter((notification) => notification.id !== notificationId))
    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted.",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      case "info":
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "warning":
        return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "info":
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }

  const filteredNotifications = notificationList.filter((notification) => {
    if (selectedCategory === "all") return true
    if (selectedCategory === "unread") return !notification.read
    return notification.category.toLowerCase() === selectedCategory.toLowerCase()
  })

  const unreadCount = notificationList.filter((n) => !n.read).length

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
    { icon: Users, label: "Fee Management", href: "/dashboard/student/fees" },
    { icon: Users, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Users, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Users, label: "Food Menu", href: "/dashboard/student/food" },
    { icon: Bell, label: "Notifications", href: "/dashboard/student/notifications", active: true },
  ]

  if (!studentData) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-600">
              Stay updated with important announcements and updates
              {unreadCount > 0 && <Badge className="ml-2 bg-red-100 text-red-800">{unreadCount} unread</Badge>}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{notificationList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Read</p>
                  <p className="text-2xl font-bold">{notificationList.length - unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold">
                    {
                      notificationList.filter((n) => {
                        const today = new Date().toDateString()
                        const notificationDate = new Date(n.timestamp).toDateString()
                        return today === notificationDate
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setSelectedCategory("unread")}>
              Unread
            </TabsTrigger>
            <TabsTrigger value="leave" onClick={() => setSelectedCategory("leave")}>
              Leave
            </TabsTrigger>
            <TabsTrigger value="fees" onClick={() => setSelectedCategory("fees")}>
              Fees
            </TabsTrigger>
            <TabsTrigger value="complaints" onClick={() => setSelectedCategory("complaints")}>
              Complaints
            </TabsTrigger>
            <TabsTrigger value="other" onClick={() => setSelectedCategory("other")}>
              Other
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>Complete list of your notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => {
                      const IconComponent = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg ${getTypeColor(notification.type)} ${
                            !notification.read ? "border-l-4" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <IconComponent className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{notification.title}</h4>
                                  {!notification.read && (
                                    <Badge variant="outline" className="text-xs">
                                      New
                                    </Badge>
                                  )}
                                  {getTypeBadge(notification.type)}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Category: {notification.category}</span>
                                  <span>{formatTimestamp(notification.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  Mark as Read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Notifications</h3>
                    <p>
                      {selectedCategory === "unread"
                        ? "You have no unread notifications."
                        : "You don't have any notifications in this category."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents would be similar, filtered by category */}
          <TabsContent value="unread" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>Notifications that require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => {
                      const IconComponent = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg ${getTypeColor(notification.type)} border-l-4`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <IconComponent className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{notification.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    New
                                  </Badge>
                                  {getTypeBadge(notification.type)}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Category: {notification.category}</span>
                                  <span>{formatTimestamp(notification.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs"
                              >
                                Mark as Read
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">All Caught Up!</h3>
                    <p>You have no unread notifications.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Leave Applications</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fee Reminders</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Complaint Updates</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">General Announcements</span>
                    <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">SMS Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Alerts</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Reminders</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Leave Status Updates</span>
                    <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Attendance Alerts</span>
                    <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button variant="outline">Update Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
