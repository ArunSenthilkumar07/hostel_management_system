"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Home,
  Heart,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenStudents, getAllComplaints, getAllLeaveApplications } from "@/lib/mock-data"

export default function JointWardenDashboard() {
  const mentoredStudents = getJointWardenStudents()
  const complaints = getAllComplaints()
  const leaveApplications = getAllLeaveApplications()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden", active: true },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Joint Warden Dashboard</h1>
          <p className="opacity-90">Mentoring and supporting your assigned students</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Mentored Students</p>
                  <p className="text-2xl font-bold">{mentoredStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Rooms</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Complaints</p>
                  <p className="text-2xl font-bold">{complaints.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Leave Requests</p>
                  <p className="text-2xl font-bold">{leaveApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Students Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>My Students</span>
            </CardTitle>
            <CardDescription>Students under your mentorship (5 rooms)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentoredStudents.slice(0, 6).map((student) => (
                <div key={student.sin} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{student.name}</h4>
                    <Badge variant="secondary">{student.roomNo}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{student.course}</p>
                  <p className="text-sm text-gray-500">{student.hostel}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">Attendance: 95%</span>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending Tasks</span>
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Leave Verification</p>
                    <p className="text-xs text-gray-600">3 applications to verify</p>
                  </div>
                </div>
                <Button size="sm">Review</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Complaint Handling</p>
                    <p className="text-xs text-gray-600">2 complaints from your students</p>
                  </div>
                </div>
                <Button size="sm">Handle</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Attendance Update</p>
                    <p className="text-xs text-gray-600">Mark today's attendance</p>
                  </div>
                </div>
                <Button size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your mentored students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Leave verified</p>
                  <p className="text-xs text-gray-500">Approved leave for Anita Patel</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Health concern</p>
                  <p className="text-xs text-gray-500">Student reported fever - Room 205</p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Attendance marked</p>
                  <p className="text-xs text-gray-500">All students present today</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>My Assigned Rooms</span>
            </CardTitle>
            <CardDescription>Status of rooms under your supervision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Room 201</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Clean
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">2 Students</p>
                <p className="text-xs text-gray-500">AC, 2 Cots</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Room 202</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Clean
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">2 Students</p>
                <p className="text-xs text-gray-500">Non-AC, 2 Cots</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Room 203</h4>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Needs Attention
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">3 Students</p>
                <p className="text-xs text-gray-500">AC, 3 Cots</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Room 204</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Clean
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">2 Students</p>
                <p className="text-xs text-gray-500">Non-AC, 2 Cots</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Room 205</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Clean
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">1 Student</p>
                <p className="text-xs text-gray-500">AC, 2 Cots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tools for student mentorship</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Clock className="h-6 w-6" />
                <span className="text-sm">Mark Attendance</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Verify Leave</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Heart className="h-6 w-6" />
                <span className="text-sm">Health Check</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Send Message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
