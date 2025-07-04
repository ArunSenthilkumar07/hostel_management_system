"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Plus,
  Star,
  Users,
  Utensils,
  Edit,
  Eye,
  ChefHat,
} from "lucide-react"

// Mock food data
const weeklyMenu = {
  Monday: {
    breakfast: { items: ["Idli", "Sambar", "Coconut Chutney", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Rice", "Dal", "Mixed Vegetable Curry", "Rasam", "Pickle"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Chapati", "Paneer Butter Masala", "Rice", "Dal"], time: "7:00 PM - 9:00 PM" },
  },
  Tuesday: {
    breakfast: { items: ["Dosa", "Sambar", "Tomato Chutney", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Rice", "Rajma", "Aloo Gobi", "Curd", "Papad"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Roti", "Chicken Curry", "Rice", "Dal"], time: "7:00 PM - 9:00 PM" },
  },
  Wednesday: {
    breakfast: { items: ["Poha", "Banana", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Rice", "Dal", "Bhindi Masala", "Sambar", "Pickle"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Chapati", "Palak Paneer", "Rice", "Dal"], time: "7:00 PM - 9:00 PM" },
  },
  Thursday: {
    breakfast: { items: ["Upma", "Coconut Chutney", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Rice", "Chole", "Jeera Rice", "Raita", "Papad"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Roti", "Fish Curry", "Rice", "Dal"], time: "7:00 PM - 9:00 PM" },
  },
  Friday: {
    breakfast: { items: ["Paratha", "Curd", "Pickle", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Rice", "Dal", "Cauliflower Curry", "Rasam", "Pickle"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Chapati", "Mutton Curry", "Rice", "Dal"], time: "7:00 PM - 9:00 PM" },
  },
  Saturday: {
    breakfast: { items: ["Puri", "Aloo Sabzi", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Biryani", "Raita", "Boiled Egg", "Pickle"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Roti", "Dal Makhani", "Rice", "Salad"], time: "7:00 PM - 9:00 PM" },
  },
  Sunday: {
    breakfast: { items: ["Bread", "Butter", "Jam", "Boiled Egg", "Tea/Coffee"], time: "7:00 AM - 9:00 AM" },
    lunch: { items: ["Rice", "Dal", "Special Vegetable", "Curd", "Sweet"], time: "12:00 PM - 2:00 PM" },
    dinner: { items: ["Chapati", "Chicken Biryani", "Raita", "Pickle"], time: "7:00 PM - 9:00 PM" },
  },
}

const feedbackData = [
  {
    id: "FB001",
    studentName: "Ramesh Kumar",
    meal: "Lunch",
    rating: 4,
    comment: "Food was good, but could use more spice in the curry.",
    date: "2024-06-01",
    status: "reviewed",
  },
  {
    id: "FB002",
    studentName: "Priya Sharma",
    meal: "Dinner",
    rating: 5,
    comment: "Excellent biryani! Really enjoyed it.",
    date: "2024-05-28",
    status: "reviewed",
  },
  {
    id: "FB003",
    studentName: "Arjun Patel",
    meal: "Breakfast",
    rating: 3,
    comment: "Dosa was a bit cold when served.",
    date: "2024-05-25",
    status: "pending",
  },
]

