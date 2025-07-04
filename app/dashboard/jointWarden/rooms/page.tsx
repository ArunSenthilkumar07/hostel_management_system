"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Building2,
  Bed,
  AirVent,
  Fan,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Home,
  MessageSquare,
  Calendar,
  Clock,
  Heart,
  FileText,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenRooms, getJointWardenStudents } from "@/lib/mock-data"
import { toast } from "sonner"

export default function JointWardenRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [cleanlinessUpdate, setCleanlinessUpdate] = useState("")
  const [remarks, setRemarks] = useState("")

  const rooms = getJointWardenRooms()
  const students = getJointWardenStudents()

  const getRoomStudents = (roomNo: string) => {
    return students.filter((student) => student.roomNo === roomNo)
  }

  const handleUpdateCleanliness = (roomNo: string, status: string) => {
    toast.success(`Room ${roomNo} cleanliness updated to ${status}`)
    setCleanlinessUpdate("")
    setRemarks("")
  }

  const getCleanlinessColor = (status: string) => {
    switch (status) {
      case "Clean":
        return "bg-green-100 text-green-800"
      case "Needs Attention":
        return "bg-yellow-100 text-yellow-800"
      case "Dirty":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms", active: true },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Rooms</h1>
          <p className="text-gray-600">Manage and monitor your assigned rooms</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Clean Rooms</p>
                  <p className="text-2xl font-bold">{rooms.filter((r) => r.cleanliness === "Clean").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Attention</p>
                  <p className="text-2xl font-bold">
                    {rooms.filter((r) => r.cleanliness === "Needs Attention").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Occupancy</p>
                  <p className="text-2xl font-bold">{rooms.reduce((sum, room) => sum + room.currentOccupancy, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const roomStudents = getRoomStudents(room.roomNo)
            return (
              <Card key={room.roomNo} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{room.roomNo}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {room.type === "AC" ? (
                        <AirVent className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Fan className="h-4 w-4 text-gray-500" />
                      )}
                      <Badge variant="secondary">{room.type}</Badge>
                    </div>
                  </div>
                  <CardDescription>{room.hostel} Hostel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {room.currentOccupancy}/{room.capacity} Students
                      </span>
                    </div>
                    <Badge className={getCleanlinessColor(room.cleanliness)}>{room.cleanliness}</Badge>
                  </div>

                  {/* Current Students */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Current Students:</h4>
                    {roomStudents.length > 0 ? (
                      <div className="space-y-1">
                        {roomStudents.map((student) => (
                          <div key={student.sin} className="text-sm text-gray-600 flex items-center justify-between">
                            <span>{student.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {student.attendance}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No students assigned</p>
                    )}
                  </div>

                  {/* Room Inventory */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-3 w-3" />
                      <span>{room.inventory.cots} Cots</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🪑</span>
                      <span>{room.inventory.chairs} Chairs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📚</span>
                      <span>{room.inventory.tables} Tables</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🚪</span>
                      <span>{room.inventory.wardrobes} Wardrobes</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRoom(room)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Room Details - {selectedRoom?.roomNo}</DialogTitle>
                          <DialogDescription>Complete room information and management</DialogDescription>
                        </DialogHeader>
                        {selectedRoom && (
                          <div className="space-y-6">
                            {/* Room Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">Room Type</label>
                                <p className="text-sm">{selectedRoom.type}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Capacity</label>
                                <p className="text-sm">{selectedRoom.capacity} Students</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Current Occupancy</label>
                                <p className="text-sm">{selectedRoom.currentOccupancy} Students</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Restroom</label>
                                <p className="text-sm">{selectedRoom.hasRestroom ? "Available" : "Shared"}</p>
                              </div>
                            </div>

                            {/* Cleanliness Update */}
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-gray-700">Update Cleanliness Status</label>
                              <Select value={cleanlinessUpdate} onValueChange={setCleanlinessUpdate}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select cleanliness status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Clean">Clean</SelectItem>
                                  <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                                  <SelectItem value="Dirty">Dirty</SelectItem>
                                </SelectContent>
                              </Select>
                              <Textarea
                                placeholder="Add remarks or notes..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                              />
                              <Button
                                onClick={() => handleUpdateCleanliness(selectedRoom.roomNo, cleanlinessUpdate)}
                                disabled={!cleanlinessUpdate}
                                className="w-full"
                              >
                                Update Status
                              </Button>
                            </div>

                            {/* Current Students Details */}
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-gray-700">Current Students</label>
                              {getRoomStudents(selectedRoom.roomNo).map((student) => (
                                <div key={student.sin} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{student.name}</h4>
                                    <Badge variant="outline">{student.sin}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <span>Course: {student.course}</span>
                                    <span>Attendance: {student.attendance}%</span>
                                    <span>Phone: {student.phone}</span>
                                    <span>Fee: {student.feeStatus}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Room Status</DialogTitle>
                          <DialogDescription>
                            Update cleanliness and maintenance status for {room.roomNo}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Cleanliness Status</label>
                            <Select value={cleanlinessUpdate} onValueChange={setCleanlinessUpdate}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Clean">Clean</SelectItem>
                                <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                                <SelectItem value="Dirty">Dirty</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Remarks</label>
                            <Textarea
                              placeholder="Add any maintenance notes or observations..."
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={() => handleUpdateCleanliness(room.roomNo, cleanlinessUpdate)}
                            disabled={!cleanlinessUpdate}
                            className="w-full"
                          >
                            Update Room Status
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Room Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Room Status Summary</CardTitle>
            <CardDescription>Overview of all your assigned rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room.roomNo} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{room.roomNo}</span>
                    </div>
                    <Badge variant="secondary">{room.type}</Badge>
                    <span className="text-sm text-gray-600">
                      {room.currentOccupancy}/{room.capacity} occupied
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCleanlinessColor(room.cleanliness)}>{room.cleanliness}</Badge>
                    <span className="text-sm text-gray-500">{room.hostel}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
