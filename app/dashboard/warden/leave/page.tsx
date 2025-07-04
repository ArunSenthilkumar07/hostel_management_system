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
import { getAllLeaveApplications } from "@/lib/mock-data"
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
  X,
  AlertTriangle,
} from "lucide-react"

export default function WardenLeavePage() {
  const [leaveApplications, setLeaveApplications] = useState(getAllLeaveApplications())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedLeave, setSelectedLeave] = useState<any>(null)
  const [showLeaveDetails, setShowLeaveDetails] = useState(false)
  const [wardenRemarks, setWardenRemarks] = useState("")

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/warden/leave", active: true },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  const filteredLeaveApplications = leaveApplications.filter((leave) => {
    const matchesSearch =
      leave.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || leave.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const viewLeaveDetails = (leave: any) => {
    setSelectedLeave(leave)
    setShowLeaveDetails(true)
  }

  const updateLeaveStatus = (leaveId: string, newStatus: string, remarks?: string) => {
    setLeaveApplications((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, status: newStatus, wardenRemarks: remarks || leave.wardenRemarks } : leave,
      ),
    )

    toast({
      title: "Leave Status Updated",
      description: `Leave application has been ${newStatus}.`,
    })
  }

  const approveLeave = () => {
    if (!wardenRemarks.trim()) {
      toast({
        title: "Remarks Required",
        description: "Please provide approval remarks.",
        variant: "destructive",
      })
      return
    }

    updateLeaveStatus(selectedLeave.id, "approved", wardenRemarks)
    setShowLeaveDetails(false)
    setWardenRemarks("")
  }

  const rejectLeave = () => {
    if (!wardenRemarks.trim()) {
      toast({
        title: "Remarks Required",
        description: "Please provide rejection reason.",
        variant: "destructive",
      })
      return
    }

    updateLeaveStatus(selectedLeave.id, "rejected", wardenRemarks)
    setShowLeaveDetails(false)
    setWardenRemarks("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "recommended":
        return <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "recommended":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "approved":
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
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-gray-600">Review and approve student leave applications</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold">{leaveApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold">
                    {leaveApplications.filter((l) => l.status === "recommended").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">
                    {leaveApplications.filter((l) => l.status === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <X className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">
                    {leaveApplications.filter((l) => l.status === "rejected").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-applications">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-applications">All Applications</TabsTrigger>
            <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all-applications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Leave Applications</CardTitle>
                <CardDescription>Complete list of student leave applications</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search by student name or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Leave Applications Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Leave Period</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeaveApplications.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{leave.studentName}</p>
                              <p className="text-sm text-gray-500">{leave.studentSin}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">
                                {leave.startDate} to {leave.endDate}
                              </p>
                              <p className="text-xs text-gray-500">
                                {Math.ceil(
                                  (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}{" "}
                                days
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm truncate max-w-xs">{leave.reason}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(leave.status)}
                              {getStatusBadge(leave.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{leave.submittedDate}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => viewLeaveDetails(leave)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {leave.status === "recommended" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedLeave(leave)
                                      setShowLeaveDetails(true)
                                    }}
                                  >
                                    Review
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredLeaveApplications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Leave Applications Found</h3>
                    <p>No leave applications match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending-review" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Review</CardTitle>
                <CardDescription>Leave applications recommended by Joint Warden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveApplications
                    .filter((l) => l.status === "recommended")
                    .map((leave) => (
                      <div key={leave.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <AlertTriangle className="h-5 w-5 text-blue-500" />
                              <h4 className="font-medium">{leave.studentName}</h4>
                              <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                              <span>
                                Period: {leave.startDate} to {leave.endDate}
                              </span>
                              <span>Emergency: {leave.emergencyContact}</span>
                            </div>
                            {leave.jointWardenRemarks && (
                              <div className="p-2 bg-blue-50 rounded text-sm">
                                <p className="font-medium text-blue-800">Joint Warden Remarks:</p>
                                <p className="text-blue-600">{leave.jointWardenRemarks}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => viewLeaveDetails(leave)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedLeave(leave)
                                setShowLeaveDetails(true)
                              }}
                            >
                              Review
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

        {/* Leave Details Dialog */}
        <Dialog open={showLeaveDetails} onOpenChange={setShowLeaveDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Leave Application Review</DialogTitle>
              <DialogDescription>
                {selectedLeave?.id} • Submitted on {selectedLeave?.submittedDate}
              </DialogDescription>
            </DialogHeader>

            {selectedLeave && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedLeave.status)}
                    {getStatusBadge(selectedLeave.status)}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-sm text-gray-600">
                    {selectedLeave.studentName} ({selectedLeave.studentSin})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-gray-600">{selectedLeave.startDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-gray-600">{selectedLeave.endDate}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Reason</p>
                  <p className="text-sm text-gray-600">{selectedLeave.reason}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Emergency Contact</p>
                  <p className="text-sm text-gray-600">{selectedLeave.emergencyContact}</p>
                </div>

                {selectedLeave.jointWardenRemarks && (
                  <div className="space-y-1 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium">Joint Warden Remarks</p>
                    <p className="text-sm text-gray-600">{selectedLeave.jointWardenRemarks}</p>
                  </div>
                )}

                {selectedLeave.wardenRemarks && (
                  <div className="space-y-1 p-3 bg-green-50 rounded-md">
                    <p className="text-sm font-medium">Warden Remarks</p>
                    <p className="text-sm text-gray-600">{selectedLeave.wardenRemarks}</p>
                  </div>
                )}

                {selectedLeave.status === "recommended" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="warden-remarks">Warden Remarks *</Label>
                      <Textarea
                        id="warden-remarks"
                        placeholder="Provide your decision remarks..."
                        value={wardenRemarks}
                        onChange={(e) => setWardenRemarks(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={approveLeave} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Leave
                      </Button>
                      <Button variant="outline" onClick={rejectLeave} className="flex-1">
                        <X className="h-4 w-4 mr-2" />
                        Reject Leave
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
