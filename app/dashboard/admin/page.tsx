"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents, getAllComplaints, getAllLeaveApplications } from "@/lib/mock-data"

export default function AdminDashboard() {
  const students = getAllStudents()
  const complaints = getAllComplaints()
  const leaveApplications = getAllLeaveApplications()

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin", active: true },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
    { icon: Clock, label: "Leave Management", href: "/dashboard/admin/leave" },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
  ]

  const downloadReport = (type: string) => {
    // Mock report generation
    const data = {
      students: students.length,
      complaints: complaints.length,
      leaves: leaveApplications.length,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="opacity-90">System overview and management controls</p>
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
                <Building2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                  <p className="text-2xl font-bold">120</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Complaints</p>
                  <p className="text-2xl font-bold">{complaints.filter((c) => c.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
                  <p className="text-2xl font-bold">{leaveApplications.filter((l) => l.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hostel Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Occupancy</CardTitle>
              <CardDescription>Current occupancy across all hostels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Engineering</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">140/150</span>
                  <Badge variant="secondary">93%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pharmacy</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">75/80</span>
                  <Badge variant="secondary">94%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Allied Science</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">55/60</span>
                  <Badge variant="secondary">92%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nursing</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">42/45</span>
                  <Badge variant="secondary">93%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New student registered</p>
                  <p className="text-xs text-gray-500">Priya Sharma - Engineering</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Complaint escalated</p>
                  <p className="text-xs text-gray-500">Room maintenance issue - Room 205</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Leave application pending</p>
                  <p className="text-xs text-gray-500">5 applications awaiting approval</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate Reports</span>
            </CardTitle>
            <CardDescription>Download comprehensive reports for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => downloadReport("student")}>
                <Users className="h-6 w-6" />
                <span className="text-sm">Student Report</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => downloadReport("occupancy")}>
                <Building2 className="h-6 w-6" />
                <span className="text-sm">Occupancy Report</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => downloadReport("complaints")}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">Complaints Report</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => downloadReport("financial")}>
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Financial Report</span>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Low attendance alert</p>
                  <p className="text-xs text-gray-600">3 students with attendance below 75%</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Fee defaulters</p>
                  <p className="text-xs text-gray-600">2 students with pending fee payments</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
