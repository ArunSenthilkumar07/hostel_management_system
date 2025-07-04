"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedDashboardLayout } from "@/components/enhanced-dashboard-layout"
import {
  EnhancedStatCard,
  EnhancedProgressCard,
  EnhancedStatusBadge,
  EnhancedActionButton,
} from "@/components/enhanced-ui-components"
import { virtualStorage, dataOperations } from "@/lib/virtual-storage"
import {
  Home,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Heart,
  Utensils,
  MessageSquare,
  User,
  Bell,
  BookOpen,
  TrendingUp,
  Users,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<any>(null)
  const [roommates, setRoommates] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [attendanceData, setAttendanceData] = useState<any>({})

  useEffect(() => {
    // Get logged-in student email from localStorage
    const userEmail = localStorage.getItem("userEmail") || "ramesh.kumar@student.shanmugha.edu"

    // Get student data
    const student = dataOperations.getStudentByEmail(userEmail)
    if (student) {
      setStudentData(student)

      // Get roommates
      const studentRoommates = dataOperations.getRoommates(userEmail)
      setRoommates(studentRoommates)
    }

    // Load notifications
    const studentNotifications = dataOperations.getNotificationsForRole("student")
    setNotifications(studentNotifications.slice(0, 5))

    // Load attendance data
    const attendance = virtualStorage.get("attendance")
    setAttendanceData(attendance)

    // Subscribe to real-time updates
    virtualStorage.subscribe("students", (students) => {
      const updatedStudent = students.find((s: any) => s.email === userEmail)
      if (updatedStudent) {
        setStudentData(updatedStudent)
        const updatedRoommates = dataOperations.getRoommates(userEmail)
        setRoommates(updatedRoommates)
      }
    })

    virtualStorage.subscribe("notifications", () => {
      const updatedNotifications = dataOperations.getNotificationsForRole("student")
      setNotifications(updatedNotifications.slice(0, 5))
    })
  }, [])

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student", active: true },
    { icon: Building2, label: "Room Details", href: "/dashboard/student/room" },
    { icon: Clock, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Calendar, label: "Leave Application", href: "/dashboard/student/leave" },
    { icon: DollarSign, label: "Fee Status", href: "/dashboard/student/fees" },
    { icon: Heart, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Utensils, label: "Food Menu", href: "/dashboard/student/food" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Bell, label: "Notifications", href: "/dashboard/student/notifications" },
  ]

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const attendancePercentage = studentData.attendance || 0
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyAttendance = attendanceData[currentMonth] || {}
  const studentAttendance = monthlyAttendance[studentData.id] || { present: 28, total: 30 }

  return (
    <EnhancedDashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {studentData.name}! 👋</h1>
              <p className="text-blue-100 text-lg">
                {studentData.course} • {studentData.hostel} Hostel • {studentData.roomNumber}
              </p>
              <p className="text-blue-200 text-sm mt-1">SIN: {studentData.sin}</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatCard
            title="Attendance"
            value={`${attendancePercentage}%`}
            change={5}
            changeType="increase"
            icon={Clock}
            color="green"
            description="This semester"
          />
          <EnhancedStatCard
            title="Fee Status"
            value={studentData.feeStatus}
            icon={DollarSign}
            color={studentData.feeStatus === "Paid" ? "green" : studentData.feeStatus === "Pending" ? "yellow" : "red"}
            description="Current semester"
          />
          <EnhancedStatCard
            title="Room"
            value={studentData.roomNumber}
            icon={Building2}
            color="blue"
            description={`${studentData.hostel} Hostel`}
          />
          <EnhancedStatCard
            title="Year"
            value={`${studentData.year}${studentData.year === 1 ? "st" : studentData.year === 2 ? "nd" : studentData.year === 3 ? "rd" : "th"} Year`}
            icon={BookOpen}
            color="purple"
            description={studentData.course}
          />
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnhancedProgressCard
            title="Monthly Attendance"
            current={studentAttendance.present}
            total={studentAttendance.total}
            color="green"
            description={`${studentAttendance.present} days present this month`}
          />
          <EnhancedProgressCard
            title="Semester Progress"
            current={6}
            total={6}
            color="blue"
            description="Months completed"
          />
          <EnhancedProgressCard
            title="Course Completion"
            current={studentData.year}
            total={4}
            color="purple"
            description="Years completed"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roommates Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>My Roommates</span>
              </CardTitle>
              <CardDescription>People sharing your room</CardDescription>
            </CardHeader>
            <CardContent>
              {roommates.length > 0 ? (
                <div className="space-y-4">
                  {roommates.map((roommate) => (
                    <div
                      key={roommate.id}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                    >
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                          {roommate.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{roommate.name}</h4>
                        <p className="text-sm text-gray-600">{roommate.course}</p>
                        <p className="text-xs text-gray-500">SIN: {roommate.sin}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">{roommate.attendance}% Attendance</span>
                          </div>
                          <EnhancedStatusBadge
                            status={roommate.feeStatus}
                            variant={
                              roommate.feeStatus === "Paid"
                                ? "success"
                                : roommate.feeStatus === "Pending"
                                  ? "warning"
                                  : "error"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <a
                          href={`tel:${roommate.phone}`}
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${roommate.email}`}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No Roommates</p>
                  <p className="text-sm">You have this room all to yourself!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <EnhancedActionButton
                variant="primary"
                className="w-full justify-start"
                icon={Calendar}
                onClick={() => (window.location.href = "/dashboard/student/leave")}
              >
                Apply for Leave
              </EnhancedActionButton>
              <EnhancedActionButton
                variant="secondary"
                className="w-full justify-start"
                icon={MessageSquare}
                onClick={() => (window.location.href = "/dashboard/student/complaints")}
              >
                Submit Complaint
              </EnhancedActionButton>
              <EnhancedActionButton
                variant="success"
                className="w-full justify-start"
                icon={DollarSign}
                onClick={() => (window.location.href = "/dashboard/student/fees")}
              >
                View Fee Status
              </EnhancedActionButton>
              <EnhancedActionButton
                variant="warning"
                className="w-full justify-start"
                icon={Utensils}
                onClick={() => (window.location.href = "/dashboard/student/food")}
              >
                Food Menu & Feedback
              </EnhancedActionButton>
            </CardContent>
          </Card>
        </div>

        {/* Notifications and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <span>Recent Notifications</span>
              </CardTitle>
              <CardDescription>Stay updated with important announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {notification.type === "complaint" && <MessageSquare className="h-5 w-5 text-red-500" />}
                        {notification.type === "leave" && <Calendar className="h-5 w-5 text-blue-500" />}
                        {notification.type === "fee" && <DollarSign className="h-5 w-5 text-green-500" />}
                        {notification.type === "general" && <Bell className="h-5 w-5 text-gray-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-500" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{studentData.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{studentData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{studentData.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Joined: {new Date(studentData.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Emergency Contact</p>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-600">{studentData.emergencyContact}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EnhancedDashboardLayout>
  )
}
