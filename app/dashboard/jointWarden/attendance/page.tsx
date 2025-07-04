"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Building2,
  MessageSquare,
  Heart,
  FileText,
  Home,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenStudents } from "@/lib/mock-data"
import { toast } from "sonner"

export default function JointWardenAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [bulkAction, setBulkAction] = useState("")

  const students = getJointWardenStudents()

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAttendanceChange = (studentSin: string, isPresent: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentSin]: isPresent,
    }))
  }

  const handleBulkAction = (action: string) => {
    const newAttendance: Record<string, boolean> = {}
    filteredStudents.forEach((student) => {
      newAttendance[student.sin] = action === "present"
    })
    setAttendance(newAttendance)
    toast.success(`Marked all students as ${action}`)
  }

  const handleSaveAttendance = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length
    const totalCount = filteredStudents.length
    toast.success(`Attendance saved for ${selectedDate}: ${presentCount}/${totalCount} present`)
  }

  const handleExportAttendance = (format: string) => {
    const attendanceData = filteredStudents.map((student) => ({
      SIN: student.sin,
      Name: student.name,
      Room: student.roomNo,
      Hostel: student.hostel,
      Date: selectedDate,
      Status: attendance[student.sin] ? "Present" : "Absent",
      "Overall Attendance": `${student.attendance}%`,
    }))

    if (format === "csv") {
      const csvContent = [
        Object.keys(attendanceData[0]).join(","),
        ...attendanceData.map((row) => Object.values(row).join(",")),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance-${selectedDate}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      const jsonContent = JSON.stringify(attendanceData, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance-${selectedDate}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    toast.success(`Attendance exported as ${format.toUpperCase()}`)
  }

  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount = filteredStudents.length - presentCount

  const getAttendanceGrade = (percentage: number) => {
    if (percentage >= 95) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 85) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 75) return { grade: "Average", color: "text-yellow-600" }
    return { grade: "Poor", color: "text-red-600" }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance", active: true },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Attendance Management</h1>
            <p className="text-gray-600">Mark and track attendance for your students</p>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Attendance</DialogTitle>
                  <DialogDescription>Download attendance data for {selectedDate}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => handleExportAttendance("csv")} className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download CSV</span>
                    </Button>
                    <Button
                      onClick={() => handleExportAttendance("json")}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download JSON</span>
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Export includes:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Student details and attendance status</li>
                      <li>Overall attendance percentage</li>
                      <li>Room and hostel information</li>
                      <li>Date and timestamp</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Date Selection and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Select Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{filteredStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold">{presentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold">{absentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkAction("present")}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark All Present</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkAction("absent")}
                  className="flex items-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Mark All Absent</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance - {selectedDate}</CardTitle>
            <CardDescription>Mark attendance for your mentored students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const attendanceGrade = getAttendanceGrade(student.attendance)
                return (
                  <div
                    key={student.sin}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={attendance[student.sin] || false}
                        onCheckedChange={(checked) => handleAttendanceChange(student.sin, checked as boolean)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{student.name}</h4>
                          <Badge variant="secondary">{student.roomNo}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{student.sin}</span>
                          <span>{student.course}</span>
                          <span>{student.hostel} Hostel</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Overall Attendance</p>
                        <p className={`text-sm ${attendanceGrade.color}`}>
                          {student.attendance}% ({attendanceGrade.grade})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Today's Status</p>
                        <Badge
                          className={
                            attendance[student.sin] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {attendance[student.sin] ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            )}

            {filteredStudents.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {presentCount} of {filteredStudents.length} students marked present
                </div>
                <Button onClick={handleSaveAttendance} className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Save Attendance</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>Overall attendance statistics for your students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Excellent (95%+)</h3>
                <p className="text-2xl font-bold text-green-600">{students.filter((s) => s.attendance >= 95).length}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Good (85-94%)</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {students.filter((s) => s.attendance >= 85 && s.attendance < 95).length}
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800">Average (75-84%)</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {students.filter((s) => s.attendance >= 75 && s.attendance < 85).length}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Poor (&lt;75%)</h3>
                <p className="text-2xl font-bold text-red-600">{students.filter((s) => s.attendance < 75).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
