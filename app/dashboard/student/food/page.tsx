"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { getStudentData } from "@/lib/mock-data"
import { Home, MessageSquare, Star, Utensils, User, Users, Clock, ChefHat } from "lucide-react"

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

const feedbackHistory = [
  {
    id: "FB001",
    date: "2024-06-01",
    meal: "Lunch",
    rating: 4,
    comment: "Food was good, but could use more spice in the curry.",
    response: "Thank you for your feedback. We'll adjust the spice level.",
  },
  {
    id: "FB002",
    date: "2024-05-28",
    meal: "Dinner",
    rating: 5,
    comment: "Excellent biryani! Really enjoyed it.",
    response: "Glad you enjoyed it! We'll continue to maintain the quality.",
  },
  {
    id: "FB003",
    date: "2024-05-25",
    meal: "Breakfast",
    rating: 3,
    comment: "Dosa was a bit cold when served.",
    response: "We apologize for the inconvenience. We'll ensure hot food service.",
  },
]

export default function FoodMenuPage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [feedbackMeal, setFeedbackMeal] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)
    }

    // Set current day as default
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    if (weeklyMenu[today as keyof typeof weeklyMenu]) {
      setSelectedDay(today)
    }
  }, [])

  const handleSubmitFeedback = () => {
    if (!feedbackMeal || rating === 0 || !comment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and provide a rating.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve our service.",
    })

    // Reset form
    setFeedbackMeal("")
    setRating(0)
    setComment("")
    setShowFeedbackForm(false)
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
    { icon: Users, label: "Fee Management", href: "/dashboard/student/fees" },
    { icon: Users, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Users, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Utensils, label: "Food Menu", href: "/dashboard/student/food", active: true },
    { icon: Users, label: "Notifications", href: "/dashboard/student/notifications" },
  ]

  if (!studentData) {
    return <div>Loading...</div>
  }

  const todayMenu = weeklyMenu[selectedDay as keyof typeof weeklyMenu]

  return (
    <DashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Food Menu & Feedback</h1>
            <p className="text-gray-600">View daily menus and share your dining experience</p>
          </div>
          <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Give Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Food Feedback</DialogTitle>
                <DialogDescription>Share your experience with today's meals</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="meal">Meal *</Label>
                  <Select value={feedbackMeal} onValueChange={setFeedbackMeal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex items-center space-x-2">
                    {renderStars(rating, true, setRating)}
                    <span className="text-sm text-gray-600">
                      {rating === 0 ? "Rate your experience" : `${rating} star${rating > 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comments *</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts about the food quality, taste, service..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSubmitFeedback} className="w-full">
                  Submit Feedback
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Menu Highlight */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5 text-orange-600" />
              <span>Today's Menu - {selectedDay}</span>
            </CardTitle>
            <CardDescription>Fresh meals prepared with care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <h4 className="font-semibold text-orange-800">Breakfast</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{todayMenu.breakfast.time}</p>
                <ul className="text-sm space-y-1">
                  {todayMenu.breakfast.items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-green-500" />
                  <h4 className="font-semibold text-green-800">Lunch</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{todayMenu.lunch.time}</p>
                <ul className="text-sm space-y-1">
                  {todayMenu.lunch.items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <h4 className="font-semibold text-purple-800">Dinner</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{todayMenu.dinner.time}</p>
                <ul className="text-sm space-y-1">
                  {todayMenu.dinner.items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly-menu">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly-menu">Weekly Menu</TabsTrigger>
            <TabsTrigger value="feedback-history">My Feedback</TabsTrigger>
            <TabsTrigger value="dining-info">Dining Info</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly-menu" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Menu</CardTitle>
                <CardDescription>Complete menu for the week</CardDescription>
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
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-orange-600">Breakfast</CardTitle>
                      <CardDescription>{todayMenu.breakfast.time}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {todayMenu.breakfast.items.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-600">Lunch</CardTitle>
                      <CardDescription>{todayMenu.lunch.time}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {todayMenu.lunch.items.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-purple-600">Dinner</CardTitle>
                      <CardDescription>{todayMenu.dinner.time}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {todayMenu.dinner.items.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback-history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Feedback History</CardTitle>
                <CardDescription>Your previous feedback and responses</CardDescription>
              </CardHeader>
              <CardContent>
                {feedbackHistory.length > 0 ? (
                  <div className="space-y-4">
                    {feedbackHistory.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{feedback.meal}</h4>
                            <p className="text-sm text-gray-500">{feedback.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {renderStars(feedback.rating)}
                            <Badge variant="outline">{feedback.rating}/5</Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Your Comment:</p>
                            <p className="text-sm text-gray-600 italic">"{feedback.comment}"</p>
                          </div>

                          {feedback.response && (
                            <div className="p-3 bg-blue-50 rounded-md">
                              <p className="text-sm font-medium text-blue-800">Management Response:</p>
                              <p className="text-sm text-blue-600">"{feedback.response}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Feedback Yet</h3>
                    <p>Share your dining experience to help us improve our service.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dining-info" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dining Hall Information</CardTitle>
                  <CardDescription>Important details about meal service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Meal Timings</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Breakfast:</span>
                        <span>7:00 AM - 9:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lunch:</span>
                        <span>12:00 PM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dinner:</span>
                        <span>7:00 PM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Dining Hall Rules</h4>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Maintain cleanliness in the dining area</li>
                      <li>Return plates and utensils after meals</li>
                      <li>No food wastage policy</li>
                      <li>Dress code: Decent attire required</li>
                      <li>Mobile phones on silent mode</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Special Dietary Requirements</h4>
                    <p className="text-sm text-gray-600">
                      If you have any dietary restrictions or allergies, please contact the mess committee or warden to
                      arrange alternative meals.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Information</CardTitle>
                  <CardDescription>Healthy eating guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Balanced Diet</h4>
                    <p className="text-sm text-green-600">
                      Our meals are planned to provide balanced nutrition with adequate proteins, carbohydrates,
                      vitamins, and minerals.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Daily Nutrition Goals</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span>2000-2500 kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span>60-80g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohydrates:</span>
                        <span>250-300g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber:</span>
                        <span>25-30g</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Mess Manager:</span>
                        <span>+91 9876543220</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mess Committee:</span>
                        <span>mess@shanmugha.edu</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nutritionist:</span>
                        <span>+91 9876543221</span>
                      </div>
                    </div>
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
