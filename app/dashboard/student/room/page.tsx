"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { dataOperations } from "@/lib/virtual-storage"
import { AlertTriangle, CheckCircle, Home, User, Users, Phone, Mail, MapPin, Heart } from "lucide-react"

export default function RoomDetailsPage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [roomData, setRoomData] = useState<any>(null)
  const [roommates, setRoommates] = useState<any[]>([])
  const [issueType, setIssueType] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = dataOperations.getStudentByEmail(email)
      setStudentData(data)

      if (data) {
        const room = dataOperations.getRoomByNumber(data.roomNumber)
        setRoomData(room)

        // Get roommates
        const roommatesList = dataOperations.getRoommates(email)
        setRoommates(roommatesList)
      }
    }
  }, [])

  const handleReportIssue = () => {
    if (!issueType || !issueDescription) {
      toast({
        title: "Missing Information",
        description: "Please select an issue type and provide a description.",
        variant: "destructive",
      })
      return
    }

    // Add complaint
    dataOperations.addComplaint({
      studentSin: studentData.sin,
      studentName: studentData.name,
      studentId: studentData.id,
      roomNumber: studentData.roomNumber,
      title: `${issueType} - Room Issue`,
      description: issueDescription,
      category: issueType,
      priority: "Medium",
    })

    toast({
      title: "Issue Reported",
      description: "Your room issue has been reported successfully.",
      variant: "default",
    })

    setIssueType("")
    setIssueDescription("")
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room", active: true },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
    { icon: Users, label: "Fee Management", href: "/dashboard/student/fees" },
    { icon: Users, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Users, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Users, label: "Food Menu", href: "/dashboard/student/food" },
    { icon: Users, label: "Notifications", href: "/dashboard/student/notifications" },
  ]

  if (!studentData || !roomData) {
    return (
      <DashboardLayout menuItems={menuItems} userRole="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Room Details
          </h1>
          <p className="text-gray-600">View your room information, roommates, and report issues</p>
        </div>

        {/* Room Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Room Information
              </CardTitle>
              <CardDescription>Basic details about your room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Room Number</span>
                  <span className="font-semibold text-blue-600">{roomData.roomNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Room Type</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {roomData.type}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Capacity</span>
                  <span>{roomData.capacity} Person</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Occupancy</span>
                  <span>
                    {roomData.occupied} / {roomData.capacity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Restroom</span>
                  <span>{roomData.hasRestroom ? "Attached" : "Shared"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Hostel Block</span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500">{roomData.hostel}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cleanliness Status</span>
                  {roomData.cleanliness === "Clean" ? (
                    <Badge className="bg-green-100 text-green-800">Clean</Badge>
                  ) : roomData.cleanliness === "Needs Attention" ? (
                    <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Dirty</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Room Inventory
              </CardTitle>
              <CardDescription>Furniture and equipment in your room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cots</span>
                  <span className="font-semibold">{roomData.inventory.cots}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tables</span>
                  <span className="font-semibold">{roomData.inventory.tables}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Chairs</span>
                  <span className="font-semibold">{roomData.inventory.chairs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Wardrobes</span>
                  <span className="font-semibold">{roomData.inventory.wardrobes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fans</span>
                  <span className="font-semibold">{roomData.inventory.fans}</span>
                </div>
                {roomData.type === "AC" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Air Conditioner</span>
                    <span className="font-semibold">1</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                My Roommates ({roommates.length})
              </CardTitle>
              <CardDescription>Students sharing your room</CardDescription>
            </CardHeader>
            <CardContent>
              {roommates.length > 0 ? (
                <div className="space-y-4">
                  {roommates.map((roommate) => (
                    <div
                      key={roommate.sin}
                      className="p-4 border rounded-xl bg-gradient-to-r from-white to-purple-50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                          {roommate.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{roommate.name}</p>
                          <p className="text-sm text-gray-600 truncate">{roommate.course}</p>
                          <p className="text-xs text-gray-500">SIN: {roommate.sin}</p>

                          {/* Contact Information */}
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <a href={`tel:${roommate.phone}`} className="text-xs text-blue-600 hover:underline">
                                {roommate.phone}
                              </a>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <a
                                href={`mailto:${roommate.email}`}
                                className="text-xs text-blue-600 hover:underline truncate"
                              >
                                {roommate.email}
                              </a>
                            </div>
                            {roommate.hometown && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{roommate.hometown}</span>
                              </div>
                            )}
                          </div>

                          {/* Status Badges */}
                          <div className="flex items-center space-x-2 mt-3">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Attendance: {roommate.attendance}%
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                roommate.feeStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : roommate.feeStatus === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {roommate.feeStatus}
                            </span>
                            {roommate.bloodGroup && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {roommate.bloodGroup}
                              </span>
                            )}
                          </div>

                          {/* Hobbies */}
                          {roommate.hobbies && roommate.hobbies.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Hobbies:</p>
                              <div className="flex flex-wrap gap-1">
                                {roommate.hobbies.slice(0, 3).map((hobby: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                                  >
                                    {hobby}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No roommates at the moment</p>
                  <p className="text-sm">You have this room to yourself</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Room Status and Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Room Status
              </CardTitle>
              <CardDescription>Current condition and maintenance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">Last Cleaning</p>
                    <p className="text-sm text-green-700">Room was cleaned yesterday</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Maintenance Check</p>
                    <p className="text-sm text-blue-700">Last performed on {roomData.lastMaintenance}</p>
                  </div>
                </div>

                {roomData.type === "AC" && (
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">AC Service</p>
                      <p className="text-sm text-blue-700">Last serviced on May 15, 2024</p>
                    </div>
                  </div>
                )}

                {roomData.cleanliness === "Needs Attention" && (
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-yellow-900">Cleanliness Alert</p>
                      <p className="text-sm text-yellow-700">Room needs cleaning attention</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Report an Issue
              </CardTitle>
              <CardDescription>Report maintenance or other room-related issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger id="issue-type">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintenance">Maintenance Issue</SelectItem>
                      <SelectItem value="Electrical">Electrical Problem</SelectItem>
                      <SelectItem value="Plumbing">Plumbing Problem</SelectItem>
                      <SelectItem value="Furniture">Furniture Damage</SelectItem>
                      <SelectItem value="Cleanliness">Cleanliness Issue</SelectItem>
                      <SelectItem value="AC/Cooling">AC/Cooling Problem</SelectItem>
                      <SelectItem value="WiFi">WiFi/Internet Issue</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-description">Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Describe the issue in detail..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleReportIssue}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Submit Issue Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Amenities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Room Amenities & Features</CardTitle>
            <CardDescription>Available facilities and services in your room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {roomData.amenities.map((amenity: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Room Rules */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Room Rules & Guidelines</CardTitle>
            <CardDescription>Important rules to follow in the hostel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <h3 className="font-semibold mb-3 text-blue-900">General Rules</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                  <li>Keep your room clean and tidy at all times</li>
                  <li>Maintain silence during study hours (8:00 PM - 10:00 PM)</li>
                  <li>No visitors allowed after 8:00 PM</li>
                  <li>Report any damages or issues immediately</li>
                  <li>Switch off lights and fans when not in use</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                <h3 className="font-semibold mb-3 text-green-900">Maintenance Guidelines</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-green-800">
                  <li>Do not paste posters or stickers on walls</li>
                  <li>Do not move furniture without permission</li>
                  <li>Report water leakage or electrical issues immediately</li>
                  <li>Keep the bathroom clean and dry</li>
                  <li>Dispose of waste in designated bins only</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <h3 className="font-semibold mb-3 text-purple-900">Important Contacts</h3>
                <div className="space-y-2 text-sm text-purple-800">
                  <div className="flex justify-between">
                    <span>Hostel Warden:</span>
                    <a href="tel:+919876543210" className="font-medium hover:underline">
                      +91 9876543210
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span>Joint Warden:</span>
                    <a href="tel:+919876543211" className="font-medium hover:underline">
                      +91 9876543211
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <a href="tel:+919876543212" className="font-medium hover:underline">
                      +91 9876543212
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <a href="tel:+919876543213" className="font-medium hover:underline text-red-600">
                      +91 9876543213
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
