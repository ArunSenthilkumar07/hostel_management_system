"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Check, Clock, Home, Info, User, Users, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData, getLeaveApplicationsByStudent } from "@/lib/mock-data"

export default function LeavePage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [leaveApplications, setLeaveApplications] = useState<any[]>([])
  const [selectedLeave, setSelectedLeave] = useState<any>(null)
  const [showLeaveDetails, setShowLeaveDetails] = useState(false)

  // Form state
  const [reason, setReason] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [emergencyContact, setEmergencyContact] = useState("")
  const [address, setAddress] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)

      if (data) {
        const leaves = getLeaveApplicationsByStudent(data.sin)
        setLeaveApplications(leaves)
        setEmergencyContact(data.emergencyContact)
      }
    }
  }, [])

  const handleSubmitLeave = () => {
    if (!reason || !startDate || !endDate || !emergencyContact || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (startDate > endDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date cannot be before start date.",
        variant: "destructive",
      })
      return
    }

    // Create a new leave application
    const newLeave = {
      id: `LEAVE${Math.floor(Math.random() * 1000)}`,
      studentSin: studentData.sin,
      studentName: studentData.name,
      reason,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      emergencyContact,
      status: "pending",
      submittedDate: format(new Date(), "yyyy-MM-dd"),
    }

    // Add to the list (in a real app, this would be an API call)
    setLeaveApplications([newLeave, ...leaveApplications])

    toast({
      title: "Leave Application Submitted",
      description: "Your leave application has been submitted successfully.",
    })

    // Reset form
    setReason("")
    setStartDate(undefined)
    setEndDate(undefined)
    setAddress("")
  }

  const viewLeaveDetails = (leave: any) => {
    setSelectedLeave(leave)
    setShowLeaveDetails(true)
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

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Clock, label: "Leave Applications", href: "/dashboard/student/leave", active: true },
    { icon: Users, label: "Fee Management", href: "/dashboard/student/fees" },
    { icon: Users, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Users, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Users, label: "Food Menu", href: "/dashboard/student/food" },
    { icon: Users, label: "Notifications", href: "/dashboard/student/notifications" },
  ]

  if (!studentData) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Leave Applications</h1>
          <p className="text-gray-600">Apply for leave and view your application history</p>
        </div>

        <Tabs defaultValue="apply">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
            <TabsTrigger value="history">Leave History</TabsTrigger>
          </TabsList>

          <TabsContent value="apply" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>New Leave Application</CardTitle>
                <CardDescription>Fill in the details to request a leave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Leave *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain the reason for your leave request..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-contact">Emergency Contact Number *</Label>
                    <Input
                      id="emergency-contact"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address During Leave *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your address during the leave period..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSubmitLeave} className="w-full">
                      Submit Leave Application
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Leave Application Process</CardTitle>
                <CardDescription>Understanding the leave approval workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Student Submission</h4>
                      <p className="text-sm text-gray-600">
                        Student submits leave application with reason, dates, and contact details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Joint Warden Verification</h4>
                      <p className="text-sm text-gray-600">
                        Joint Warden reviews and recommends the application to the Warden
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Warden Approval</h4>
                      <p className="text-sm text-gray-600">
                        Warden makes the final decision to approve or reject the leave request
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Notification</h4>
                      <p className="text-sm text-gray-600">
                        Student receives notification about the leave application status
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Application History</CardTitle>
                <CardDescription>View all your previous leave applications</CardDescription>
              </CardHeader>
              <CardContent>
                {leaveApplications.length > 0 ? (
                  <div className="space-y-4">
                    {leaveApplications.map((leave) => (
                      <div
                        key={leave.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewLeaveDetails(leave)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{leave.reason}</h4>
                            <p className="text-sm text-gray-600">
                              {leave.startDate} to {leave.endDate}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Submitted on {leave.submittedDate}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(leave.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                viewLeaveDetails(leave)
                              }}
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Leave Applications</h3>
                    <p>You haven't submitted any leave applications yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Leave Details Dialog */}
        <Dialog open={showLeaveDetails} onOpenChange={setShowLeaveDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Application Details</DialogTitle>
              <DialogDescription>Submitted on {selectedLeave?.submittedDate}</DialogDescription>
            </DialogHeader>

            {selectedLeave && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  {getStatusBadge(selectedLeave.status)}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Reason for Leave</p>
                  <p className="text-sm text-gray-600">{selectedLeave.reason}</p>
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

                <div className="pt-2">
                  <div className="flex items-center space-x-2">
                    {selectedLeave.status === "approved" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : selectedLeave.status === "rejected" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}

                    <span className="text-sm">
                      {selectedLeave.status === "approved"
                        ? "Your leave has been approved"
                        : selectedLeave.status === "rejected"
                          ? "Your leave has been rejected"
                          : selectedLeave.status === "recommended"
                            ? "Your leave has been recommended by Joint Warden and is awaiting Warden approval"
                            : "Your leave is pending review by Joint Warden"}
                    </span>
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
