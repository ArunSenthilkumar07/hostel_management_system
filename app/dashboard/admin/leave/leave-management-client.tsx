"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Calendar, Search, Download, Eye, Check, X, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { approveLeaveAction, rejectLeaveAction, exportLeaveDataAction } from "./actions"
import { useVirtualStorage } from "@/lib/virtual-storage"

export default function LeaveManagementClient({ initialStats }: { initialStats: any }) {
  const leaveApplications = useVirtualStorage("leaveApplications")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedLeave, setSelectedLeave] = useState<any>(null)
  const [adminRemarks, setAdminRemarks] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stats, setStats] = useState(initialStats)

  useEffect(() => {
    // Update stats when leave applications change
    setStats({
      total: leaveApplications.length,
      pending: leaveApplications.filter((l: any) => l.status === "pending").length,
      approved: leaveApplications.filter((l: any) => l.status === "approved").length,
      rejected: leaveApplications.filter((l: any) => l.status === "rejected").length,
      recommended: leaveApplications.filter((l: any) => l.status === "recommended").length,

      // Type statistics
      medical: leaveApplications.filter((l: any) => l.type === "medical").length,
      personal: leaveApplications.filter((l: any) => l.type === "personal").length,
      emergency: leaveApplications.filter((l: any) => l.type === "emergency").length,
      academic: leaveApplications.filter((l: any) => l.type === "academic").length,

      // Recent applications (last 5)
      recent: leaveApplications
        .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5),
    })
  }, [leaveApplications])

  const filteredApplications = leaveApplications.filter((application: any) => {
    const matchesSearch =
      application.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    const matchesType = typeFilter === "all" || application.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleApproveLeave = async () => {
    if (!adminRemarks.trim()) {
      toast.error("Please provide remarks for approval")
      return
    }

    const result = await approveLeaveAction(selectedLeave.id, adminRemarks)

    if (result.success) {
      toast.success(result.message)
      setIsDialogOpen(false)
      setAdminRemarks("")
    } else {
      toast.error(result.message)
    }
  }

  const handleRejectLeave = async () => {
    if (!adminRemarks.trim()) {
      toast.error("Please provide remarks for rejection")
      return
    }

    const result = await rejectLeaveAction(selectedLeave.id, adminRemarks)

    if (result.success) {
      toast.success(result.message)
      setIsDialogOpen(false)
      setAdminRemarks("")
    } else {
      toast.error(result.message)
    }
  }

  const handleExportData = async (format: "csv" | "json") => {
    const result = await exportLeaveDataAction(format, statusFilter)

    if (result.success) {
      // Create and download file
      let content: string
      let mimeType: string
      let fileName: string

      if (format === "csv") {
        // Convert to CSV
        const headers = Object.keys(result.data[0]).join(",")
        const rows = result.data.map((item: any) => Object.values(item).join(","))
        content = [headers, ...rows].join("\n")
        mimeType = "text/csv"
        fileName = `leave-applications-${new Date().toISOString().split("T")[0]}.csv`
      } else {
        // JSON format
        content = JSON.stringify(result.data, null, 2)
        mimeType = "application/json"
        fileName = `leave-applications-${new Date().toISOString().split("T")[0]}.json`
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Leave data exported as ${format.toUpperCase()}`)
    } else {
      toast.error(result.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "recommended":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medical":
        return "bg-red-100 text-red-800"
      case "emergency":
        return "bg-orange-100 text-orange-800"
      case "personal":
        return "bg-blue-100 text-blue-800"
      case "academic":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-gray-600">Review and manage student leave applications</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleExportData("csv")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleExportData("json")}>
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
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold">{stats.pending}</p>
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
                <p className="text-2xl font-bold">{stats.approved}</p>
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
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Recommended</p>
                <p className="text-2xl font-bold">{stats.recommended}</p>
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
                  placeholder="Search applications..."
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
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leave Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
          <CardDescription>
            Showing {filteredApplications.length} of {leaveApplications.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application: any) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {application.studentId} • Room {application.roomNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(application.type)}>{application.type}</Badge>
                    </TableCell>
                    <TableCell>{calculateDuration(application.startDate, application.endDate)} days</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(application.startDate).toLocaleDateString()}</p>
                        <p className="text-gray-600">to {new Date(application.endDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(application.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLeave(application)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">No Leave Applications Found</h3>
              <p>No leave applications match your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries({
              medical: stats.medical || 0,
              emergency: stats.emergency || 0,
              personal: stats.personal || 0,
              academic: stats.academic || 0,
            }).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{type}</span>
                <Badge variant="secondary">{count} applications</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recent &&
              stats.recent.map((application: any) => (
                <div key={application.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{application.studentName}</p>
                    <p className="text-xs text-gray-600">{application.type} leave</p>
                  </div>
                  <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                </div>
              ))}

            {(!stats.recent || stats.recent.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <p>No recent applications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leave Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Leave Application Review</DialogTitle>
            <DialogDescription>Review application from {selectedLeave?.studentName}</DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Student</label>
                  <p>{selectedLeave.studentName}</p>
                  <p className="text-sm text-gray-600">{selectedLeave.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Room</label>
                  <p>{selectedLeave.roomNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Badge className={getTypeColor(selectedLeave.type)}>{selectedLeave.type}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p>{calculateDuration(selectedLeave.startDate, selectedLeave.endDate)} days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <p>{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <p>{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Reason</label>
                <p className="text-sm text-gray-600">{selectedLeave.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Emergency Contact</label>
                  <p className="text-sm">{selectedLeave.emergencyContact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Parent Contact</label>
                  <p className="text-sm">{selectedLeave.parentContact}</p>
                </div>
              </div>

              {selectedLeave.jointWardenRemarks && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <label className="text-sm font-medium text-blue-800">Joint Warden Remarks</label>
                  <p className="text-sm text-blue-600">{selectedLeave.jointWardenRemarks}</p>
                </div>
              )}

              {selectedLeave.wardenRemarks && (
                <div className="p-3 bg-green-50 rounded-md">
                  <label className="text-sm font-medium text-green-800">Warden Remarks</label>
                  <p className="text-sm text-green-600">{selectedLeave.wardenRemarks}</p>
                </div>
              )}

              {selectedLeave.adminRemarks && (
                <div className="p-3 bg-purple-50 rounded-md">
                  <label className="text-sm font-medium text-purple-800">Previous Admin Remarks</label>
                  <p className="text-sm text-purple-600">{selectedLeave.adminRemarks}</p>
                </div>
              )}

              {(selectedLeave.status === "pending" || selectedLeave.status === "recommended") && (
                <div>
                  <label className="text-sm font-medium">Admin Remarks</label>
                  <Textarea
                    placeholder="Enter your remarks..."
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              {(selectedLeave.status === "pending" || selectedLeave.status === "recommended") && (
                <div className="flex space-x-2">
                  <Button onClick={handleApproveLeave} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button onClick={handleRejectLeave} variant="destructive">
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