export default function WardenFoodPage() {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showFeedbackDetails, setShowFeedbackDetails] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)

  const { toast } = useToast()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/warden" },
    { icon: Users, label: "Student Management", href: "/dashboard/warden/students" },
    { icon: Building2, label: "Room Management", href: "/dashboard/warden/rooms" },
    { icon: MessageSquare, label: "Complaints", href: "/dashboard/warden/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/warden/leave" },
    { icon: Clock, label: "Attendance", href: "/dashboard/warden/attendance" },
    { icon: Utensils, label: "Food Management", href: "/dashboard/warden/food", active: true },
    { icon: FileText, label: "Reports", href: "/dashboard/warden/reports" },
  ]

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const viewFeedbackDetails = (feedback: any) => {
    setSelectedFeedback(feedback)
    setShowFeedbackDetails(true)
  }

  const averageRating = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackData.length

  return (
    <DashboardLayout menuItems={menuItems} userRole="warden" userName="Warden">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Food Management</h1>
            <p className="text-gray-600">Manage menus and monitor food feedback</p>
          </div>
          <Dialog open={showAddMenu} onOpenChange={setShowAddMenu}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Update Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Update Menu</DialogTitle>
                <DialogDescription>Add or modify menu items for a specific day and meal</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="menu-day">Day</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(weeklyMenu).map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menu-meal">Meal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-items">Menu Items</Label>
                  <Textarea id="menu-items" placeholder="Enter menu items (one per line)" rows={5} />
                </div>
                <Button className="w-full">Update Menu</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Utensils className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold">{feedbackData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold">{feedbackData.filter((f) => f.status === "pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold">21</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weekly-menu">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly-menu">Weekly Menu</TabsTrigger>
            <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition & Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly-menu" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Menu Management</CardTitle>
                <CardDescription>View and manage the weekly food menu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(weeklyMenu).map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(weeklyMenu[selectedDay as keyof typeof weeklyMenu]).map(([meal, details]) => (
                    <Card key={meal}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg capitalize">{meal}</CardTitle>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{details.time}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {details.items.map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Feedback</CardTitle>
                <CardDescription>Review and respond to student food feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackData.map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium">{feedback.studentName}</h4>
                            <Badge variant="outline">{feedback.meal}</Badge>
                            {feedback.status === "pending" && (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(feedback.rating)}
                            <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">"{feedback.comment}"</p>
                          <p className="text-xs text-gray-500">Submitted on {feedback.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => viewFeedbackDetails(feedback)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {feedback.status === "pending" && <Button size="sm">Respond</Button>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Guidelines</CardTitle>
                  <CardDescription>Daily nutrition targets for students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Daily Nutrition Goals</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">2000-2500 kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">60-80g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohydrates:</span>
                        <span className="font-medium">250-300g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber:</span>
                        <span className="font-medium">25-30g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">65-85g</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Special Dietary Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Vegetarian Students:</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vegan Students:</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gluten-Free:</span>
                        <span className="font-medium">2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diabetic:</span>
                        <span className="font-medium">3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Menu Planning</CardTitle>
                  <CardDescription>Tools for effective menu planning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">This Week's Focus</h4>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Increase protein content in breakfast</li>
                      <li>Add more seasonal vegetables</li>
                      <li>Reduce oil usage in cooking</li>
                      <li>Include more whole grains</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Upcoming Events</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Festival Special Menu:</span>
                        <span className="font-medium">June 15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health Week:</span>
                        <span className="font-medium">June 20-26</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nutrition Workshop:</span>
                        <span className="font-medium">June 30</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Inventory Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rice:</span>
                        <Badge className="bg-green-100 text-green-800">Good Stock</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Vegetables:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pulses:</span>
                        <Badge className="bg-green-100 text-green-800">Good Stock</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Feedback Details Dialog */}
        <Dialog open={showFeedbackDetails} onOpenChange={setShowFeedbackDetails}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>Review and respond to student feedback</DialogDescription>
            </DialogHeader>

            {selectedFeedback && (
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-sm text-gray-600">{selectedFeedback.studentName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Meal</p>
                    <p className="text-sm text-gray-600">{selectedFeedback.meal}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-600">{selectedFeedback.date}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Rating</p>
                  <div className="flex items-center space-x-2">
                    {renderStars(selectedFeedback.rating)}
                    <span className="text-sm text-gray-600">({selectedFeedback.rating}/5)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Comment</p>
                  <p className="text-sm text-gray-600">"{selectedFeedback.comment}"</p>
                </div>

                {selectedFeedback.status === "pending" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="response">Management Response</Label>
                      <Textarea id="response" placeholder="Provide your response to this feedback..." rows={3} />
                    </div>
                    <Button className="w-full">Send Response</Button>
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
