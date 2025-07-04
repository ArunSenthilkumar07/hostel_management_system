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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData } from "@/lib/mock-data"
import {
  Activity,
  AlertTriangle,
  CalendarIcon,
  FileText,
  Heart,
  Home,
  Plus,
  Thermometer,
  User,
  Users,
} from "lucide-react"

// Mock health data
const healthRecords = [
  {
    id: "HR001",
    date: "2024-06-01",
    type: "Medical Checkup",
    description: "Regular health checkup",
    doctor: "Dr. Priya Sharma",
    hospital: "College Health Center",
    diagnosis: "Normal health parameters",
    medications: ["Vitamin D supplements"],
    status: "Completed",
    followUp: null,
  },
  {
    id: "HR002",
    date: "2024-05-15",
    type: "Fever",
    description: "High fever and body ache",
    doctor: "Dr. Rajesh Kumar",
    hospital: "City Hospital",
    diagnosis: "Viral fever",
    medications: ["Paracetamol 500mg", "Rest for 3 days"],
    status: "Recovered",
    followUp: "2024-05-18",
  },
  {
    id: "HR003",
    date: "2024-04-20",
    type: "Vaccination",
    description: "COVID-19 booster shot",
    doctor: "Dr. Anita Patel",
    hospital: "College Health Center",
    diagnosis: "Vaccination completed",
    medications: [],
    status: "Completed",
    followUp: null,
  },
]

const vitalSigns = {
  bloodPressure: "120/80",
  heartRate: "72 bpm",
  temperature: "98.6°F",
  weight: "65 kg",
  height: "170 cm",
  bmi: "22.5",
  lastUpdated: "2024-06-01",
}

