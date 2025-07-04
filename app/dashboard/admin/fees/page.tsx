"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Download,
  Eye,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllStudents } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function AdminFeeManagementPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState(getAllStudents())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [hostelFilter, setHostelFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentRemarks, setPaymentRemarks] = useState("")

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave" },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees", active: true },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || student.feeStatus === statusFilter
    const matchesHostel = hostelFilter === "all" || student.hostel === hostelFilter
    return matchesSearch && matchesStatus && matchesHostel
  })

  const feeStats = {
    totalStudents: students.length,
    totalCollected: students.reduce((sum, s) => sum + (s.feeStatus === "Paid" ? 45000 : 0), 0),
    totalPending: students.reduce((sum, s) => sum + (s.feeStatus !== "Paid" ? 45000 : 0), 0),
    paid: students.filter((s) => s.feeStatus === "Paid").length,
    pending: students.filter((s) => s.feeStatus === "Pending").length,
    overdue: students.filter((s) => s.feeStatus === "Overdue").length,
  }

  const hostelStats = {
    Engineering: students.filter((s) => s.hostel === "Engineering"),
    Pharmacy: students.filter((s) => s.hostel === "Pharmacy"),
    "Allied Science": students.filter((s) => s.hostel === "Allied Science"),
    Nursing: students.filter((s) => s.hostel === "Nursing"),
  }

  const updateFeeStatus = (
    studentId: string,
    newStatus: string,
    amount?: number,
    method?: string,
    remarks?: string,
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              feeStatus: newStatus,
              lastPaymentDate: newStatus === "Paid" ? new Date().toISOString() : student.lastPaymentDate,
              paymentHistory: [
                ...(student.paymentHistory || []),
                ...(amount
                  ? [
                      {
                        id: Date.now().toString(),
                        amount,
                        method: method || "Cash",
                        date: new Date().toISOString(),
                        remarks: remarks || "",
                        receivedBy: "Admin",
                      },
                    ]
                  : []),
              ],
            }
          : student,
      ),
    )

    toast({
      title: "Fee Status Updated",
      description: `Student fee status updated to ${newStatus}`,
    })
  }

  const exportFeeData = (format: "csv" | "json") => {
    const dataToExport = filteredStudents.map((student) => ({
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      hostel: student.hostel,
      roomNumber: student.roomNumber,
      feeStatus: student.feeStatus,
      lastPaymentDate: student.lastPaymentDate,
      totalFee: 45000,
      amountPaid: student.feeStatus === "Paid" ? 45000 : 0,
      amountPending: student.feeStatus !== "Paid" ? 45000 : 0,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
    }))

    if (format === "csv") {
      const headers = Object.keys(dataToExport[0]).join(",")
      const rows = dataToExport.map((item) => Object.values(item).join(","))
      const csv = [headers, ...rows].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fee-report-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const json = JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          totalStudents: dataToExport.length,
          feeStats,
          students: dataToExport,
        },
        null,
        2,
      )

      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fee-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    toast({
      title: "Export Successful",
      description: `Fee data exported as ${format.toUpperCase()}`,
    })
  }

  const getStatusColor = (status: string) => {
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

  const recordPayment = () => {
    if (!selectedStudent || !paymentAmount) return

    const amount = Number.parseFloat(paymentAmount)
    updateFeeStatus(selectedStudent.id, "Paid", amount, paymentMethod, paymentRemarks)

    setPaymentAmount("")
    setPaymentMethod("")
    setPaymentRemarks("")
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fee Management</h1>
            <p className="text-gray-600">Manage student fees and payments</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => exportFeeData("csv")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => exportFeeData("json")}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Collected</p>
                  <p className="text-2xl font-bold">₹{feeStats.totalCollected.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold">₹{feeStats.totalPending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Students</p>
                  <p className="text-2xl font-bold">{feeStats.paid}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Defaulters</p>
                  <p className="text-2xl font-bold">{feeStats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment Records</TabsTrigger>
            <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={hostelFilter} onValueChange={setHostelFilter}>
                    <SelectTrigger className="w-full md:w-48">
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

            {/* Students Fee Table */}
            <Card>
              <CardHeader>
                <CardTitle>Student Fee Status</CardTitle>
                <CardDescription>
                  Showing {filteredStudents.length} of {students.length} students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Hostel</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Fee Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.rollNumber}</p>
                            </div>
                          </TableCell>
                          <TableCell>{student.hostel}</TableCell>
                          <TableCell>{student.roomNumber}</TableCell>
                          <TableCell>₹45,000</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(student.feeStatus)}>{student.feeStatus}</Badge>
                          </TableCell>
                          <TableCell>
                            {student.lastPaymentDate
                              ? new Date(student.lastPaymentDate).toLocaleDateString()
                              : "No payment"}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedStudent(student)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Manage
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Fee Management - {selectedStudent?.name}</DialogTitle>
                                  <DialogDescription>
                                    Manage fee payments and status for {selectedStudent?.rollNumber}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedStudent && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Student Name</label>
                                        <p>{selectedStudent.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Roll Number</label>
                                        <p>{selectedStudent.rollNumber}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Hostel</label>
                                        <p>{selectedStudent.hostel}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Room</label>
                                        <p>{selectedStudent.roomNumber}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Current Status</label>
                                        <Badge className={getStatusColor(selectedStudent.feeStatus)}>
                                          {selectedStudent.feeStatus}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Total Fee</label>
                                        <p className="text-lg font-semibold">₹45,000</p>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">Guardian Contact</label>
                                      <p>
                                        {selectedStudent.guardianName} - {selectedStudent.guardianPhone}
                                      </p>
                                    </div>

                                    <div className="border-t pt-4">
                                      <h4 className="font-medium mb-3">Record Payment</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium">Amount</label>
                                          <Input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Payment Method</label>
                                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Cash">Cash</SelectItem>
                                              <SelectItem value="Card">Card</SelectItem>
                                              <SelectItem value="UPI">UPI</SelectItem>
                                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                              <SelectItem value="Cheque">Cheque</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <label className="text-sm font-medium">Remarks</label>
                                        <Input
                                          placeholder="Payment remarks (optional)"
                                          value={paymentRemarks}
                                          onChange={(e) => setPaymentRemarks(e.target.value)}
                                        />
                                      </div>
                                      <div className="flex space-x-2 mt-4">
                                        <Button onClick={recordPayment} className="bg-green-600 hover:bg-green-700">
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          Record Payment
                                        </Button>
                                        <Button
                                          onClick={() => updateFeeStatus(selectedStudent.id, "Overdue")}
                                          variant="destructive"
                                        >
                                          Mark Overdue
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest fee payments received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students
                    .filter((s) => s.feeStatus === "Paid")
                    .sort(
                      (a, b) => new Date(b.lastPaymentDate || 0).getTime() - new Date(a.lastPaymentDate || 0).getTime(),
                    )
                    .slice(0, 10)
                    .map((student) => (
                      <div key={student.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.rollNumber} • {student.hostel}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹45,000</p>
                          <p className="text-sm text-gray-600">
                            {student.lastPaymentDate ? new Date(student.lastPaymentDate).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defaulters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Fee Defaulters</span>
                </CardTitle>
                <CardDescription>Students with overdue payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students
                    .filter((s) => s.feeStatus === "Overdue")
                    .map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-3 border border-red-200 rounded bg-red-50"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.rollNumber} • Room {student.roomNumber}
                          </p>
                          <p className="text-sm text-red-600">Guardian: {student.guardianPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">₹45,000</p>
                          <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hostel-wise Collection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(hostelStats).map(([hostel, studentList]) => {
                    const paidCount = studentList.filter((s) => s.feeStatus === "Paid").length
                    const totalAmount = paidCount * 45000
                    return (
                      <div key={hostel} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{hostel}</span>
                          <p className="text-xs text-gray-600">
                            {paidCount}/{studentList.length} paid
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{totalAmount.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">
                            {Math.round((paidCount / studentList.length) * 100)}% collected
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Expected</span>
                    <span className="font-semibold">₹{(students.length * 45000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Amount Collected</span>
                    <span className="font-semibold text-green-600">₹{feeStats.totalCollected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Amount Pending</span>
                    <span className="font-semibold text-red-600">₹{feeStats.totalPending.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Collection Rate</span>
                    <span className="font-semibold">
                      {Math.round((feeStats.totalCollected / (students.length * 45000)) * 100)}%
                    </span>
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
