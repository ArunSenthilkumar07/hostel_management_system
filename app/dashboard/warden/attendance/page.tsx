"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents } from "@/lib/mock-data"
import {
  Building2,
  CalendarIcon,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Search,
  Users,
  Utensils,
  Download,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react"

export default function WardenAttendancePage() {
  const [students] = useState(getAllStudents())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("all")
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({})

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: CalendarIcon, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance", active: true },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHostel = filterHostel === "all" || student.hostel === filterHostel

    return matchesSearch && matchesHostel
  })

  const markAttendance = (studentSin: string, isPresent: boolean) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentSin]: isPresent,
    }))
  }

  const saveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(selectedDate, "PPP")} has been saved successfully.`,
    })
  }

  const downloadAttendanceReport = () => {
    const reportData = [
      ["Date", "SIN", "Name", "Hostel", "Room", "Status"],
      ...filteredStudents.map((student) => [
        format(selectedDate, "yyyy-MM-dd"),
        student.sin,
        student.name,
        student.hostel,
        student.roomNo,
        attendanceData[student.sin] ? "Present" : "Absent",
      ]),
    ]

    const csvContent = reportData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-${format(selectedDate, "yyyy-MM-dd")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: "Attendance report has been downloaded successfully.",
    })
  }

  const downloadMonthlyReport = () => {
    const monthlyData = [
      ["SIN", "Name", "Hostel", "Room", "Total Days", "Present Days", "Attendance %"],
      ...students.map((student) => {
        const totalDays = 30
        const presentDays = Math.floor((student.attendance / 100) * totalDays)
        return [
          student.sin,
          student.name,
          student.hostel,
          student.roomNo,
          totalDays.toString(),
          presentDays.toString(),
          `${student.attendance}%`,
        ]
      }),
    ]

    const csvContent = monthlyData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `monthly-attendance-${format(new Date(), "yyyy-MM")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Monthly Report Downloaded",
      description: "Monthly attendance report has been downloaded successfully.",
    })
  }

  const getAttendanceBadge = (attendance: number) => {
    if (attendance >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (attendance >= 75) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (attendance >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const presentCount = Object.values(attendanceData).filter(Boolean).length
  const absentCount = filteredStudents.length - presentCount

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-gray-600">Track and manage student attendance</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={downloadMonthlyReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Monthly Report
            </Button>
            <Button onClick={downloadAttendanceReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Daily Report
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold">{presentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <X className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent Today</p>
                  <p className="text-2xl font-bold">{absentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Attendance</p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.attendance < 75).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily-attendance">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily-attendance">Daily Attendance</TabsTrigger>
            <TabsTrigger value="attendance-overview">Attendance Overview</TabsTrigger>
            <TabsTrigger value="attendance-reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="daily-attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance</CardTitle>
                <CardDescription>Mark attendance for students</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Date Selection and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Date:</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-48 justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Select value={filterHostel} onValueChange={setFilterHostel}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hostels</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Allied Science">Allied Science</SelectItem>
                      <SelectItem value="Nursing">Nursing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Attendance Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Hostel & Room</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Overall Attendance</TableHead>
                        <TableHead>Today's Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.sin}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.sin}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{student.hostel}</p>
                              <p className="text-sm text-gray-500">{student.roomNo}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{student.course}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{student.attendance}%</span>
                              {getAttendanceBadge(student.attendance)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant={attendanceData[student.sin] === true ? "default" : "outline"}
                                onClick={() => markAttendance(student.sin, true)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={attendanceData[student.sin] === false ? "destructive" : "outline"}
                                onClick={() => markAttendance(student.sin, false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Absent
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Present: {presentCount} | Absent: {absentCount} | Total: {filteredStudents.length}
                  </div>
                  <Button onClick={saveAttendance}>Save Attendance</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance-overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Overall attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.sin} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-600">
                            {student.sin} • {student.hostel} • {student.roomNo}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold">{student.attendance}%</p>
                            <p className="text-sm text-gray-500">Overall</p>
                          </div>
                          {getAttendanceBadge(student.attendance)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance-reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Reports</CardTitle>
                  <CardDescription>Download daily attendance reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Today's Attendance</h4>
                      <p className="text-sm text-gray-600">Complete attendance for {format(new Date(), "PPP")}</p>
                    </div>
                    <Button onClick={downloadAttendanceReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Custom Date Report</h4>
                      <p className="text-sm text-gray-600">Select a specific date for attendance report</p>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Select Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Reports</CardTitle>
                  <CardDescription>Download comprehensive monthly reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Current Month Report</h4>
                      <p className="text-sm text-gray-600">
                        Complete attendance summary for {format(new Date(), "MMMM yyyy")}
                      </p>
                    </div>
                    <Button onClick={downloadMonthlyReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Low Attendance Report</h4>
                      <p className="text-sm text-gray-600">Students with attendance below 75%</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Hostel-wise Report</h4>
                      <p className="text-sm text-gray-600">Attendance breakdown by hostel</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
