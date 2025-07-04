"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData } from "@/lib/mock-data"
import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Upload,
  User,
  Users,
  GraduationCap,
  Building2,
} from "lucide-react"

export default function ProfilePage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states
  const [editedData, setEditedData] = useState<any>({})
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)
      setEditedData(data || {})
    }
  }, [])

  const handleSaveProfile = () => {
    if (!editedData.name || !editedData.email || !editedData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setStudentData(editedData)
    setIsEditing(false)

    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    })

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowPasswordDialog(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({ ...prev, [field]: value }))
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile", active: true },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
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
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal-info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
            <TabsTrigger value="academic-info">Academic Information</TabsTrigger>
            <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-2xl">{studentData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Recommended: Square image, at least 400x400px</p>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Your basic personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedData.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{studentData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sin">SIN Number</Label>
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span>{studentData.sin}</span>
                        <Badge variant="outline" className="ml-auto">
                          Read Only
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{studentData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{studentData.dob}</span>
                        <Badge variant="outline" className="ml-auto">
                          Read Only
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedData.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{studentData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-contact">Emergency Contact *</Label>
                      {isEditing ? (
                        <Input
                          id="emergency-contact"
                          value={editedData.emergencyContact || ""}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{studentData.emergencyContact}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={editedData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-start space-x-2 p-2 border rounded-md bg-gray-50">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span>{studentData.address || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic-info" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your course and academic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span>{studentData.course}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Hostel</Label>
                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{studentData.hostel}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Room Number</Label>
                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span>{studentData.roomNo}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Join Date</Label>
                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{studentData.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Your academic statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Attendance</h4>
                    <p className="text-2xl font-bold text-blue-600">{studentData.attendance}%</p>
                    <p className="text-sm text-blue-600">Current semester</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Fee Status</h4>
                    <Badge
                      className={
                        studentData.feeStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : studentData.feeStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {studentData.feeStatus}
                    </Badge>
                    <p className="text-sm text-green-600 mt-1">Current semester</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800">Academic Year</h4>
                    <p className="text-lg font-bold text-purple-600">2023-2024</p>
                    <p className="text-sm text-purple-600">Current year</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account-settings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                    </div>
                    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Lock className="h-4 w-4 mr-2" />
                          Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>Update your account password for better security</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <Button onClick={handleChangePassword} className="w-full">
                            Change Password
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Badge variant="outline">Not Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Login Sessions</h4>
                      <p className="text-sm text-gray-600">Manage your active sessions</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-gray-600">Control your data visibility</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-gray-600">Download your account data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
