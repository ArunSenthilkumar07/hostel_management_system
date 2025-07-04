"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Building2,
  Search,
  Download,
  Plus,
  Edit,
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  Wrench,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Room {
  id: string
  roomNumber: string
  hostel: string
  floor: number
  capacity: number
  occupied: number
  status: "Available" | "Full" | "Maintenance" | "Closed"
  condition: "Excellent" | "Good" | "Fair" | "Poor"
  amenities: string[]
  lastMaintenance: string
  monthlyRent: number
  students: string[]
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "R001",
      roomNumber: "101",
      hostel: "Engineering",
      floor: 1,
      capacity: 4,
      occupied: 4,
      status: "Full",
      condition: "Good",
      amenities: ["AC", "WiFi", "Study Table", "Wardrobe"],
      lastMaintenance: "2024-01-15",
      monthlyRent: 8000,
      students: ["Arjun Kumar", "Vikram Singh", "Rahul Sharma", "Amit Patel"],
    },
    {
      id: "R002",
      roomNumber: "102",
      hostel: "Engineering",
      floor: 1,
      capacity: 4,
      occupied: 3,
      status: "Available",
      condition: "Excellent",
      amenities: ["AC", "WiFi", "Study Table", "Wardrobe", "Balcony"],
      lastMaintenance: "2024-02-01",
      monthlyRent: 8500,
      students: ["Suresh Babu", "Kiran Kumar", "Deepak Raj"],
    },
    {
      id: "R003",
      roomNumber: "201",
      hostel: "Engineering",
      floor: 2,
      capacity: 4,
      occupied: 0,
      status: "Maintenance",
      condition: "Poor",
      amenities: ["WiFi", "Study Table", "Wardrobe"],
      lastMaintenance: "2023-12-10",
      monthlyRent: 7000,
      students: [],
    },
    {
      id: "R004",
      roomNumber: "202",
      hostel: "Engineering",
      floor: 2,
      capacity: 4,
      occupied: 2,
      status: "Available",
      condition: "Good",
      amenities: ["AC", "WiFi", "Study Table", "Wardrobe"],
      lastMaintenance: "2024-01-20",
      monthlyRent: 8000,
      students: ["Priya Sharma", "Anita Kumari"],
    },
    {
      id: "R005",
      roomNumber: "301",
      hostel: "Pharmacy",
      floor: 3,
      capacity: 2,
      occupied: 2,
      status: "Full",
      condition: "Excellent",
      amenities: ["AC", "WiFi", "Study Table", "Wardrobe", "Attached Bathroom"],
      lastMaintenance: "2024-02-05",
      monthlyRent: 12000,
      students: ["Meera Nair", "Kavya Reddy"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms", active: true },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave" },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
  ]

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.hostel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHostel = filterHostel === "all" || room.hostel === filterHostel
    const matchesStatus = filterStatus === "all" || room.status.toLowerCase() === filterStatus
    return matchesSearch && matchesHostel && matchesStatus
  })

  const downloadRoomData = (format: "csv" | "json") => {
    const data = filteredRooms.map((room) => ({
      ...room,
      amenities: room.amenities.join("; "),
      students: room.students.join("; "),
    }))
    const timestamp = new Date().toISOString().split("T")[0]

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rooms-${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const headers = [
        "Room Number",
        "Hostel",
        "Floor",
        "Capacity",
        "Occupied",
        "Status",
        "Condition",
        "Monthly Rent",
        "Amenities",
        "Students",
      ]
      const csvData = data.map((room) => [
        room.roomNumber,
        room.hostel,
        room.floor,
        room.capacity,
        room.occupied,
        room.status,
        room.condition,
        room.monthlyRent,
        room.amenities,
        room.students,
      ])
      const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rooms-${timestamp}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    toast({ title: "Success", description: `Room data exported as ${format.toUpperCase()}` })
  }

  const handleAddRoom = (formData: FormData) => {
    const amenitiesString = formData.get("amenities") as string
    const newRoom: Room = {
      id: `R${Date.now()}`,
      roomNumber: formData.get("roomNumber") as string,
      hostel: formData.get("hostel") as string,
      floor: Number.parseInt(formData.get("floor") as string),
      capacity: Number.parseInt(formData.get("capacity") as string),
      occupied: 0,
      status: formData.get("status") as Room["status"],
      condition: formData.get("condition") as Room["condition"],
      amenities: amenitiesString.split(",").map((a) => a.trim()),
      lastMaintenance: formData.get("lastMaintenance") as string,
      monthlyRent: Number.parseInt(formData.get("monthlyRent") as string),
      students: [],
    }
    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
    toast({ title: "Success", description: "Room added successfully" })
  }

  const handleEditRoom = (formData: FormData) => {
    if (!selectedRoom) return
    const amenitiesString = formData.get("amenities") as string
    const updatedRoom = {
      ...selectedRoom,
      roomNumber: formData.get("roomNumber") as string,
      hostel: formData.get("hostel") as string,
      floor: Number.parseInt(formData.get("floor") as string),
      capacity: Number.parseInt(formData.get("capacity") as string),
      status: formData.get("status") as Room["status"],
      condition: formData.get("condition") as Room["condition"],
      amenities: amenitiesString.split(",").map((a) => a.trim()),
      monthlyRent: Number.parseInt(formData.get("monthlyRent") as string),
    }
    setRooms(rooms.map((r) => (r.id === selectedRoom.id ? updatedRoom : r)))
    setIsEditDialogOpen(false)
    setSelectedRoom(null)
    toast({ title: "Success", description: "Room updated successfully" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Available
          </Badge>
        )
      case "Full":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Users className="h-3 w-3 mr-1" />
            Full
          </Badge>
        )
      case "Maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Wrench className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        )
      case "Closed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "Good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "Fair":
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
      case "Poor":
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>
      default:
        return <Badge variant="secondary">{condition}</Badge>
    }
  }

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "Available").length,
    full: rooms.filter((r) => r.status === "Full").length,
    maintenance: rooms.filter((r) => r.status === "Maintenance").length,
    totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
    totalOccupied: rooms.reduce((sum, r) => sum + r.occupied, 0),
    occupancyRate: Math.round(
      (rooms.reduce((sum, r) => sum + r.occupied, 0) / rooms.reduce((sum, r) => sum + r.capacity, 0)) * 100,
    ),
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Room Management</h1>
            <p className="text-gray-600">Manage hostel rooms and allocations</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => downloadRoomData("csv")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => downloadRoomData("json")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>Enter room details to add it to the system</DialogDescription>
                </DialogHeader>
                <form action={handleAddRoom} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input id="roomNumber" name="roomNumber" required />
                    </div>
                    <div>
                      <Label htmlFor="hostel">Hostel</Label>
                      <Select name="hostel" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="Allied Science">Allied Science</SelectItem>
                          <SelectItem value="Nursing">Nursing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                      <Input id="floor" name="floor" type="number" min="1" required />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input id="capacity" name="capacity" type="number" min="1" required />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Full">Full</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select name="condition" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
                      <Input id="monthlyRent" name="monthlyRent" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                      <Input id="lastMaintenance" name="lastMaintenance" type="date" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                    <Textarea id="amenities" name="amenities" placeholder="AC, WiFi, Study Table, Wardrobe" required />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Room</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold">{stats.maintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by room number or hostel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterHostel} onValueChange={setFilterHostel}>
                  <SelectTrigger className="w-40">
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
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rooms ({filteredRooms.length})</CardTitle>
            <CardDescription>Manage room information and allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Hostel</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.roomNumber}</TableCell>
                      <TableCell>{room.hostel}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>
                            {room.occupied}/{room.capacity}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(room.status)}</TableCell>
                      <TableCell>{getConditionBadge(room.condition)}</TableCell>
                      <TableCell>₹{room.monthlyRent.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRoom(room)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRoom(room)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Room Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Room Details</DialogTitle>
              <DialogDescription>Complete information about the room</DialogDescription>
            </DialogHeader>
            {selectedRoom && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Room Number</Label>
                    <p className="text-sm">{selectedRoom.roomNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Hostel</Label>
                    <p className="text-sm">{selectedRoom.hostel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Floor</Label>
                    <p className="text-sm">{selectedRoom.floor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Capacity</Label>
                    <p className="text-sm">{selectedRoom.capacity} students</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Currently Occupied</Label>
                    <p className="text-sm">{selectedRoom.occupied} students</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRoom.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Condition</Label>
                    <div className="mt-1">{getConditionBadge(selectedRoom.condition)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Monthly Rent</Label>
                    <p className="text-sm">₹{selectedRoom.monthlyRent.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Maintenance</Label>
                    <p className="text-sm">{new Date(selectedRoom.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amenities</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedRoom.students.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Current Students</Label>
                    <div className="space-y-1 mt-1">
                      {selectedRoom.students.map((student, index) => (
                        <p key={index} className="text-sm">
                          {student}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>Update room information</DialogDescription>
            </DialogHeader>
            {selectedRoom && (
              <form action={handleEditRoom} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-roomNumber">Room Number</Label>
                    <Input id="edit-roomNumber" name="roomNumber" defaultValue={selectedRoom.roomNumber} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-hostel">Hostel</Label>
                    <Select name="hostel" defaultValue={selectedRoom.hostel} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Allied Science">Allied Science</SelectItem>
                        <SelectItem value="Nursing">Nursing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-floor">Floor</Label>
                    <Input
                      id="edit-floor"
                      name="floor"
                      type="number"
                      min="1"
                      defaultValue={selectedRoom.floor}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-capacity">Capacity</Label>
                    <Input
                      id="edit-capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      defaultValue={selectedRoom.capacity}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select name="status" defaultValue={selectedRoom.status} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Full">Full</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-condition">Condition</Label>
                    <Select name="condition" defaultValue={selectedRoom.condition} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-monthlyRent">Monthly Rent (₹)</Label>
                    <Input
                      id="edit-monthlyRent"
                      name="monthlyRent"
                      type="number"
                      defaultValue={selectedRoom.monthlyRent}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-amenities">Amenities (comma-separated)</Label>
                  <Textarea
                    id="edit-amenities"
                    name="amenities"
                    defaultValue={selectedRoom.amenities.join(", ")}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Room</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
