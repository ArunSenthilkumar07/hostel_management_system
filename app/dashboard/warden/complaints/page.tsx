"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllComplaints } from "@/lib/mock-data"
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Search,
  Users,
  Utensils,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react"

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState(getAllComplaints())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [showComplaintDetails, setShowComplaintDetails] = useState(false)
  const [resolution, setResolution] = useState("")

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints", active: true },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || complaint.category === filterCategory
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const viewComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
    setShowComplaintDetails(true)
  }

  const updateComplaintStatus = (complaintId: string, newStatus: string) => {
    setComplaints((prev) =>
      prev.map((complaint) => (complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint)),
    )

    toast({
      title: "Status Updated",
      description: `Complaint status has been updated to ${newStatus}.`,
    })
  }

  const resolveComplaint = () => {
    if (!resolution.trim()) {
      toast({
        title: "Resolution Required",
        description: "Please provide a resolution note.",
        variant: "destructive",
      })
      return
    }

    updateComplaintStatus(selectedComplaint.id, "resolved")
    setShowComplaintDetails(false)
    setResolution("")

    toast({
      title: "Complaint Resolved",
      description: "The complaint has been marked as resolved.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
      case "Low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Complaints Management</h1>
            <p className="text-gray-600">Review and resolve student complaints</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-blue-500" />
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
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{complaints.filter((c) => c.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">{complaints.filter((c) => c.status === "in-progress").length}</p>
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
                  <p className="text-2xl font-bold">{complaints.filter((c) => c.status === "resolved").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-complaints">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-complaints">All Complaints</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all-complaints" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>Complete list of student complaints</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Complaints Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Complaint Details</TableHead>
                        <TableHead>Student</TableHead>
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
                          <TableCell>
                            <div>
                              <p className="font-medium">{complaint.title}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{complaint.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{complaint.studentName}</p>
                            <p className="text-sm text-gray-500">{complaint.studentSin}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </TableCell>
                          <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(complaint.status)}
                              {getStatusBadge(complaint.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{complaint.submittedDate}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => viewComplaintDetails(complaint)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {complaint.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateComplaintStatus(complaint.id, "in-progress")}
                                >
                                  Start
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredComplaints.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Complaints Found</h3>
                    <p>No complaints match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar content for other tabs with filtered data */}
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Complaints</CardTitle>
                <CardDescription>Complaints awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints
                    .filter((c) => c.status === "pending")
                    .map((complaint) => (
                      <div key={complaint.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Clock className="h-5 w-5 text-yellow-500" />
                              <h4 className="font-medium">{complaint.title}</h4>
                              {getPriorityBadge(complaint.priority)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Student: {complaint.studentName}</span>
                              <span>Category: {complaint.category}</span>
                              <span>Date: {complaint.submittedDate}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => viewComplaintDetails(complaint)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" onClick={() => updateComplaintStatus(complaint.id, "in-progress")}>
                              Start Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Complaint Details Dialog */}
        <Dialog open={showComplaintDetails} onOpenChange={setShowComplaintDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Complaint Details</DialogTitle>
              <DialogDescription>
                {selectedComplaint?.id} • Submitted on {selectedComplaint?.submittedDate}
              </DialogDescription>
            </DialogHeader>

            {selectedComplaint && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedComplaint.status)}
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Priority</span>
                  {getPriorityBadge(selectedComplaint.priority)}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-sm text-gray-600">
                    {selectedComplaint.studentName} ({selectedComplaint.studentSin})
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-sm text-gray-600">{selectedComplaint.title}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-gray-600">{selectedComplaint.category}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-gray-600">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.assignedTo && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-gray-600">{selectedComplaint.assignedTo}</p>
                  </div>
                )}

                {selectedComplaint.status !== "resolved" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="resolution">Resolution Notes</Label>
                      <Textarea
                        id="resolution"
                        placeholder="Provide resolution details..."
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      {selectedComplaint.status === "pending" && (
                        <Button
                          variant="outline"
                          onClick={() => updateComplaintStatus(selectedComplaint.id, "in-progress")}
                        >
                          Start Review
                        </Button>
                      )}
                      <Button onClick={resolveComplaint}>Mark as Resolved</Button>
                      <Button variant="outline" onClick={() => updateComplaintStatus(selectedComplaint.id, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
