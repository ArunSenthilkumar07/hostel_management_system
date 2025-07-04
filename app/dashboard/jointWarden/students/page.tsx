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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Search,
  Filter,
  Eye,
  Calendar,
  GraduationCap,
  Home,
  MessageSquare,
  Clock,
  Heart,
  FileText,
  Building2,
  Download,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenStudents } from "@/lib/mock-data"
import { toast } from "sonner"

export default function JointWardenStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const students = getJointWardenStudents()

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHostel = filterHostel === "all" || student.hostel === filterHostel
    return matchesSearch && matchesHostel
  })

  const handleExportStudents = () => {
    const csvContent = [
      ["SIN", "Name", "Course", "Hostel", "Room", "Phone", "Attendance", "Fee Status"].join(","),
      ...filteredStudents.map((student) =>
        [
          student.sin,
          student.name,
          student.course,
          student.hostel,
          student.roomNo,
          student.phone,
          `${student.attendance}%`,
          student.feeStatus,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `my-students-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Student data exported successfully!")
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students", active: true },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-green-600"
    if (attendance >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Students</h1>
            <p className="text-gray-600">Manage and monitor your mentored students</p>
          </div>
          <Button onClick={handleExportStudents} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Students</span>
          </Button>
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
                <Clock className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Good Attendance</p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.attendance >= 90).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fee Pending</p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.feeStatus !== "Paid").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rooms Managed</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, SIN, or room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterHostel} onValueChange={setFilterHostel}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
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
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.sin} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <Badge variant="secondary">{student.roomNo}</Badge>
                </div>
                <CardDescription>{student.sin}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span>{student.course}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{student.hostel} Hostel</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className={getAttendanceColor(student.attendance)}>{student.attendance}% Attendance</span>
                  </div>
                  <Badge className={getFeeStatusColor(student.feeStatus)}>{student.feeStatus}</Badge>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                        <DialogDescription>Complete information for {selectedStudent?.name}</DialogDescription>
                      </DialogHeader>
                      {selectedStudent && (
                        <div className="space-y-4">
                          <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="personal">Personal</TabsTrigger>
                              <TabsTrigger value="academic">Academic</TabsTrigger>
                              <TabsTrigger value="hostel">Hostel</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                                  <p className="text-sm">{selectedStudent.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                  <p className="text-sm">{selectedStudent.dob}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Gender</label>
                                  <p className="text-sm">{selectedStudent.gender}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Phone</label>
                                  <p className="text-sm">{selectedStudent.phone}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-600">Email</label>
                                  <p className="text-sm">{selectedStudent.email}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                                  <p className="text-sm">{selectedStudent.emergencyContact}</p>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="academic" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Student ID</label>
                                  <p className="text-sm">{selectedStudent.sin}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Course</label>
                                  <p className="text-sm">{selectedStudent.course}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                                  <p className="text-sm">{selectedStudent.joinDate}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Attendance</label>
                                  <p className={`text-sm ${getAttendanceColor(selectedStudent.attendance)}`}>
                                    {selectedStudent.attendance}%
                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="hostel" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Hostel</label>
                                  <p className="text-sm">{selectedStudent.hostel}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Room Number</label>
                                  <p className="text-sm">{selectedStudent.roomNo}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Fee Status</label>
                                  <Badge className={getFeeStatusColor(selectedStudent.feeStatus)}>
                                    {selectedStudent.feeStatus}
                                  </Badge>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
