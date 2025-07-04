"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Users, Building2, DollarSign, TrendingUp, Calendar, AlertTriangle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents, getAllComplaints, getAllLeaveApplications } from "@/lib/mock-data"

export default function AdminReportsPage() {
  const students = getAllStudents()
  const complaints = getAllComplaints()
  const leaveApplications = getAllLeaveApplications()

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports", active: true },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave" },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
  ]

  const generateReport = (type: string, data: any) => {
    const timestamp = new Date().toISOString()
    const reportData = {
      type,
      generatedAt: timestamp,
      data,
      summary: {
        totalRecords: Array.isArray(data) ? data.length : Object.keys(data).length,
        generatedBy: "Admin",
        institution: "Sri Shanmugha Educational Institutions",
      },
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateCSVReport = (type: string, data: any[]) => {
    if (!data.length) return

    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((item) => Object.values(item).join(","))
    const csv = [headers, ...rows].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const hostelStats = {
    Engineering: students.filter((s) => s.hostel === "Engineering").length,
    Pharmacy: students.filter((s) => s.hostel === "Pharmacy").length,
    "Allied Science": students.filter((s) => s.hostel === "Allied Science").length,
    Nursing: students.filter((s) => s.hostel === "Nursing").length,
  }

  const feeStats = {
    paid: students.filter((s) => s.feeStatus === "Paid").length,
    pending: students.filter((s) => s.feeStatus === "Pending").length,
    overdue: students.filter((s) => s.feeStatus === "Overdue").length,
  }

  const attendanceStats = {
    excellent: students.filter((s) => s.attendance >= 95).length,
    good: students.filter((s) => s.attendance >= 85 && s.attendance < 95).length,
    average: students.filter((s) => s.attendance >= 75 && s.attendance < 85).length,
    poor: students.filter((s) => s.attendance < 75).length,
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and download comprehensive reports</p>
          </div>
        </div>

        {/* Quick Stats */}
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
                <FileText className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold">{complaints.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Leave Applications</p>
                  <p className="text-2xl font-bold">{leaveApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Defaulters</p>
                  <p className="text-2xl font-bold">{feeStats.overdue + feeStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Generation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Student Reports</span>
              </CardTitle>
              <CardDescription>Generate comprehensive student data reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Complete Student Database</h4>
                  <p className="text-sm text-gray-600">All student information and details</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => generateReport("students", students)}>
                    JSON
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateCSVReport("students", students)}>
                    CSV
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Hostel-wise Distribution</h4>
                  <p className="text-sm text-gray-600">Student count by hostel blocks</p>
                </div>
                <Button size="sm" onClick={() => generateReport("hostel-distribution", hostelStats)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Attendance Report</h4>
                  <p className="text-sm text-gray-600">Student attendance statistics</p>
                </div>
                <Button size="sm" onClick={() => generateReport("attendance", attendanceStats)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Operational Reports</span>
              </CardTitle>
              <CardDescription>Complaints, leave applications, and operational data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Complaints Report</h4>
                  <p className="text-sm text-gray-600">All complaints and their status</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => generateReport("complaints", complaints)}>
                    JSON
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateCSVReport("complaints", complaints)}>
                    CSV
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Leave Applications</h4>
                  <p className="text-sm text-gray-600">All leave requests and approvals</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => generateReport("leave-applications", leaveApplications)}>
                    JSON
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateCSVReport("leave-applications", leaveApplications)}
                  >
                    CSV
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Fee Status Report</h4>
                  <p className="text-sm text-gray-600">Payment status and defaulters</p>
                </div>
                <Button size="sm" onClick={() => generateReport("fee-status", feeStats)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Occupancy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(hostelStats).map(([hostel, count]) => (
                <div key={hostel} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{hostel}</span>
                  <Badge variant="secondary">{count} students</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Paid</span>
                <Badge className="bg-green-100 text-green-800">{feeStats.paid}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending</span>
                <Badge className="bg-yellow-100 text-yellow-800">{feeStats.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overdue</span>
                <Badge className="bg-red-100 text-red-800">{feeStats.overdue}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Excellent (95%+)</span>
                <Badge className="bg-green-100 text-green-800">{attendanceStats.excellent}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Good (85-94%)</span>
                <Badge className="bg-blue-100 text-blue-800">{attendanceStats.good}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average (75-84%)</span>
                <Badge className="bg-yellow-100 text-yellow-800">{attendanceStats.average}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Poor (&lt;75%)</span>
                <Badge className="bg-red-100 text-red-800">{attendanceStats.poor}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceStats.poor > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Low Attendance Alert</p>
                    <p className="text-xs text-gray-600">{attendanceStats.poor} students with attendance below 75%</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    generateReport(
                      "low-attendance",
                      students.filter((s) => s.attendance < 75),
                    )
                  }
                >
                  Generate Report
                </Button>
              </div>
            )}

            {feeStats.overdue > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Fee Defaulters</p>
                    <p className="text-xs text-gray-600">{feeStats.overdue} students with overdue payments</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    generateReport(
                      "fee-defaulters",
                      students.filter((s) => s.feeStatus === "Overdue"),
                    )
                  }
                >
                  Generate Report
                </Button>
              </div>
            )}

            {complaints.filter((c) => c.status === "pending").length > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Pending Complaints</p>
                    <p className="text-xs text-gray-600">
                      {complaints.filter((c) => c.status === "pending").length} complaints awaiting resolution
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    generateReport(
                      "pending-complaints",
                      complaints.filter((c) => c.status === "pending"),
                    )
                  }
                >
                  Generate Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
