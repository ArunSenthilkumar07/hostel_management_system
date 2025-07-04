"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents } from "@/lib/mock-data"
import {
  Building2,
  Calendar,
  Clock,
  Download,
  FileText,
  Home,
  MessageSquare,
  Search,
  Users,
  Utensils,
  Eye,
  Edit,
  UserPlus,
} from "lucide-react"

export default function WardenStudentsPage() {
  const [students] = useState(getAllStudents())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students", active: true },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHostel = filterHostel === "all" || student.hostel === filterHostel
    const matchesStatus = filterStatus === "all" || student.feeStatus === filterStatus

    return matchesSearch && matchesHostel && matchesStatus
  })

  const viewStudentDetails = (student: any) => {
    setSelectedStudent(student)
    setShowStudentDetails(true)
  }

  const exportStudentData = () => {
    const csvData = [
      ["SIN", "Name", "Email", "Course", "Hostel", "Room", "Phone", "Fee Status", "Attendance"],
      ...filteredStudents.map((student) => [
        student.sin,
        student.name,
        student.email,
        student.course,
        student.hostel,
        student.roomNo,
        student.phone,
        student.feeStatus,
        `${student.attendance}%`,
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `students-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Student data has been exported to CSV file.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAttendanceBadge = (attendance: number) => {
    if (attendance >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (attendance >= 75) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-gray-600">Manage and monitor all hostel students</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={exportStudentData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Register a new student to the hostel</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-name">Full Name</Label>
                      <Input id="student-name" placeholder="Enter student name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-sin">SIN Number</Label>
                      <Input id="student-sin" placeholder="SIN230XXX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input id="student-email" type="email" placeholder="student@shanmugha.edu" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-course">Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                          <SelectItem value="B.Tech Electronics">B.Tech Electronics</SelectItem>
                          <SelectItem value="B.Pharm">B.Pharm</SelectItem>
                          <SelectItem value="B.Sc Nursing">B.Sc Nursing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-hostel">Hostel</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="Allied Science">Allied Science</SelectItem>
                          <SelectItem value="Nursing">Nursing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">Add Student</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <Building2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.feeStatus === "Paid").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Attendance</p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.attendance < 75).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Pending</p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.feeStatus !== "Paid").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>Search and filter students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by name, SIN, or email..."
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by fee status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Students Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Details</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Hostel & Room</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.sin}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.sin}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{student.course}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.hostel}</p>
                          <p className="text-sm text-gray-500">{student.roomNo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{student.attendance}%</span>
                          {getAttendanceBadge(student.attendance)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.feeStatus)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => viewStudentDetails(student)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-medium mb-1">No Students Found</h3>
                <p>No students match your current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Details Dialog */}
        <Dialog open={showStudentDetails} onOpenChange={setShowStudentDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>Complete information about the student</DialogDescription>
            </DialogHeader>

            {selectedStudent && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">SIN Number</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.sin}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Course</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.course}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date of Birth</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.dob}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Hostel</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.hostel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Room Number</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.roomNo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Emergency Contact</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.emergencyContact}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Join Date</Label>
                    <p className="text-sm text-gray-600">{selectedStudent.joinDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Attendance</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedStudent.attendance}%</span>
                      {getAttendanceBadge(selectedStudent.attendance)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fee Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedStudent.feeStatus)}</div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
