"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  MessageSquare,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  Heart,
  FileText,
  Home,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenComplaints } from "@/lib/mock-data"
import { toast } from "sonner"

export default function JointWardenComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [response, setResponse] = useState("")
  const [newStatus, setNewStatus] = useState("")

  const complaints = getJointWardenComplaints()

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || complaint.category === filterCategory
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority
    return matchesSearch && matchesCategory && matchesPriority
  })

  const handleUpdateComplaint = (complaintId: string, status: string) => {
    toast.success(`Complaint ${complaintId} updated to ${status}`)
    setResponse("")
    setNewStatus("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <AlertTriangle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints", active: true },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  const pendingComplaints = filteredComplaints.filter((c) => c.status === "pending")
  const inProgressComplaints = filteredComplaints.filter((c) => c.status === "in-progress")
  const resolvedComplaints = filteredComplaints.filter((c) => c.status === "resolved")

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Complaints Management</h1>
          <p className="text-gray-600">Handle complaints from your mentored students</p>
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
                  <p className="text-2xl font-bold">{pendingComplaints.length}</p>
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
                  <p className="text-2xl font-bold">{inProgressComplaints.length}</p>
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
                  <p className="text-2xl font-bold">{resolvedComplaints.length}</p>
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
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingComplaints.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressComplaints.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedComplaints.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingComplaints.length > 0 ? (
              <div className="grid gap-4">
                {pendingComplaints.map((complaint) => (
                  <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>By: {complaint.studentName}</span>
                            <span>ID: {complaint.id}</span>
                            <span>Date: {complaint.submittedDate}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Complaint</DialogTitle>
                                <DialogDescription>
                                  Handle complaint from {selectedComplaint?.studentName}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedComplaint && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Complaint ID</label>
                                      <p className="text-sm">{selectedComplaint.id}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Student</label>
                                      <p className="text-sm">{selectedComplaint.studentName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Category</label>
                                      <p className="text-sm">{selectedComplaint.category}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Priority</label>
                                      <Badge className={getPriorityColor(selectedComplaint.priority)}>
                                        {selectedComplaint.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Description</label>
                                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                                      {selectedComplaint.description}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Update Status</label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="in-progress">Mark as In Progress</SelectItem>
                                        <SelectItem value="resolved">Mark as Resolved</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Response/Notes</label>
                                    <Textarea
                                      placeholder="Add your response or resolution notes..."
                                      value={response}
                                      onChange={(e) => setResponse(e.target.value)}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => handleUpdateComplaint(selectedComplaint.id, newStatus)}
                                    disabled={!newStatus}
                                    className="w-full"
                                  >
                                    Update Complaint
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" onClick={() => handleUpdateComplaint(complaint.id, "in-progress")}>
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending complaints</h3>
                  <p className="text-gray-600">All complaints from your students have been addressed.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressComplaints.length > 0 ? (
              <div className="grid gap-4">
                {inProgressComplaints.map((complaint) => (
                  <Card key={complaint.id} className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <Badge className={getStatusColor(complaint.status)}>
                              {getStatusIcon(complaint.status)}
                              <span className="ml-1">In Progress</span>
                            </Badge>
                            <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>By: {complaint.studentName}</span>
                            <span>ID: {complaint.id}</span>
                            <span>Date: {complaint.submittedDate}</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleUpdateComplaint(complaint.id, "resolved")}>
                          Mark Resolved
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints in progress</h3>
                  <p className="text-gray-600">No complaints are currently being worked on.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedComplaints.length > 0 ? (
              <div className="grid gap-4">
                {resolvedComplaints.map((complaint) => (
                  <Card key={complaint.id} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <Badge className={getStatusColor(complaint.status)}>
                              {getStatusIcon(complaint.status)}
                              <span className="ml-1">Resolved</span>
                            </Badge>
                            <Badge variant="outline">{complaint.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>By: {complaint.studentName}</span>
                            <span>ID: {complaint.id}</span>
                            <span>Resolved: {complaint.submittedDate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resolved complaints</h3>
                  <p className="text-gray-600">No complaints have been resolved yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
