"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllRooms, getAllStudents } from "@/lib/mock-data"
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Plus,
  Search,
  Users,
  Utensils,
  Edit,
  Eye,
  Settings,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export default function WardenRoomsPage() {
  const [rooms] = useState(getAllRooms())
  const [students] = useState(getAllStudents())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [showRoomDetails, setShowRoomDetails] = useState(false)

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms", active: true },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food" },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHostel = filterHostel === "all" || room.hostel === filterHostel
    const matchesStatus = filterStatus === "all" || room.cleanliness === filterStatus

    return matchesSearch && matchesHostel && matchesStatus
  })

  const getRoomStudents = (roomNo: string) => {
    return students.filter((student) => student.roomNo === roomNo)
  }

  const viewRoomDetails = (room: any) => {
    setSelectedRoom(room)
    setShowRoomDetails(true)
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

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage === 100) return "bg-red-100 text-red-800"
    if (percentage >= 75) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Room Management</h1>
            <p className="text-gray-600">Manage room allocations and maintenance</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
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
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-2xl font-bold">{rooms.filter((r) => r.currentOccupancy > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold">{rooms.filter((r) => r.currentOccupancy < r.capacity).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                  <p className="text-2xl font-bold">
                    {rooms.filter((r) => r.cleanliness === "Needs Attention").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="room-list">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="room-list">Room Directory</TabsTrigger>
            <TabsTrigger value="allocations">Room Allocations</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="room-list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Directory</CardTitle>
                <CardDescription>Overview of all rooms and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search by room number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterHostel} onValueChange={setFilterHostel}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hostels</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Allied Science">Allied Science</SelectItem>
                      <SelectItem value="Nursing">Nursing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Clean">Clean</SelectItem>
                      <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                      <SelectItem value="Dirty">Dirty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRooms.map((room) => {
                    const roomStudents = getRoomStudents(room.roomNo)
                    return (
                      <Card key={room.roomNo} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-lg">{room.roomNo}</h3>
                            <Badge className={getCleanlinessColor(room.cleanliness)}>{room.cleanliness}</Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Type:</span>
                              <span className="font-medium">{room.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Hostel:</span>
                              <span className="font-medium">{room.hostel}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Occupancy:</span>
                              <Badge className={getOccupancyColor(room.currentOccupancy, room.capacity)}>
                                {room.currentOccupancy}/{room.capacity}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Restroom:</span>
                              <span className="font-medium">{room.hasRestroom ? "Yes" : "No"}</span>
                            </div>
                          </div>

                          {roomStudents.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-1">Students:</p>
                              {roomStudents.map((student) => (
                                <p key={student.sin} className="text-xs text-gray-600">
                                  {student.name} ({student.sin})
                                </p>
                              ))}
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewRoomDetails(room)}
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {filteredRooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Rooms Found</h3>
                    <p>No rooms match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Allocations</CardTitle>
                <CardDescription>Manage student room assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rooms
                    .filter((room) => room.currentOccupancy > 0)
                    .map((room) => {
                      const roomStudents = getRoomStudents(room.roomNo)
                      return (
                        <div key={room.roomNo} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{room.roomNo}</h4>
                              <p className="text-sm text-gray-600">
                                {room.hostel} • {room.type}
                              </p>
                            </div>
                            <Badge className={getOccupancyColor(room.currentOccupancy, room.capacity)}>
                              {room.currentOccupancy}/{room.capacity}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roomStudents.map((student) => (
                              <div
                                key={student.sin}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div>
                                  <p className="font-medium text-sm">{student.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {student.sin} • {student.course}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}

                            {room.currentOccupancy < room.capacity && (
                              <div className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded">
                                <Button variant="ghost" size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Assign Student
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Status</CardTitle>
                <CardDescription>Track room maintenance and cleanliness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.roomNo} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{room.roomNo}</h4>
                          <p className="text-sm text-gray-600">{room.hostel}</p>
                        </div>
                        <Badge className={getCleanlinessColor(room.cleanliness)}>{room.cleanliness}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">Cots</p>
                          <p className="text-lg">{room.inventory.cots}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Tables</p>
                          <p className="text-lg">{room.inventory.tables}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Chairs</p>
                          <p className="text-lg">{room.inventory.chairs}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Wardrobes</p>
                          <p className="text-lg">{room.inventory.wardrobes}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Schedule Cleaning
                        </Button>
                        <Button variant="outline" size="sm">
                          Report Issue
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Room Details Dialog */}
        <Dialog open={showRoomDetails} onOpenChange={setShowRoomDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Room Details - {selectedRoom?.roomNo}</DialogTitle>
              <DialogDescription>Complete room information and status</DialogDescription>
            </DialogHeader>

            {selectedRoom && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Room Number</Label>
                    <p className="text-sm text-gray-600">{selectedRoom.roomNo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm text-gray-600">{selectedRoom.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Hostel</Label>
                    <p className="text-sm text-gray-600">{selectedRoom.hostel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Capacity</Label>
                    <p className="text-sm text-gray-600">{selectedRoom.capacity} students</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Current Occupancy</Label>
                    <p className="text-sm text-gray-600">{selectedRoom.currentOccupancy} students</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Restroom</Label>
                    <p className="text-sm text-gray-600">{selectedRoom.hasRestroom ? "Available" : "Not Available"}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Cleanliness Status</Label>
                  <div className="mt-1">
                    <Badge className={getCleanlinessColor(selectedRoom.cleanliness)}>{selectedRoom.cleanliness}</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Room Inventory</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Cots:</span>
                      <span>{selectedRoom.inventory.cots}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tables:</span>
                      <span>{selectedRoom.inventory.tables}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Chairs:</span>
                      <span>{selectedRoom.inventory.chairs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Wardrobes:</span>
                      <span>{selectedRoom.inventory.wardrobes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fans:</span>
                      <span>{selectedRoom.inventory.fans}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Current Students</Label>
                  <div className="mt-2 space-y-2">
                    {getRoomStudents(selectedRoom.roomNo).map((student) => (
                      <div key={student.sin} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-gray-600">
                          {student.sin} • {student.course}
                        </p>
                      </div>
                    ))}
                    {getRoomStudents(selectedRoom.roomNo).length === 0 && (
                      <p className="text-sm text-gray-500">No students assigned</p>
                    )}
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
