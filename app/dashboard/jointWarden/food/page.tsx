"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  FileText,
  Plus,
  MessageSquare,
  Clock,
  Users,
  Building2,
  Calendar,
  Heart,
  Home,
  Star,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getJointWardenStudents } from "@/lib/mock-data"
import { toast } from "sonner"

interface MenuItem {
  id: string
  day: string
  meal: "breakfast" | "lunch" | "dinner"
  items: string[]
  description?: string
}

interface FoodFeedback {
  id: string
  studentSin: string
  studentName: string
  date: string
  meal: string
  rating: number
  feedback: string
  category: "taste" | "quality" | "quantity" | "hygiene" | "service"
  status: "pending" | "reviewed" | "resolved"
}

interface FoodUpdate {
  id: string
  date: string
  title: string
  description: string
  type: "menu_change" | "special_meal" | "announcement" | "nutrition_info"
  priority: "low" | "medium" | "high"
}

export default function JointWardenFoodPage() {
  const [selectedDay, setSelectedDay] = useState("monday")
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    description: "",
    type: "announcement",
    priority: "medium",
  })
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false)

  const students = getJointWardenStudents()

  const [weeklyMenu] = useState<MenuItem[]>([
    {
      id: "1",
      day: "monday",
      meal: "breakfast",
      items: ["Idli", "Sambar", "Coconut Chutney", "Tea/Coffee"],
      description: "South Indian breakfast",
    },
    {
      id: "2",
      day: "monday",
      meal: "lunch",
      items: ["Rice", "Dal", "Vegetable Curry", "Rasam", "Curd"],
      description: "Traditional lunch",
    },
    {
      id: "3",
      day: "monday",
      meal: "dinner",
      items: ["Chapati", "Paneer Curry", "Dal", "Rice", "Pickle"],
      description: "North Indian dinner",
    },
    {
      id: "4",
      day: "tuesday",
      meal: "breakfast",
      items: ["Poha", "Tea/Coffee", "Banana"],
      description: "Light breakfast",
    },
    {
      id: "5",
      day: "tuesday",
      meal: "lunch",
      items: ["Rice", "Sambar", "Cabbage Curry", "Rasam", "Buttermilk"],
      description: "South Indian lunch",
    },
    {
      id: "6",
      day: "tuesday",
      meal: "dinner",
      items: ["Roti", "Chicken Curry", "Dal", "Rice", "Salad"],
      description: "Non-veg dinner",
    },
    // Add more days...
    {
      id: "7",
      day: "wednesday",
      meal: "breakfast",
      items: ["Upma", "Coconut Chutney", "Tea/Coffee"],
      description: "South Indian breakfast",
    },
    {
      id: "8",
      day: "wednesday",
      meal: "lunch",
      items: ["Rice", "Dal", "Aloo Gobi", "Curd", "Pickle"],
      description: "North Indian lunch",
    },
    {
      id: "9",
      day: "wednesday",
      meal: "dinner",
      items: ["Chapati", "Rajma", "Rice", "Papad"],
      description: "Punjabi dinner",
    },
  ])

  const [foodFeedback, setFoodFeedback] = useState<FoodFeedback[]>([
    {
      id: "FB001",
      studentSin: "SIN230006",
      studentName: "Anita Patel",
      date: "2024-06-01",
      meal: "lunch",
      rating: 4,
      feedback: "Food was good but could be a bit more spicy",
      category: "taste",
      status: "pending",
    },
    {
      id: "FB002",
      studentSin: "SIN230009",
      studentName: "Arun Kumar",
      date: "2024-06-01",
      meal: "dinner",
      rating: 3,
      feedback: "Quantity was less, need more chapatis",
      category: "quantity",
      status: "pending",
    },
    {
      id: "FB003",
      studentSin: "SIN230007",
      studentName: "Deepak Singh",
      date: "2024-05-31",
      meal: "breakfast",
      rating: 5,
      feedback: "Excellent breakfast, loved the idli and sambar",
      category: "taste",
      status: "reviewed",
    },
    {
      id: "FB004",
      studentSin: "SIN230008",
      studentName: "Kavya Reddy",
      date: "2024-05-31",
      meal: "lunch",
      rating: 2,
      feedback: "Food was cold and not fresh",
      category: "quality",
      status: "resolved",
    },
  ])

  const [foodUpdates, setFoodUpdates] = useState<FoodUpdate[]>([
    {
      id: "FU001",
      date: "2024-06-01",
      title: "Special Dinner Tomorrow",
      description: "Tomorrow's dinner will include special biryani for all students",
      type: "special_meal",
      priority: "medium",
    },
    {
      id: "FU002",
      date: "2024-05-30",
      title: "Menu Change - Wednesday Lunch",
      description: "Wednesday lunch menu has been updated to include more variety",
      type: "menu_change",
      priority: "low",
    },
    {
      id: "FU003",
      date: "2024-05-29",
      title: "Nutrition Information Available",
      description: "Detailed nutrition information for all meals is now available at the mess counter",
      type: "nutrition_info",
      priority: "high",
    },
  ])

  const handleAddFoodUpdate = () => {
    if (!newUpdate.title || !newUpdate.description) {
      toast.error("Please fill in all required fields")
      return
    }

    const update: FoodUpdate = {
      id: `FU${String(foodUpdates.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      ...newUpdate,
    }

    setFoodUpdates([...foodUpdates, update])
    setNewUpdate({
      title: "",
      description: "",
      type: "announcement",
      priority: "medium",
    })
    setIsAddUpdateOpen(false)
    toast.success("Food update added successfully")
  }

  const handleUpdateFeedbackStatus = (feedbackId: string, status: string) => {
    setFoodFeedback((feedback) =>
      feedback.map((item) => (item.id === feedbackId ? { ...item, status: status as any } : item)),
    )
    toast.success(`Feedback ${status} successfully`)
  }

  const handleDeleteUpdate = (updateId: string) => {
    setFoodUpdates((updates) => updates.filter((update) => update.id !== updateId))
    toast.success("Update deleted successfully")
  }

  const handleExportFeedback = (format: string) => {
    const feedbackData = foodFeedback.map((feedback) => ({
      ID: feedback.id,
      "Student SIN": feedback.studentSin,
      "Student Name": feedback.studentName,
      Date: feedback.date,
      Meal: feedback.meal,
      Rating: feedback.rating,
      Feedback: feedback.feedback,
      Category: feedback.category,
      Status: feedback.status,
    }))

    if (format === "csv") {
      const csvContent = [
        Object.keys(feedbackData[0]).join(","),
        ...feedbackData.map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `food-feedback-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      const jsonContent = JSON.stringify(feedbackData, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `food-feedback-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    toast.success(`Feedback data exported as ${format.toUpperCase()}`)
  }

  const getMenuForDay = (day: string) => {
    return weeklyMenu.filter((item) => item.day === day)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
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

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/jointWarden" },
    { icon: Users, label: "My Students", href: "/dashboard/jointWarden/students" },
    { icon: Building2, label: "My Rooms", href: "/dashboard/jointWarden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/jointWarden/complaints" },
    { icon: Calendar, label: "Leave Verification", href: "/dashboard/jointWarden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/jointWarden/attendance" },
    { icon: Heart, label: "Health Tracking", href: "/dashboard/jointWarden/health" },
    { icon: FileText, label: "Food Updates", href: "/dashboard/jointWarden/food", active: true },
  ]

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  const pendingFeedback = foodFeedback.filter((f) => f.status === "pending")
  const reviewedFeedback = foodFeedback.filter((f) => f.status === "reviewed")
  const resolvedFeedback = foodFeedback.filter((f) => f.status === "resolved")

  const averageRating =
    foodFeedback.length > 0
      ? (foodFeedback.reduce((sum, f) => sum + f.rating, 0) / foodFeedback.length).toFixed(1)
      : "0"

  return (
    <DashboardLayout menuItems={menuItems} userRole="jointWarden" userName="Joint Warden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Food Management</h1>
            <p className="text-gray-600">Manage food menu and handle student feedback</p>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Feedback</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Food Feedback</DialogTitle>
                  <DialogDescription>Download feedback data from your students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => handleExportFeedback("csv")} className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download CSV</span>
                    </Button>
                    <Button
                      onClick={() => handleExportFeedback("json")}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download JSON</span>
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Export includes:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Student feedback and ratings</li>
                      <li>Meal categories and dates</li>
                      <li>Feedback status and resolution</li>
                      <li>Student information</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddUpdateOpen} onOpenChange={setIsAddUpdateOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Food Update</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Food Update</DialogTitle>
                  <DialogDescription>Create announcements or updates about food services</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <Input
                      placeholder="Enter update title"
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <Textarea
                      placeholder="Enter update description"
                      value={newUpdate.description}
                      onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <Select
                        value={newUpdate.type}
                        onValueChange={(value) => setNewUpdate({ ...newUpdate, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="menu_change">Menu Change</SelectItem>
                          <SelectItem value="special_meal">Special Meal</SelectItem>
                          <SelectItem value="nutrition_info">Nutrition Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <Select
                        value={newUpdate.priority}
                        onValueChange={(value) => setNewUpdate({ ...newUpdate, priority: value })}
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
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUpdateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFoodUpdate}>Add Update</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{averageRating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Feedback</p>
                  <p className="text-2xl font-bold">{pendingFeedback.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviewed</p>
                  <p className="text-2xl font-bold">{reviewedFeedback.length}</p>
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
                  <p className="text-2xl font-bold">{resolvedFeedback.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu">Weekly Menu</TabsTrigger>
            <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
            <TabsTrigger value="updates">Food Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Menu</CardTitle>
                <CardDescription>View the weekly food menu for all meals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getMenuForDay(selectedDay).map((menuItem) => (
                      <Card key={menuItem.id}>
                        <CardHeader>
                          <CardTitle className="text-lg capitalize">{menuItem.meal}</CardTitle>
                          <CardDescription>{menuItem.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {menuItem.items.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Feedback</CardTitle>
                <CardDescription>Review and manage food feedback from your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {foodFeedback.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{feedback.studentName}</h4>
                            <Badge variant="secondary">{feedback.studentSin}</Badge>
                            <Badge variant="outline">{feedback.meal}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{feedback.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                              {feedback.rating}/5
                            </span>
                          </div>
                          <Badge className={getStatusColor(feedback.status)}>{feedback.status}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {feedback.category}
                          </Badge>
                        </div>
                        <p className="text-gray-700">{feedback.feedback}</p>
                      </div>

                      {feedback.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateFeedbackStatus(feedback.id, "reviewed")}
                          >
                            Mark as Reviewed
                          </Button>
                          <Button size="sm" onClick={() => handleUpdateFeedbackStatus(feedback.id, "resolved")}>
                            Mark as Resolved
                          </Button>
                        </div>
                      )}

                      {feedback.status === "reviewed" && (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleUpdateFeedbackStatus(feedback.id, "resolved")}>
                            Mark as Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Food Updates & Announcements</CardTitle>
                <CardDescription>Manage food-related updates and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {foodUpdates.map((update) => (
                    <div key={update.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{update.title}</h4>
                            <Badge className={getPriorityColor(update.priority)}>{update.priority}</Badge>
                            <Badge variant="outline">{update.type.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{update.description}</p>
                          <p className="text-sm text-gray-500">Posted on {update.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleDeleteUpdate(update.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {foodUpdates.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No updates yet</h3>
                      <p className="text-gray-600">Create your first food update or announcement.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
