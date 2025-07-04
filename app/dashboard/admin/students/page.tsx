"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Users,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Building2,
  DollarSign,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents, type Student } from "@/lib/mock-data"

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(getAllStudents())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students", active: true },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave" },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHostel = filterHostel === "all" || student.hostel === filterHostel
    const matchesStatus = filterStatus === "all" || student.feeStatus.toLowerCase() === filterStatus
    return matchesSearch && matchesHostel && matchesStatus
  })

  const downloadStudentData = (format: "csv" | "json") => {
    const data = filteredStudents
    const timestamp = new Date().toISOString().split("T")[0]

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `students-${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const headers = [
        "Name",
        "Roll Number",
        "Email",
        "Phone",
        "Hostel",
        "Room",
        "Course",
        "Year",
        "Fee Status",
        "Attendance",
      ]
      const csvData = data.map((student) => [
        student.name,
        student.rollNumber,
        student.email,
        student.phone,
        student.hostel,
        student.roomNumber,
        student.course,
        student.year,
        student.feeStatus,
        student.attendance,
      ])
      const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `students-${timestamp}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    toast({ title: "Success", description: `Student data exported as ${format.toUpperCase()}` })
  }

  const handleAddStudent = (formData: FormData) => {
    const newStudent: Student = {
      id: `STU${Date.now()}`,
      name: formData.get("name") as string,
      rollNumber: formData.get("rollNumber") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      hostel: formData.get("hostel") as string,
      roomNumber: formData.get("roomNumber") as string,
      course: formData.get("course") as string,
      year: Number.parseInt(formData.get("year") as string),
      feeStatus: formData.get("feeStatus") as "Paid" | "Pending" | "Overdue",
      attendance: 100,
      joinDate: new Date().toISOString().split("T")[0],
      guardianName: formData.get("guardianName") as string,
      guardianPhone: formData.get("guardianPhone") as string,
      address: formData.get("address") as string,
    }
    setStudents([...students, newStudent])
    setIsAddDialogOpen(false)
    toast({ title: "Success", description: "Student added successfully" })
  }

  const handleEditStudent = (formData: FormData) => {
    if (!selectedStudent) return
    const updatedStudent = {
      ...selectedStudent,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      hostel: formData.get("hostel") as string,
      roomNumber: formData.get("roomNumber") as string,
      course: formData.get("course") as string,
      year: Number.parseInt(formData.get("year") as string),
      feeStatus: formData.get("feeStatus") as "Paid" | "Pending" | "Overdue",
      guardianName: formData.get("guardianName") as string,
      guardianPhone: formData.get("guardianPhone") as string,
      address: formData.get("address") as string,
    }
    setStudents(students.map((s) => (s.id === selectedStudent.id ? updatedStudent : s)))
    setIsEditDialogOpen(false)
    setSelectedStudent(null)
    toast({ title: "Success", description: "Student updated successfully" })
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((s) => s.id !== studentId))
    toast({ title: "Success", description: "Student deleted successfully" })
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
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const stats = {
    total: students.length,
    paid: students.filter((s) => s.feeStatus === "Paid").length,
    pending: students.filter((s) => s.feeStatus === "Pending").length,
    overdue: students.filter((s) => s.feeStatus === "Overdue").length,
    lowAttendance: students.filter((s) => s.attendance < 75).length,
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-gray-600">Manage all students across hostels</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => downloadStudentData("csv")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => downloadStudentData("json")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter student details to add them to the system</DialogDescription>
                </DialogHeader>
                <form action={handleAddStudent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input id="rollNumber" name="rollNumber" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" required />
                    </div>
                    <div>
                      <Label htmlFor="hostel">Hostel</Label>
                      <Select name="hostel" required>
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
                    <div>
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input id="roomNumber" name="roomNumber" required />
                    </div>
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input id="course" name="course" required />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Select name="year" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="feeStatus">Fee Status</Label>
                      <Select name="feeStatus" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input id="guardianName" name="guardianName" required />
                    </div>
                    <div>
                      <Label htmlFor="guardianPhone">Guardian Phone</Label>
                      <Input id="guardianPhone" name="guardianPhone" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" required />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Student</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Paid</p>
                  <p className="text-2xl font-bold">{stats.paid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Overdue</p>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
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
                  <p className="text-2xl font-bold">{stats.lowAttendance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, roll number, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterHostel} onValueChange={setFilterHostel}>
                  <SelectTrigger className="w-40">
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
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>Manage student information and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Hostel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.hostel}</TableCell>
                      <TableCell>{student.roomNumber}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>{getStatusBadge(student.feeStatus)}</TableCell>
                      <TableCell>
                        <Badge variant={student.attendance >= 75 ? "default" : "destructive"}>
                          {student.attendance}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedStudent(student)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedStudent(student)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteStudent(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Student Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>Complete information about the student</DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-sm">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Roll Number</Label>
                    <p className="text-sm">{selectedStudent.rollNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-sm">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Hostel</Label>
                    <p className="text-sm">{selectedStudent.hostel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Room</Label>
                    <p className="text-sm">{selectedStudent.roomNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Course</Label>
                    <p className="text-sm">{selectedStudent.course}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Year</Label>
                    <p className="text-sm">{selectedStudent.year}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Fee Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedStudent.feeStatus)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Attendance</Label>
                    <p className="text-sm">{selectedStudent.attendance}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Guardian Name</Label>
                    <p className="text-sm">{selectedStudent.guardianName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Guardian Phone</Label>
                    <p className="text-sm">{selectedStudent.guardianPhone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Address</Label>
                  <p className="text-sm">{selectedStudent.address}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>Update student information</DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <form action={handleEditStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input id="edit-name" name="name" defaultValue={selectedStudent.name} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" name="email" type="email" defaultValue={selectedStudent.email} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" name="phone" defaultValue={selectedStudent.phone} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-hostel">Hostel</Label>
                    <Select name="hostel" defaultValue={selectedStudent.hostel} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Allied Science">Allied Science</SelectItem>
                        <SelectItem value="Nursing">Nursing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-roomNumber">Room Number</Label>
                    <Input id="edit-roomNumber" name="roomNumber" defaultValue={selectedStudent.roomNumber} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-course">Course</Label>
                    <Input id="edit-course" name="course" defaultValue={selectedStudent.course} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-year">Year</Label>
                    <Select name="year" defaultValue={selectedStudent.year.toString()} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-feeStatus">Fee Status</Label>
                    <Select name="feeStatus" defaultValue={selectedStudent.feeStatus} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-guardianName">Guardian Name</Label>
                    <Input
                      id="edit-guardianName"
                      name="guardianName"
                      defaultValue={selectedStudent.guardianName}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-guardianPhone">Guardian Phone</Label>
                    <Input
                      id="edit-guardianPhone"
                      name="guardianPhone"
                      defaultValue={selectedStudent.guardianPhone}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea id="edit-address" name="address" defaultValue={selectedStudent.address} required />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Student</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
