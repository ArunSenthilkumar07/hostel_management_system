"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import {
  FileText,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Search,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllComplaints, getAllStudents } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function AdminComplaintsPage() {
  const { toast } = useToast()
  const [complaints, setComplaints] = useState(getAllComplaints())
  const [students] = useState(getAllStudents())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [adminResponse, setAdminResponse] = useState("")

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints", active: true },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave" },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
  ]

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
  }

  const categoryStats = {
    room: complaints.filter((c) => c.category === "room").length,
    food: complaints.filter((c) => c.category === "food").length,
    maintenance: complaints.filter((c) => c.category === "maintenance").length,
    security: complaints.filter((c) => c.category === "security").length,
    other: complaints.filter((c) => c.category === "other").length,
  }

  const updateComplaintStatus = (complaintId: string, newStatus: string, response?: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status: newStatus,
              adminResponse: response || complaint.adminResponse,
              resolvedAt: newStatus === "resolved" ? new Date().toISOString() : complaint.resolvedAt,
            }
          : complaint,
      ),
    )

    toast({
      title: "Status Updated",
      description: `Complaint status updated to ${newStatus}`,
    })
  }

  const exportComplaints = (format: "csv" | "json") => {
    const dataToExport = filteredComplaints.map((complaint) => ({
      id: complaint.id,
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      studentName: complaint.studentName,
      studentId: complaint.studentId,
      roomNumber: complaint.roomNumber,
      description: complaint.description,
      submittedAt: complaint.submittedAt,
      resolvedAt: complaint.resolvedAt,
      adminResponse: complaint.adminResponse,
    }))

    if (format === "csv") {
      const headers = Object.keys(dataToExport[0]).join(",")
      const rows = dataToExport.map((item) => Object.values(item).join(","))
      const csv = [headers, ...rows].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `complaints-report-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const json = JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          totalComplaints: dataToExport.length,
          complaints: dataToExport,
        },
        null,
        2,
      )

      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `complaints-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    toast({
      title: "Export Successful",
      description: `Complaints data exported as ${format.toUpperCase()}`,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Complaints Management</h1>
            <p className="text-gray-600">Manage and resolve student complaints</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => exportComplaints("csv")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => exportComplaints("json")}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold">{complaintStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{complaintStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">{complaintStats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">{complaintStats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">{complaintStats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search complaints..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{complaint.studentName}</p>
                          <p className="text-sm text-gray-600">Room {complaint.roomNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{complaint.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {complaint.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(complaint.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(complaint)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Complaint Details</DialogTitle>
                              <DialogDescription>
                                Review and manage complaint #{selectedComplaint?.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedComplaint && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Student</label>
                                    <p>{selectedComplaint.studentName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Room</label>
                                    <p>{selectedComplaint.roomNumber}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <Badge variant="outline" className="capitalize">
                                      {selectedComplaint.category}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <Badge className={getPriorityColor(selectedComplaint.priority)}>
                                      {selectedComplaint.priority}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Title</label>
                                  <p>{selectedComplaint.title}</p>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm text-gray-600">{selectedComplaint.description}</p>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Admin Response</label>
                                  <Textarea
                                    placeholder="Enter your response..."
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>

                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => {
                                      updateComplaintStatus(selectedComplaint.id, "in-progress", adminResponse)
                                      setAdminResponse("")
                                    }}
                                    variant="outline"
                                  >
                                    Mark In Progress
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      updateComplaintStatus(selectedComplaint.id, "resolved", adminResponse)
                                      setAdminResponse("")
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Resolve
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      updateComplaintStatus(selectedComplaint.id, "rejected", adminResponse)
                                      setAdminResponse("")
                                    }}
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
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

        {/* Category Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <Badge variant="secondary">{count} complaints</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complaints
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                .slice(0, 5)
                .map((complaint) => (
                  <div key={complaint.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{complaint.title}</p>
                      <p className="text-xs text-gray-600">by {complaint.studentName}</p>
                    </div>
                    <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
