"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents, getAllComplaints, getAllLeaveApplications } from "@/lib/mock-data"
import {
  Building2,
  CalendarIcon,
  Clock,
  Download,
  FileText,
  Home,
  MessageSquare,
  TrendingUp,
  Users,
  Utensils,
  BarChart3,
  PieChart,
} from "lucide-react"

export default function WardenReportsPage() {
  const [students] = useState(getAllStudents())
  const [complaints] = useState(getAllComplaints())
  const [leaveApplications] = useState(getAllLeaveApplications())
  const [reportType, setReportType] = useState("student")
  const [dateRange, setDateRange] = useState("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: CalendarIcon, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports", active: true },
  ]

  const generateReport = (type: string, format = "csv") => {
    let data: any[] = []
    let filename = ""

    switch (type) {
      case "student":
        data = [
          ["SIN", "Name", "Email", "Course", "Hostel", "Room", "Phone", "Fee Status", "Attendance", "Join Date"],
          ...students.map((student) => [
            student.sin,
            student.name,
            student.email,
            student.course,
            student.hostel,
            student.roomNo,
            student.phone,
            student.feeStatus,
            `${student.attendance}%`,
            student.joinDate,
          ]),
        ]
        filename = `student-report-${format(new Date(), "yyyy-MM-dd")}`
        break

      case "attendance":
        data = [
          ["SIN", "Name", "Hostel", "Room", "Attendance %", "Status"],
          ...students.map((student) => [
            student.sin,
            student.name,
            student.hostel,
            student.roomNo,
            `${student.attendance}%`,
            student.attendance >= 75 ? "Good" : "Poor",
          ]),
        ]
        filename = `attendance-report-${format(new Date(), "yyyy-MM-dd")}`
        break

      case "complaints":
        data = [
          ["ID", "Student Name", "SIN", "Title", "Category", "Priority", "Status", "Date", "Assigned To"],
          ...complaints.map((complaint) => [
            complaint.id,
            complaint.studentName,
            complaint.studentSin,
            complaint.title,
            complaint.category,
            complaint.priority,
            complaint.status,
            complaint.submittedDate,
            complaint.assignedTo || "Unassigned",
          ]),
        ]
        filename = `complaints-report-${format(new Date(), "yyyy-MM-dd")}`
        break

      case "leave":
        data = [
          ["ID", "Student Name", "SIN", "Reason", "Start Date", "End Date", "Status", "Submitted Date"],
          ...leaveApplications.map((leave) => [
            leave.id,
            leave.studentName,
            leave.studentSin,
            leave.reason,
            leave.startDate,
            leave.endDate,
            leave.status,
            leave.submittedDate,
          ]),
        ]
        filename = `leave-report-${format(new Date(), "yyyy-MM-dd")}`
        break

      case "hostel-summary":
        const hostelStats = students.reduce((acc, student) => {
          if (!acc[student.hostel]) {
            acc[student.hostel] = { total: 0, paid: 0, pending: 0, overdue: 0, avgAttendance: 0 }
          }
          acc[student.hostel].total++
          if (student.feeStatus === "Paid") acc[student.hostel].paid++
          else if (student.feeStatus === "Pending") acc[student.hostel].pending++
          else acc[student.hostel].overdue++
          acc[student.hostel].avgAttendance += student.attendance
          return acc
        }, {} as any)

        Object.keys(hostelStats).forEach((hostel) => {
          hostelStats[hostel].avgAttendance = Math.round(hostelStats[hostel].avgAttendance / hostelStats[hostel].total)
        })

        data = [
          ["Hostel", "Total Students", "Fee Paid", "Fee Pending", "Fee Overdue", "Avg Attendance"],
          ...Object.entries(hostelStats).map(([hostel, stats]: [string, any]) => [
            hostel,
            stats.total,
            stats.paid,
            stats.pending,
            stats.overdue,
            `${stats.avgAttendance}%`,
          ]),
        ]
        filename = `hostel-summary-${format(new Date(), "yyyy-MM-dd")}`
        break

      default:
        return
    }

    if (format === "csv") {
      const csvContent = data.map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    toast({
      title: "Report Generated",
      description: `${type} report has been downloaded successfully.`,
    })
  }

  const getReportStats = () => {
    return {
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.feeStatus === "Paid").length,
      lowAttendance: students.filter((s) => s.attendance < 75).length,
      pendingComplaints: complaints.filter((c) => c.status === "pending").length,
      pendingLeaves: leaveApplications.filter((l) => l.status === "pending").length,
      avgAttendance: Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length),
    }
  }

  const stats = getReportStats()

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and view analytics</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Students</p>
                  <p className="text-xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Active Students</p>
                  <p className="text-xl font-bold">{stats.activeStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Low Attendance</p>
                  <p className="text-xl font-bold">{stats.lowAttendance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Pending Complaints</p>
                  <p className="text-xl font-bold">{stats.pendingComplaints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Pending Leaves</p>
                  <p className="text-xl font-bold">{stats.pendingLeaves}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-indigo-500" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Avg Attendance</p>
                  <p className="text-xl font-bold">{stats.avgAttendance}%</p>
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
                <span>Generate Reports</span>
              </CardTitle>
              <CardDescription>Download detailed reports in CSV or JSON format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student Report</SelectItem>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="complaints">Complaints Report</SelectItem>
                      <SelectItem value="leave">Leave Report</SelectItem>
                      <SelectItem value="hostel-summary">Hostel Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="custom">Custom Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {dateRange === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={() => generateReport(reportType, "csv")} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
                <Button onClick={() => generateReport(reportType, "json")} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Quick Reports</span>
              </CardTitle>
              <CardDescription>Pre-configured reports for common needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Student Directory</h4>
                  <p className="text-sm text-gray-600">Complete student information</p>
                </div>
                <Button size="sm" onClick={() => generateReport("student")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Attendance Summary</h4>
                  <p className="text-sm text-gray-600">Student attendance records</p>
                </div>
                <Button size="sm" onClick={() => generateReport("attendance")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Complaints Log</h4>
                  <p className="text-sm text-gray-600">All complaints and their status</p>
                </div>
                <Button size="sm" onClick={() => generateReport("complaints")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Leave Applications</h4>
                  <p className="text-sm text-gray-600">Student leave requests</p>
                </div>
                <Button size="sm" onClick={() => generateReport("leave")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Hostel Summary</h4>
                  <p className="text-sm text-gray-600">Overview by hostel blocks</p>
                </div>
                <Button size="sm" onClick={() => generateReport("hostel-summary")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Distribution</CardTitle>
              <CardDescription>Students by hostel blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Engineering", "Pharmacy", "Allied Science", "Nursing"].map((hostel) => {
                  const count = students.filter((s) => s.hostel === hostel).length
                  const percentage = Math.round((count / students.length) * 100)
                  return (
                    <div key={hostel} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{hostel}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Status</CardTitle>
              <CardDescription>Payment status overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Paid", "Pending", "Overdue"].map((status) => {
                  const count = students.filter((s) => s.feeStatus === status).length
                  const percentage = Math.round((count / students.length) * 100)
                  const color =
                    status === "Paid" ? "bg-green-500" : status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Grades</CardTitle>
              <CardDescription>Attendance performance distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Excellent (90%+)", min: 90, color: "bg-green-500" },
                  { label: "Good (75-89%)", min: 75, max: 89, color: "bg-blue-500" },
                  { label: "Average (60-74%)", min: 60, max: 74, color: "bg-yellow-500" },
                  { label: "Poor (<60%)", max: 59, color: "bg-red-500" },
                ].map((grade) => {
                  const count = students.filter((s) => {
                    if (grade.min && grade.max) return s.attendance >= grade.min && s.attendance <= grade.max
                    if (grade.min) return s.attendance >= grade.min
                    if (grade.max) return s.attendance <= grade.max
                    return false
                  }).length
                  const percentage = Math.round((count / students.length) * 100)
                  return (
                    <div key={grade.label} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{grade.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className={`${grade.color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
