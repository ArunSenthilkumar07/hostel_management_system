"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Heart,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Activity,
  Users,
  Building2,
  MessageSquare,
  Calendar,
  Clock,
  FileText,
  Home,
  Phone,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenStudents } from "@/lib/mock-data"
import { toast } from "sonner"

interface HealthRecord {
  id: string
  studentSin: string
  studentName: string
  date: string
  type: "checkup" | "illness" | "injury" | "medication"
  description: string
  symptoms?: string
  treatment?: string
  status: "active" | "resolved" | "monitoring"
  priority: "low" | "medium" | "high"
  followUpDate?: string
}

export default function JointWardenHealthPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: "HR001",
      studentSin: "SIN230006",
      studentName: "Anita Patel",
      date: "2024-06-01",
      type: "illness",
      description: "Fever and headache",
      symptoms: "High fever (102°F), headache, body ache",
      treatment: "Paracetamol prescribed, rest advised",
      status: "monitoring",
      priority: "medium",
      followUpDate: "2024-06-03",
    },
    {
      id: "HR002",
      studentSin: "SIN230009",
      studentName: "Arun Kumar",
      date: "2024-05-28",
      type: "checkup",
      description: "Regular health checkup",
      status: "resolved",
      priority: "low",
    },
  ])
  const [newRecord, setNewRecord] = useState({
    studentSin: "",
    type: "",
    description: "",
    symptoms: "",
    treatment: "",
    priority: "medium",
    followUpDate: "",
  })

  const students = getJointWardenStudents()

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSelected = selectedStudent === "" || student.sin === selectedStudent
    return matchesSearch && matchesSelected
  })

  const getStudentHealthRecords = (studentSin: string) => {
    return healthRecords.filter((record) => record.studentSin === studentSin)
  }

  const handleAddHealthRecord = () => {
    if (!newRecord.studentSin || !newRecord.type || !newRecord.description) {
      toast.error("Please fill in all required fields")
      return
    }

    const student = students.find((s) => s.sin === newRecord.studentSin)
    const record: HealthRecord = {
      id: `HR${String(healthRecords.length + 1).padStart(3, "0")}`,
      studentName: student?.name || "",
      date: new Date().toISOString().split("T")[0],
      status: "active",
      ...newRecord,
    }

    setHealthRecords([...healthRecords, record])
    setNewRecord({
      studentSin: "",
      type: "",
      description: "",
      symptoms: "",
      treatment: "",
      priority: "medium",
      followUpDate: "",
    })
    toast.success("Health record added successfully")
  }

  const handleUpdateStatus = (recordId: string, status: string) => {
    setHealthRecords((records) => records.map((record) => (record.id === recordId ? { ...record, status } : record)))
    toast.success(`Health record updated to ${status}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "illness":
        return <Thermometer className="h-4 w-4" />
      case "injury":
        return <AlertTriangle className="h-4 w-4" />
      case "checkup":
        return <CheckCircle className="h-4 w-4" />
      case "medication":
        return <Activity className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health", active: true },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food" },
  ]

  const activeRecords = healthRecords.filter((r) => r.status === "active")
  const monitoringRecords = healthRecords.filter((r) => r.status === "monitoring")
  const resolvedRecords = healthRecords.filter((r) => r.status === "resolved")

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Health Tracking</h1>
            <p className="text-gray-600">Monitor and track health records of your students</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Health Record</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>Record health information for your students</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Student</label>
                    <Select
                      value={newRecord.studentSin}
                      onValueChange={(value) => setNewRecord({ ...newRecord, studentSin: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.sin} value={student.sin}>
                            {student.name} - {student.roomNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <Select
                      value={newRecord.type}
                      onValueChange={(value) => setNewRecord({ ...newRecord, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="illness">Illness</SelectItem>
                        <SelectItem value="injury">Injury</SelectItem>
                        <SelectItem value="checkup">Regular Checkup</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    placeholder="Brief description of the health issue or checkup..."
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Symptoms (if applicable)</label>
                  <Textarea
                    placeholder="List any symptoms observed..."
                    value={newRecord.symptoms}
                    onChange={(e) => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Treatment/Action Taken</label>
                  <Textarea
                    placeholder="Treatment provided or action taken..."
                    value={newRecord.treatment}
                    onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <Select
                      value={newRecord.priority}
                      onValueChange={(value) => setNewRecord({ ...newRecord, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Follow-up Date (optional)</label>
                    <Input
                      type="date"
                      value={newRecord.followUpDate}
                      onChange={(e) => setNewRecord({ ...newRecord, followUpDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <Button onClick={handleAddHealthRecord} className="w-full">
                  Add Health Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold">{healthRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold">{activeRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Monitoring</p>
                  <p className="text-2xl font-bold">{monitoringRecords.length}</p>
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
                  <p className="text-2xl font-bold">{resolvedRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.sin} value={student.sin}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Health Records */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Cases ({activeRecords.length})</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring ({monitoringRecords.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedRecords.length})</TabsTrigger>
            <TabsTrigger value="students">Student Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeRecords.length > 0 ? (
              <div className="grid gap-4">
                {activeRecords.map((record) => (
                  <Card key={record.id} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(record.type)}
                            <h3 className="font-semibold">{record.studentName}</h3>
                            <Badge className={getPriorityColor(record.priority)}>{record.priority}</Badge>
                            <Badge variant="outline">{record.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          {record.symptoms && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Symptoms:</strong> {record.symptoms}
                            </p>
                          )}
                          {record.treatment && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Treatment:</strong> {record.treatment}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Date: {record.date}</span>
                            <span>ID: {record.id}</span>
                            {record.followUpDate && <span>Follow-up: {record.followUpDate}</span>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(record.id, "monitoring")}
                          >
                            Monitor
                          </Button>
                          <Button size="sm" onClick={() => handleUpdateStatus(record.id, "resolved")}>
                            Resolve
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
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active health cases</h3>
                  <p className="text-gray-600">All health issues have been resolved or are being monitored.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            {monitoringRecords.length > 0 ? (
              <div className="grid gap-4">
                {monitoringRecords.map((record) => (
                  <Card key={record.id} className="border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(record.type)}
                            <h3 className="font-semibold">{record.studentName}</h3>
                            <Badge className={getStatusColor(record.status)}>Monitoring</Badge>
                            <Badge variant="outline">{record.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          {record.symptoms && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Symptoms:</strong> {record.symptoms}
                            </p>
                          )}
                          {record.treatment && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Treatment:</strong> {record.treatment}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Date: {record.date}</span>
                            {record.followUpDate && <span>Follow-up: {record.followUpDate}</span>}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleUpdateStatus(record.id, "resolved")}>
                          Mark Resolved
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cases being monitored</h3>
                  <p className="text-gray-600">No health cases are currently under monitoring.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedRecords.length > 0 ? (
              <div className="grid gap-4">
                {resolvedRecords.map((record) => (
                  <Card key={record.id} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(record.type)}
                            <h3 className="font-semibold">{record.studentName}</h3>
                            <Badge className={getStatusColor(record.status)}>Resolved</Badge>
                            <Badge variant="outline">{record.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          {record.treatment && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Treatment:</strong> {record.treatment}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Date: {record.date}</span>
                            <span>Resolved</span>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resolved cases</h3>
                  <p className="text-gray-600">No health cases have been resolved yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => {
                const studentRecords = getStudentHealthRecords(student.sin)
                const activeCount = studentRecords.filter((r) => r.status === "active").length
                const monitoringCount = studentRecords.filter((r) => r.status === "monitoring").length

                return (
                  <Card key={student.sin} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <Badge variant="secondary">{student.roomNo}</Badge>
                      </div>
                      <CardDescription>{student.sin}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>{student.hostel} Hostel</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-blue-50 rounded">
                          <p className="font-medium text-blue-800">{studentRecords.length}</p>
                          <p className="text-blue-600">Total</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          <p className="font-medium text-red-800">{activeCount}</p>
                          <p className="text-red-600">Active</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded">
                          <p className="font-medium text-yellow-800">{monitoringCount}</p>
                          <p className="text-yellow-600">Monitor</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>Emergency: {student.emergencyContact}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
