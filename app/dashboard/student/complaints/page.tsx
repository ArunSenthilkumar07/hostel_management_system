"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData, getComplaintsByStudent } from "@/lib/mock-data"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Plus,
  User,
  Users,
  X,
  Info,
} from "lucide-react"

export default function ComplaintsPage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [complaints, setComplaints] = useState<any[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [showComplaintDetails, setShowComplaintDetails] = useState(false)
  const [showNewComplaint, setShowNewComplaint] = useState(false)

  // Form state for new complaint
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [description, setDescription] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)

      if (data) {
        const studentComplaints = getComplaintsByStudent(data.sin)
        setComplaints(studentComplaints)
      }
    }
  }, [])

  const handleSubmitComplaint = () => {
    if (!title || !category || !priority || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newComplaint = {
      id: `COMP${Math.floor(Math.random() * 1000)}`,
      studentSin: studentData.sin,
      studentName: studentData.name,
      title,
      description,
      category,
      priority,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      assignedTo: "Joint Warden",
    }

    setComplaints([newComplaint, ...complaints])

    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted successfully and assigned to the Joint Warden.",
    })

    // Reset form
    setTitle("")
    setCategory("")
    setPriority("")
    setDescription("")
    setShowNewComplaint(false)
  }

  const viewComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
    setShowComplaintDetails(true)
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
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "in-progress":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/student/complaints", active: true },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Complaints</h1>
            <p className="text-gray-600">Submit and track your complaints and issues</p>
          </div>
          <Dialog open={showNewComplaint} onOpenChange={setShowNewComplaint}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Submit New Complaint</DialogTitle>
                <DialogDescription>Describe your issue and we'll help resolve it</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Food">Food & Dining</SelectItem>
                        <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Noise">Noise</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSubmitComplaint} className="w-full">
                  Submit Complaint
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Complaints Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-500" />
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
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">{complaints.filter((c) => c.status === "resolved").length}</p>
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
        </div>

        <Tabs defaultValue="my-complaints">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="my-complaints" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Complaints</CardTitle>
                <CardDescription>Track the status of your submitted complaints</CardDescription>
              </CardHeader>
              <CardContent>
                {complaints.length > 0 ? (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewComplaintDetails(complaint)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(complaint.status)}
                              <h4 className="font-medium">{complaint.title}</h4>
                              {getPriorityBadge(complaint.priority)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Category: {complaint.category}</span>
                              <span>Submitted: {complaint.submittedDate}</span>
                              <span>Assigned to: {complaint.assignedTo}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(complaint.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                viewComplaintDetails(complaint)
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
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Complaints</h3>
                    <p>You haven't submitted any complaints yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Submit a Complaint</CardTitle>
                  <CardDescription>Follow these steps for effective complaint resolution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Choose the Right Category</h4>
                      <p className="text-sm text-gray-600">
                        Select the most appropriate category for faster resolution
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Provide Clear Details</h4>
                      <p className="text-sm text-gray-600">
                        Include specific information about the issue, location, and time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Set Appropriate Priority</h4>
                      <p className="text-sm text-gray-600">
                        High for urgent issues, Medium for important, Low for general concerns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Track Your Complaint</h4>
                      <p className="text-sm text-gray-600">Monitor the status and respond to any follow-up questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complaint Categories</CardTitle>
                  <CardDescription>Understanding different types of complaints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-blue-600">Technical</h4>
                    <p className="text-sm text-gray-600">WiFi, electrical, internet connectivity issues</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-green-600">Maintenance</h4>
                    <p className="text-sm text-gray-600">Plumbing, furniture, room repairs</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-orange-600">Food & Dining</h4>
                    <p className="text-sm text-gray-600">Meal quality, hygiene, service issues</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-purple-600">Cleanliness</h4>
                    <p className="text-sm text-gray-600">Room cleaning, common area hygiene</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-red-600">Security</h4>
                    <p className="text-sm text-gray-600">Safety concerns, unauthorized access</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-600">Other</h4>
                    <p className="text-sm text-gray-600">Any other hostel-related issues</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Response Time Guidelines</CardTitle>
                <CardDescription>Expected resolution times based on priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">High Priority</h4>
                    <p className="text-sm text-red-600">Response: Within 2 hours</p>
                    <p className="text-sm text-red-600">Resolution: Within 24 hours</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Urgent issues affecting safety, security, or basic amenities
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800">Medium Priority</h4>
                    <p className="text-sm text-orange-600">Response: Within 24 hours</p>
                    <p className="text-sm text-orange-600">Resolution: Within 3 days</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Important issues that affect daily comfort and convenience
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800">Low Priority</h4>
                    <p className="text-sm text-gray-600">Response: Within 3 days</p>
                    <p className="text-sm text-gray-600">Resolution: Within 1 week</p>
                    <p className="text-xs text-gray-600 mt-2">General concerns and suggestions for improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Complaint Details Dialog */}
        <Dialog open={showComplaintDetails} onOpenChange={setShowComplaintDetails}>
          <DialogContent className="sm:max-w-[500px]">
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
                  {getStatusBadge(selectedComplaint.status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Priority</span>
                  {getPriorityBadge(selectedComplaint.priority)}
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

                <div className="space-y-1">
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-gray-600">{selectedComplaint.assignedTo}</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedComplaint.status)}
                    <span className="text-sm">
                      {selectedComplaint.status === "resolved"
                        ? "Your complaint has been resolved"
                        : selectedComplaint.status === "in-progress"
                          ? "Your complaint is being worked on"
                          : selectedComplaint.status === "rejected"
                            ? "Your complaint has been rejected"
                            : "Your complaint is pending review"}
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
