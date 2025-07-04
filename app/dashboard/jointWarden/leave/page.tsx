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
  Calendar,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  MessageSquare,
  Heart,
  FileText,
  Home,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenLeaveApplications } from "@/lib/mock-data"
import { toast } from "sonner"

export default function JointWardenLeavePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [remarks, setRemarks] = useState("")
  const [decision, setDecision] = useState("")

  const leaveApplications = getJointWardenLeaveApplications()

  const filteredApplications = leaveApplications.filter((application) => {
    const matchesSearch =
      application.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleVerifyLeave = (applicationId: string, status: string, remarks: string) => {
    toast.success(`Leave application ${applicationId} ${status} successfully`)
    setRemarks("")
    setDecision("")
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "recommended":
        return <CheckCircle className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave", active: true },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  const pendingApplications = filteredApplications.filter((app) => app.status === "pending")
  const recommendedApplications = filteredApplications.filter((app) => app.status === "recommended")
  const processedApplications = filteredApplications.filter((app) => ["approved", "rejected"].includes(app.status))

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Leave Verification</h1>
          <p className="text-gray-600">Review and verify leave applications from your students</p>
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
                  <p className="text-2xl font-bold">{pendingApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Recommended</p>
                  <p className="text-2xl font-bold">{recommendedApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Processed</p>
                  <p className="text-2xl font-bold">{processedApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name, reason, or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leave Applications Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Review ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="recommended">Recommended ({recommendedApplications.length})</TabsTrigger>
            <TabsTrigger value="processed">Processed ({processedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length > 0 ? (
              <div className="grid gap-4">
                {pendingApplications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{application.studentName}</h3>
                            <Badge className={getStatusColor(application.status)}>
                              {getStatusIcon(application.status)}
                              <span className="ml-1 capitalize">{application.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Reason:</strong> {application.reason}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <strong>From:</strong> {application.startDate}
                            </div>
                            <div>
                              <strong>To:</strong> {application.endDate}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Application ID: {application.id}</span>
                            <span>Submitted: {application.submittedDate}</span>
                            <span>Emergency Contact: {application.emergencyContact}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Leave Application</DialogTitle>
                                <DialogDescription>
                                  Verify leave application from {selectedApplication?.studentName}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Application ID</label>
                                      <p className="text-sm">{selectedApplication.id}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Student</label>
                                      <p className="text-sm">{selectedApplication.studentName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">From Date</label>
                                      <p className="text-sm">{selectedApplication.startDate}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">To Date</label>
                                      <p className="text-sm">{selectedApplication.endDate}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                                      <p className="text-sm">{selectedApplication.emergencyContact}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Reason for Leave</label>
                                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                                      {selectedApplication.reason}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Decision</label>
                                    <Select value={decision} onValueChange={setDecision}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select your decision" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="recommended">Recommend for Approval</SelectItem>
                                        <SelectItem value="rejected">Reject Application</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Remarks (Required)</label>
                                    <Textarea
                                      placeholder="Add your remarks and recommendation..."
                                      value={remarks}
                                      onChange={(e) => setRemarks(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <Button
                                    onClick={() => handleVerifyLeave(selectedApplication.id, decision, remarks)}
                                    disabled={!decision || !remarks.trim()}
                                    className="w-full"
                                  >
                                    Submit Decision
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application)
                              setDecision("recommended")
                            }}
                          >
                            Quick Recommend
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
                  <p className="text-gray-600">All leave applications have been reviewed.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4">
            {recommendedApplications.length > 0 ? (
              <div className="grid gap-4">
                {recommendedApplications.map((application) => (
                  <Card key={application.id} className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{application.studentName}</h3>
                            <Badge className={getStatusColor(application.status)}>
                              {getStatusIcon(application.status)}
                              <span className="ml-1">Recommended</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Reason:</strong> {application.reason}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <strong>From:</strong> {application.startDate}
                            </div>
                            <div>
                              <strong>To:</strong> {application.endDate}
                            </div>
                          </div>
                          {application.jointWardenRemarks && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Your Remarks:</strong> {application.jointWardenRemarks}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                            <span>Waiting for Warden approval</span>
                            <span>Recommended on: {application.submittedDate}</span>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recommended applications</h3>
                  <p className="text-gray-600">No applications are currently recommended for approval.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            {processedApplications.length > 0 ? (
              <div className="grid gap-4">
                {processedApplications.map((application) => (
                  <Card
                    key={application.id}
                    className={application.status === "approved" ? "border-green-200" : "border-red-200"}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{application.studentName}</h3>
                            <Badge className={getStatusColor(application.status)}>
                              {getStatusIcon(application.status)}
                              <span className="ml-1 capitalize">{application.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Reason:</strong> {application.reason}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <strong>From:</strong> {application.startDate}
                            </div>
                            <div>
                              <strong>To:</strong> {application.endDate}
                            </div>
                          </div>
                          {application.jointWardenRemarks && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Your Remarks:</strong> {application.jointWardenRemarks}
                              </p>
                            </div>
                          )}
                          {application.wardenRemarks && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-800">
                                <strong>Warden Remarks:</strong> {application.wardenRemarks}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No processed applications</h3>
                  <p className="text-gray-600">No applications have been finally processed yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
