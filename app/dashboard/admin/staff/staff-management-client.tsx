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
import { Users, Search, Download, Plus, Edit, Trash2, Eye, Shield, UserCheck, Calendar, DollarSign } from "lucide-react"
import { addStaffAction, updateStaffAction, deleteStaffAction } from "./actions"

interface Staff {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  role: string
  department: string
  joinDate: string
  salary: number
  status: string
  address: string
  emergencyContact: string
}

interface StaffManagementClientProps {
  initialStaff: Staff[]
}

export function StaffManagementClient({ initialStaff }: StaffManagementClientProps) {
  const [staff, setStaff] = useState<Staff[]>(initialStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesStatus = filterStatus === "all" || member.status.toLowerCase() === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const downloadStaffData = (format: "csv" | "json") => {
    const data = filteredStaff
    const timestamp = new Date().toISOString().split("T")[0]

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `staff-${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const headers = ["Name", "Employee ID", "Email", "Phone", "Role", "Department", "Join Date", "Salary", "Status"]
      const csvData = data.map((member) => [
        member.name,
        member.employeeId,
        member.email,
        member.phone,
        member.role,
        member.department,
        member.joinDate,
        member.salary,
        member.status,
      ])
      const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `staff-${timestamp}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    toast({ title: "Success", description: `Staff data exported as ${format.toUpperCase()}` })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "On Leave":
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Warden":
      case "Joint Warden":
        return <Shield className="h-4 w-4" />
      case "Security":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.status === "Active").length,
    onLeave: staff.filter((s) => s.status === "On Leave").length,
    inactive: staff.filter((s) => s.status === "Inactive").length,
    totalSalary: staff.reduce((sum, s) => sum + s.salary, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-gray-600">Manage hostel staff and employees</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => downloadStaffData("csv")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => downloadStaffData("json")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter staff details to add them to the system</DialogDescription>
              </DialogHeader>
              <form
                action={async (formData) => {
                  const result = await addStaffAction(formData)
                  if (result.success) {
                    setIsAddDialogOpen(false)
                    toast({ title: "Success", description: result.message })
                    // Refresh the page
                    window.location.reload()
                  } else {
                    toast({ title: "Error", description: result.message, variant: "destructive" })
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" name="employeeId" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" required />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Warden">Warden</SelectItem>
                        <SelectItem value="Joint Warden">Joint Warden</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" required />
                  </div>
                  <div>
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input id="joinDate" name="joinDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary</Label>
                    <Input id="salary" name="salary" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input id="emergencyContact" name="emergencyContact" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" required />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Staff</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold">{stats.onLeave}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Salary</p>
                <p className="text-2xl font-bold">₹{stats.totalSalary.toLocaleString()}</p>
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
                  placeholder="Search by name, employee ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Warden">Warden</SelectItem>
                  <SelectItem value="Joint Warden">Joint Warden</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
          <CardDescription>Manage staff information and records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.employeeId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(member.role)}
                        <span>{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{member.salary.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStaff(member)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStaff(member)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStaff(member)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* View Staff Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>Complete information about the staff member</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-sm">{selectedStaff.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                  <p className="text-sm">{selectedStaff.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{selectedStaff.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="text-sm">{selectedStaff.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Role</Label>
                  <p className="text-sm">{selectedStaff.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department</Label>
                  <p className="text-sm">{selectedStaff.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Join Date</Label>
                  <p className="text-sm">{new Date(selectedStaff.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Salary</Label>
                  <p className="text-sm">₹{selectedStaff.salary.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedStaff.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
                  <p className="text-sm">{selectedStaff.emergencyContact}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Address</Label>
                <p className="text-sm">{selectedStaff.address}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff information</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <form
              action={async (formData) => {
                formData.append("staffId", selectedStaff.id)
                formData.append("employeeId", selectedStaff.employeeId)
                formData.append("joinDate", selectedStaff.joinDate)

                const result = await updateStaffAction(selectedStaff.id, formData)
                if (result.success) {
                  setIsEditDialogOpen(false)
                  setSelectedStaff(null)
                  toast({ title: "Success", description: result.message })
                  // Refresh the page
                  window.location.reload()
                } else {
                  toast({ title: "Error", description: result.message, variant: "destructive" })
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedStaff.name} required />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={selectedStaff.email} required />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" name="phone" defaultValue={selectedStaff.phone} required />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select name="role" defaultValue={selectedStaff.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Warden">Warden</SelectItem>
                      <SelectItem value="Joint Warden">Joint Warden</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Input id="edit-department" name="department" defaultValue={selectedStaff.department} required />
                </div>
                <div>
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input id="edit-salary" name="salary" type="number" defaultValue={selectedStaff.salary} required />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={selectedStaff.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
                  <Input
                    id="edit-emergencyContact"
                    name="emergencyContact"
                    defaultValue={selectedStaff.emergencyContact}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea id="edit-address" name="address" defaultValue={selectedStaff.address} required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Staff</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Staff Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this staff member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <form
              action={async () => {
                const result = await deleteStaffAction(selectedStaff.id)
                if (result.success) {
                  setIsDeleteDialogOpen(false)
                  setSelectedStaff(null)
                  toast({ title: "Success", description: result.message })
                  // Refresh the page
                  window.location.reload()
                } else {
                  toast({ title: "Error", description: result.message, variant: "destructive" })
                }
              }}
              className="space-y-4"
            >
              <div className="border rounded p-4">
                <p className="font-medium">{selectedStaff.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedStaff.employeeId} - {selectedStaff.role}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">
                  Delete Staff
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
