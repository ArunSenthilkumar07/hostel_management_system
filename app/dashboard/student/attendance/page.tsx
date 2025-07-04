"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getStudentData } from "@/lib/mock-data"
import { CheckCircle, Clock, Home, User, Users, X } from "lucide-react"

// Helper function to generate calendar data
const generateCalendarData = (month: number, year: number, attendance: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  // Generate days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Add empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDay }, (_, i) => null)

  // Combine empty cells and days
  const calendarDays = [...emptyCells, ...days]

  // Generate attendance data (random for demo purposes)
  const attendanceData: Record<number, boolean> = {}

  // Set a fixed seed for consistent random generation
  const seed = attendance / 100

  for (let i = 1; i <= daysInMonth; i++) {
    // Generate deterministic "random" attendance based on the day and attendance percentage
    const isPresent = Math.sin(i * seed * 10) > 1 - attendance / 100
    attendanceData[i] = isPresent
  }

  return { calendarDays, attendanceData }
}

export default function AttendancePage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [calendarData, setCalendarData] = useState<any>(null)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      const data = getStudentData(email)
      setStudentData(data)

      if (data) {
        setCalendarData(generateCalendarData(currentMonth, currentYear, data.attendance))
      }
    }
  }, [currentMonth, currentYear])

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/student" },
    { icon: User, label: "Profile", href: "/dashboard/student/profile" },
    { icon: Home, label: "Room Info", href: "/dashboard/student/room" },
    { icon: Users, label: "Complaints", href: "/dashboard/student/complaints" },
    { icon: Users, label: "Leave Applications", href: "/dashboard/student/leave" },
    { icon: Users, label: "Fee Management", href: "/dashboard/student/fees" },
    { icon: Clock, label: "Attendance", href: "/dashboard/student/attendance", active: true },
    { icon: Users, label: "Health Records", href: "/dashboard/student/health" },
    { icon: Users, label: "Food Menu", href: "/dashboard/student/food" },
    { icon: Users, label: "Notifications", href: "/dashboard/student/notifications" },
  ]

  if (!studentData || !calendarData) {
    return <div>Loading...</div>
  }

  // Calculate attendance statistics
  const presentDays = Object.values(calendarData.attendanceData).filter(Boolean).length
  const totalDays = Object.keys(calendarData.attendanceData).length
  const attendancePercentage = (presentDays / totalDays) * 100

  // Calculate streak (consecutive present days)
  let currentStreak = 0
  let maxStreak = 0

  for (let i = 1; i <= totalDays; i++) {
    if (calendarData.attendanceData[i]) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return (
    <DashboardLayout menuItems={menuItems} userRole="student" userName={studentData.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance Tracker</h1>
          <p className="text-gray-600">Monitor your attendance records and statistics</p>
        </div>

        {/* Attendance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{studentData.attendance}%</div>
                <p className="text-gray-600 mb-4">Overall Attendance</p>
                <Progress value={studentData.attendance} className="h-2 w-full" />
                <div className="mt-4 text-center">
                  {studentData.attendance >= 90 ? (
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  ) : studentData.attendance >= 75 ? (
                    <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{presentDays}</div>
                <p className="text-gray-600 mb-1">Present Days</p>
                <p className="text-sm text-gray-500">out of {totalDays} days this month</p>
                <div className="mt-4 w-full">
                  <Progress value={(presentDays / totalDays) * 100} className="h-2" />
                </div>
                <p className="mt-2 text-sm text-gray-600">{attendancePercentage.toFixed(1)}% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">{maxStreak}</div>
                <p className="text-gray-600 mb-1">Best Streak</p>
                <p className="text-sm text-gray-500">consecutive days present</p>
                <div className="mt-4 flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-6 rounded-full ${i < maxStreak ? "bg-purple-500" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Attendance Calendar</CardTitle>
              <div className="flex items-center space-x-4">
                <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <span className="font-medium">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            <CardDescription>View your daily attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarData.calendarDays.map((day: number | null, index: number) => (
                <div
                  key={index}
                  className={`
                    p-2 text-center min-h-[60px] rounded-md
                    ${day ? "border" : ""}
                    ${day && calendarData.attendanceData[day] ? "bg-green-50 border-green-200" : ""}
                    ${day && !calendarData.attendanceData[day] ? "bg-red-50 border-red-200" : ""}
                  `}
                >
                  {day && (
                    <>
                      <div className="font-medium">{day}</div>
                      {calendarData.attendanceData[day] ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mx-auto mt-1" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Monthly attendance records for the current semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["January", "February", "March", "April", "May", "June"].map((month, index) => {
                // Generate random but consistent attendance percentages for demo
                const seed = (studentData.attendance / 100) * (index + 1)
                const percentage = Math.min(
                  100,
                  Math.max(70, Math.floor(studentData.attendance + Math.sin(seed * 10) * 5)),
                )

                return (
                  <div key={month} className="flex items-center space-x-4">
                    <div className="w-24 font-medium">{month}</div>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <div className="w-12 text-right font-medium">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Policy</CardTitle>
            <CardDescription>Important information about attendance requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Minimum Requirements</h3>
                <p className="text-sm text-gray-600">
                  Students are required to maintain a minimum of 75% attendance in all classes and hostel activities.
                  Failure to meet this requirement may result in disciplinary action or academic penalties.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Attendance Marking</h3>
                <p className="text-sm text-gray-600">
                  Attendance is marked twice daily - morning (8:00 AM) and evening (7:00 PM). Students must be present
                  for both sessions to be marked present for the day.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Leave Policy</h3>
                <p className="text-sm text-gray-600">
                  Approved leaves are marked as excused absences and do not count against your attendance percentage.
                  Medical leaves require proper documentation from a registered medical practitioner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