export default function HealthRecordsPage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showRecordDetails, setShowRecordDetails] = useState(false)
  const [showAddRecord, setShowAddRecord] = useState(false)

  // Form state for new health record
  const [recordType, setRecordType] = useState("")
  const [recordDate, setRecordDate] = useState<Date>()
  const [description, setDescription] = useState("")
  const [doctor, setDoctor] = useState("")
  const [hospital, setHospital] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [medications, setMedications] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)
    }
  }, [])

  const handleAddRecord = () => {
    if (!recordType || !recordDate || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newRecord = {
      id: `HR${Math.floor(Math.random() * 1000)}`,
      date: format(recordDate, "yyyy-MM-dd"),
      type: recordType,
      description,
      doctor,
      hospital,
      diagnosis,
      medications: medications
        .split(",")
        .map((med) => med.trim())
        .filter(Boolean),
      status: "Completed",
      followUp: null,
    }

    toast({
      title: "Health Record Added",
      description: "Your health record has been added successfully.",
    })

    // Reset form
    setRecordType("")
    setRecordDate(undefined)
    setDescription("")
    setDoctor("")
    setHospital("")
    setDiagnosis("")
    setMedications("")
    setShowAddRecord(false)
  }

  const viewRecordDetails = (record: any) => {
    setSelectedRecord(record)
    setShowRecordDetails(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "Recovered":
        return <Badge className="bg-blue-100 text-blue-800">Recovered</Badge>
      case "Ongoing":
        return <Badge className="bg-yellow-100 text-yellow-800">Ongoing</Badge>
      case "Follow-up Required":
        return <Badge className="bg-orange-100 text-orange-800">Follow-up Required</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
    { icon: Users, label: "Fee Management", href: "/dashboard/student/fees" },
    { icon: Users, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Heart, label: "Health Records", href: "/dashboard/student/health", active: true },
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
            <h1 className="text-3xl font-bold">Health Records</h1>
            <p className="text-gray-600">Track your health information and medical history</p>
          </div>
          <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>Add a new health record or medical visit</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="record-type">Type *</Label>
                  <Select value={recordType} onValueChange={setRecordType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical Checkup">Medical Checkup</SelectItem>
                      <SelectItem value="Fever">Fever</SelectItem>
                      <SelectItem value="Cold/Flu">Cold/Flu</SelectItem>
                      <SelectItem value="Injury">Injury</SelectItem>
                      <SelectItem value="Vaccination">Vaccination</SelectItem>
                      <SelectItem value="Dental">Dental</SelectItem>
                      <SelectItem value="Eye Checkup">Eye Checkup</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !recordDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {recordDate ? format(recordDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={recordDate} onSelect={setRecordDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the health issue or visit..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Input
                      id="doctor"
                      placeholder="Dr. Name"
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clinic</Label>
                    <Input
                      id="hospital"
                      placeholder="Hospital name"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    placeholder="Medical diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Medications</Label>
                  <Input
                    id="medications"
                    placeholder="Medications (comma separated)"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddRecord} className="w-full">
                  Add Health Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                  <p className="text-xl font-bold">{vitalSigns.bloodPressure}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Heart Rate</p>
                  <p className="text-xl font-bold">{vitalSigns.heartRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Temperature</p>
                  <p className="text-xl font-bold">{vitalSigns.temperature}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">BMI</p>
                  <p className="text-xl font-bold">{vitalSigns.bmi}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="records">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Your complete health records and medical visits</CardDescription>
              </CardHeader>
              <CardContent>
                {healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewRecordDetails(record)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{record.type}</h4>
                            <p className="text-sm text-gray-600">{record.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {record.date} • {record.doctor || "Self-reported"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(record.status)}
                            {record.followUp && (
                              <p className="text-xs text-orange-600 mt-1">Follow-up: {record.followUp}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Health Records</h3>
                    <p>Start tracking your health by adding your first record.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Vital Signs</CardTitle>
                  <CardDescription>Last updated: {vitalSigns.lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Blood Pressure</span>
                    <span className="text-lg">{vitalSigns.bloodPressure}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Heart Rate</span>
                    <span className="text-lg">{vitalSigns.heartRate}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Temperature</span>
                    <span className="text-lg">{vitalSigns.temperature}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Weight</span>
                    <span className="text-lg">{vitalSigns.weight}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Height</span>
                    <span className="text-lg">{vitalSigns.height}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">BMI</span>
                    <span className="text-lg">{vitalSigns.bmi}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>Track your health progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800">BMI Status</h4>
                      <p className="text-sm text-green-600">Normal weight range</p>
                      <p className="text-xs text-gray-600 mt-1">BMI: {vitalSigns.bmi} (18.5-24.9 is normal)</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800">Blood Pressure</h4>
                      <p className="text-sm text-blue-600">Normal range</p>
                      <p className="text-xs text-gray-600 mt-1">120/80 mmHg (Normal: &lt;120/80)</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800">Heart Rate</h4>
                      <p className="text-sm text-purple-600">Normal resting rate</p>
                      <p className="text-xs text-gray-600 mt-1">72 bpm (Normal: 60-100 bpm)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>Important contacts for medical emergencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Primary Emergency Contact</h4>
                    <p className="text-sm text-gray-600">Parent/Guardian</p>
                    <p className="font-medium">{studentData.emergencyContact}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">College Health Center</h4>
                    <p className="text-sm text-gray-600">24/7 Medical Support</p>
                    <p className="font-medium">+91 9876543200</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Nearest Hospital</h4>
                    <p className="text-sm text-gray-600">City General Hospital</p>
                    <p className="font-medium">+91 9876543201</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Ambulance Service</h4>
                    <p className="text-sm text-gray-600">Emergency Medical Services</p>
                    <p className="font-medium">108</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Important medical details for emergencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Blood Group</h4>
                    <p className="text-lg font-bold text-red-600">O+</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Known Allergies</h4>
                    <p className="text-sm text-gray-600">None reported</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Chronic Conditions</h4>
                    <p className="text-sm text-gray-600">None reported</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Current Medications</h4>
                    <p className="text-sm text-gray-600">Vitamin D supplements</p>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h4 className="font-medium text-red-800">Emergency Instructions</h4>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      In case of emergency, contact the college health center immediately and inform your emergency
                      contact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Health Record Details Dialog */}
        <Dialog open={showRecordDetails} onOpenChange={setShowRecordDetails}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Health Record Details</DialogTitle>
              <DialogDescription>
                {selectedRecord?.type} • {selectedRecord?.date}
              </DialogDescription>
            </DialogHeader>

            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  {getStatusBadge(selectedRecord.status)}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-gray-600">{selectedRecord.description}</p>
                </div>

                {selectedRecord.doctor && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Doctor</p>
                    <p className="text-sm text-gray-600">{selectedRecord.doctor}</p>
                  </div>
                )}

                {selectedRecord.hospital && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Hospital/Clinic</p>
                    <p className="text-sm text-gray-600">{selectedRecord.hospital}</p>
                  </div>
                )}

                {selectedRecord.diagnosis && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Diagnosis</p>
                    <p className="text-sm text-gray-600">{selectedRecord.diagnosis}</p>
                  </div>
                )}

                {selectedRecord.medications.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Medications</p>
                    <ul className="text-sm text-gray-600 list-disc pl-5">
                      {selectedRecord.medications.map((med: string, index: number) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRecord.followUp && (
                  <div className="space-y-1 p-3 bg-orange-50 rounded-md">
                    <p className="text-sm font-medium">Follow-up Required</p>
                    <p className="text-sm text-gray-600">Scheduled for: {selectedRecord.followUp}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
