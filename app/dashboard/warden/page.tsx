"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Utensils,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents, getAllComplaints, getAllLeaveApplications } from "@/lib/mock-data"

export default function WardenDashboard() {
  const students = getAllStudents()
  const complaints = getAllComplaints()
  const leaveApplications = getAllLeaveApplications()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden", active: true },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Warden Dashboard</h1>
          <p className="opacity-90">Manage hostel operations and student welfare</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{students.length}</p>
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
                  <p className="text-2xl font-bold">{complaints.filter((c) => c.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Leave Requests</p>
                  <p className="text-2xl font-bold">
                    {leaveApplications.filter((l) => l.status === "recommended").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Room Issues</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending Actions</span>
              </CardTitle>
              <CardDescription>Items requiring your immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Complaint Resolution</p>
                    <p className="text-xs text-gray-600">3 complaints awaiting approval</p>
                  </div>
                </div>
                <Button size="sm">Review</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Leave Applications</p>
                    <p className="text-xs text-gray-600">2 applications for final approval</p>
                  </div>
                </div>
                <Button size="sm">Review</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Room Maintenance</p>
                    <p className="text-xs text-gray-600">Urgent repairs needed in 2 rooms</p>
                  </div>
                </div>
                <Button size="sm">Assign</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your hostel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Room inspection completed</p>
                  <p className="text-xs text-gray-500">All rooms in Block A passed inspection</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New complaint received</p>
                  <p className="text-xs text-gray-500">WiFi connectivity issue - Room 301</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Leave approved</p>
                  <p className="text-xs text-gray-500">Medical leave for Rahul Kumar</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <CardDescription>Current student statistics by hostel block</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg">Engineering</h3>
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-lg">Pharmacy</h3>
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-lg">Allied Science</h3>
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <h3 className="font-semibold text-lg">Nursing</h3>
                <p className="text-2xl font-bold text-pink-600">5</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Add Student</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Building2 className="h-6 w-6" />
                <span className="text-sm">Room Allocation</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Send Notice</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
