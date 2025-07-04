"use client"

import React from "react"

// Event system for real-time updates
class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    }
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data))
    }
  }
}

export const eventBus = new EventEmitter()

// Student interface
export interface Student {
  id: string
  sin: string
  name: string
  email: string
  rollNumber: string
  phone: string
  dob: string
  gender: string
  course: string
  year: number
  hostel: string
  roomNumber: string
  feeStatus: string
  attendance: number
  joinDate: string
  guardianName: string
  guardianPhone: string
  address: string
  emergencyContact: string
  lastPaymentDate: string | null
  paymentHistory: any[]
  profileImage?: string
  bloodGroup?: string
  hobbies?: string[]
  hometown?: string
  password?: string
}

// Virtual Storage Class
class VirtualStorage {
  private data: { [key: string]: any } = {}
  private subscribers: { [key: string]: Function[] } = {}

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize with comprehensive mock data
    this.data = {
      students: [
        {
          id: "STU001",
          sin: "SIN230001",
          name: "Ramesh Kumar",
          email: "ramesh.kumar@student.shanmugha.edu",
          rollNumber: "21CS001",
          phone: "+91 9876543210",
          dob: "2003-05-15",
          gender: "Male",
          course: "B.Tech Computer Science",
          year: 2,
          hostel: "Engineering",
          roomNumber: "Room-101",
          feeStatus: "Paid",
          attendance: 95,
          joinDate: "2023-07-15",
          guardianName: "Rajesh Kumar",
          guardianPhone: "+91 9876543211",
          address: "123 Main Street, Chennai, Tamil Nadu",
          emergencyContact: "+91 9876543211",
          lastPaymentDate: "2024-01-15",
          bloodGroup: "B+",
          hobbies: ["Cricket", "Reading", "Programming"],
          hometown: "Chennai",
          password: "password123",
          paymentHistory: [
            {
              id: "PAY001",
              amount: 45000,
              method: "UPI",
              date: "2024-01-15",
              remarks: "Semester fee payment",
              receivedBy: "Admin",
            },
          ],
        },
        {
          id: "STU002",
          sin: "SIN230002",
          name: "Arjun Patel",
          email: "arjun.patel@student.shanmugha.edu",
          rollNumber: "21CS002",
          phone: "+91 9876543214",
          dob: "2002-12-22",
          gender: "Male",
          course: "B.Tech Mechanical",
          year: 2,
          hostel: "Engineering",
          roomNumber: "Room-101", // Same room as Ramesh
          feeStatus: "Pending",
          attendance: 88,
          joinDate: "2023-07-15",
          guardianName: "Suresh Patel",
          guardianPhone: "+91 9876543215",
          address: "456 Park Avenue, Mumbai, Maharashtra",
          emergencyContact: "+91 9876543215",
          lastPaymentDate: null,
          bloodGroup: "A+",
          hobbies: ["Football", "Music", "Photography"],
          hometown: "Mumbai",
          password: "password123",
          paymentHistory: [],
        },
        {
          id: "STU003",
          sin: "SIN230003",
          name: "Vikram Singh",
          email: "vikram.singh@student.shanmugha.edu",
          rollNumber: "21CS003",
          phone: "+91 9876543218",
          dob: "2003-01-10",
          gender: "Male",
          course: "B.Tech Electronics",
          year: 2,
          hostel: "Engineering",
          roomNumber: "Room-101", // Same room as Ramesh and Arjun
          feeStatus: "Paid",
          attendance: 92,
          joinDate: "2023-07-15",
          guardianName: "Rajesh Singh",
          guardianPhone: "+91 9876543219",
          address: "789 Civil Lines, Delhi",
          emergencyContact: "+91 9876543219",
          lastPaymentDate: "2024-01-20",
          bloodGroup: "O+",
          hobbies: ["Basketball", "Gaming", "Coding"],
          hometown: "Delhi",
          password: "password123",
          paymentHistory: [
            {
              id: "PAY004",
              amount: 45000,
              method: "Bank Transfer",
              date: "2024-01-20",
              remarks: "Semester fee payment",
              receivedBy: "Admin",
            },
          ],
        },
        {
          id: "STU004",
          sin: "SIN230004",
          name: "Priya Sharma",
          email: "priya.sharma@student.shanmugha.edu",
          rollNumber: "21BA001",
          phone: "+91 9876543212",
          dob: "2003-08-01",
          gender: "Female",
          course: "B.A. English",
          year: 2,
          hostel: "Arts",
          roomNumber: "Room-201",
          feeStatus: "Paid",
          attendance: 92,
          joinDate: "2023-07-15",
          guardianName: "Suresh Sharma",
          guardianPhone: "+91 9876543213",
          address: "789 Temple Street, Chennai, Tamil Nadu",
          emergencyContact: "+91 9876543213",
          lastPaymentDate: "2024-01-15",
          bloodGroup: "AB+",
          hobbies: ["Dancing", "Reading", "Painting"],
          hometown: "Chennai",
          password: "password123",
          paymentHistory: [
            {
              id: "PAY002",
              amount: 35000,
              method: "Cash",
              date: "2024-01-15",
              remarks: "Semester fee payment",
              receivedBy: "Warden",
            },
          ],
        },
        {
          id: "STU005",
          sin: "SIN230005",
          name: "Neha Verma",
          email: "neha.verma@student.shanmugha.edu",
          rollNumber: "21BA002",
          phone: "+91 9876543216",
          dob: "2002-03-15",
          gender: "Female",
          course: "B.A. History",
          year: 2,
          hostel: "Arts",
          roomNumber: "Room-201", // Same room as Priya
          feeStatus: "Paid",
          attendance: 90,
          joinDate: "2023-07-15",
          guardianName: "Rajesh Verma",
          guardianPhone: "+91 9876543217",
          address: "321 College Road, Pune, Maharashtra",
          emergencyContact: "+91 9876543217",
          lastPaymentDate: "2024-01-10",
          bloodGroup: "B-",
          hobbies: ["Singing", "Writing", "Yoga"],
          hometown: "Pune",
          password: "password123",
          paymentHistory: [
            {
              id: "PAY003",
              amount: 35000,
              method: "UPI",
              date: "2024-01-10",
              remarks: "Semester fee payment",
              receivedBy: "Admin",
            },
          ],
        },
      ],
      rooms: [
        {
          id: "ROOM001",
          roomNumber: "Room-101",
          hostel: "Engineering",
          floor: 1,
          capacity: 4,
          occupied: 3,
          status: "Available",
          condition: "Good",
          amenities: ["AC", "WiFi", "Study Table", "Wardrobe", "Attached Bathroom"],
          lastMaintenance: "2024-01-15",
          monthlyRent: 8000,
          students: ["Ramesh Kumar", "Arjun Patel", "Vikram Singh"],
          type: "AC",
          hasRestroom: true,
          cleanliness: "Clean",
          inventory: {
            cots: 4,
            tables: 4,
            chairs: 4,
            wardrobes: 2,
            fans: 2,
          },
        },
        {
          id: "ROOM002",
          roomNumber: "Room-201",
          hostel: "Arts",
          floor: 2,
          capacity: 4,
          occupied: 2,
          status: "Available",
          condition: "Excellent",
          amenities: ["AC", "WiFi", "Study Table", "Wardrobe", "Balcony", "Attached Bathroom"],
          lastMaintenance: "2024-02-01",
          monthlyRent: 8500,
          students: ["Priya Sharma", "Neha Verma"],
          type: "AC",
          hasRestroom: true,
          cleanliness: "Clean",
          inventory: {
            cots: 4,
            tables: 4,
            chairs: 4,
            wardrobes: 2,
            fans: 2,
          },
        },
      ],
      staff: [],
      complaints: [],
      leaveApplications: [],
      attendance: {},
      healthRecords: [],
      foodMenu: {},
      foodFeedback: [],
      notifications: [
        {
          id: "NOTIF001",
          title: "Welcome to Hostel Management System",
          message: "Your account has been successfully created. Explore all the features available.",
          type: "general",
          priority: "low",
          timestamp: "2024-06-01T08:00:00Z",
          read: false,
          targetRoles: ["student"],
        },
        {
          id: "NOTIF002",
          title: "Fee Payment Reminder",
          message: "Your semester fee payment is due in 5 days. Please make the payment to avoid late fees.",
          type: "fee",
          priority: "high",
          timestamp: "2024-06-02T10:00:00Z",
          read: false,
          targetRoles: ["student"],
        },
        {
          id: "NOTIF003",
          title: "Room Maintenance Schedule",
          message: "Room maintenance is scheduled for this weekend. Please cooperate with the maintenance team.",
          type: "maintenance",
          priority: "medium",
          timestamp: "2024-06-03T09:00:00Z",
          read: false,
          targetRoles: ["student"],
        },
        {
          id: "NOTIF004",
          title: "New Food Menu Available",
          message: "Check out the updated food menu for this week. Your feedback is valuable to us.",
          type: "food",
          priority: "low",
          timestamp: "2024-06-04T07:00:00Z",
          read: false,
          targetRoles: ["student"],
        },
      ],
    }
  }

  // Subscribe to data changes
  subscribe(key: string, callback: Function) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = []
    }
    this.subscribers[key].push(callback)
  }

  // Unsubscribe from data changes
  unsubscribe(key: string, callback: Function) {
    if (this.subscribers[key]) {
      this.subscribers[key] = this.subscribers[key].filter((cb) => cb !== callback)
    }
  }

  // Notify subscribers of changes
  private notify(key: string, data: any) {
    if (this.subscribers[key]) {
      this.subscribers[key].forEach((callback) => callback(data))
    }
    eventBus.emit(`data:${key}`, data)
  }

  // Get data
  get(key: string) {
    return this.data[key] || []
  }

  // Set data
  set(key: string, value: any) {
    this.data[key] = value
    this.notify(key, value)
  }

  // Add item to array
  add(key: string, item: any) {
    if (!this.data[key]) {
      this.data[key] = []
    }
    this.data[key].push(item)
    this.notify(key, this.data[key])
  }

  // Update item in array
  update(key: string, id: string, updates: any) {
    if (!this.data[key]) return

    const index = this.data[key].findIndex((item: any) => item.id === id)
    if (index !== -1) {
      this.data[key][index] = { ...this.data[key][index], ...updates }
      this.notify(key, this.data[key])
    }
  }

  // Delete item from array
  delete(key: string, id: string) {
    if (!this.data[key]) return

    this.data[key] = this.data[key].filter((item: any) => item.id !== id)
    this.notify(key, this.data[key])
  }

  // Get student by email
  getStudentByEmail(email: string) {
    const students = this.get("students") || []
    return students.find((student: any) => student.email === email)
  }

  // Get roommates for a student
  getRoommates(studentEmail: string) {
    const student = this.getStudentByEmail(studentEmail)
    if (!student) return []

    const students = this.get("students") || []
    return students.filter((s: any) => s.roomNumber === student.roomNumber && s.email !== studentEmail)
  }

  // Get room by room number
  getRoomByNumber(roomNumber: string) {
    const rooms = this.get("rooms") || []
    return rooms.find((room: any) => room.roomNumber === roomNumber)
  }

  // Register new student
  registerStudent(studentData: any) {
    const newStudent = {
      ...studentData,
      id: `STU${Date.now()}`,
      sin: `SIN${Date.now()}`,
      joinDate: new Date().toISOString().split("T")[0],
      attendance: 100,
      paymentHistory: [],
      feeStatus: "Pending",
      lastPaymentDate: null,
    }
    this.add("students", newStudent)
    return newStudent
  }

  // Authenticate student
  authenticateStudent(email: string, password: string) {
    const students = this.get("students") || []
    return students.find((student: any) => student.email === email && student.password === password)
  }
}

// Create singleton instance
export const virtualStorage = new VirtualStorage()

// Helper hooks for React components
export const useVirtualStorage = (key: string) => {
  const [data, setData] = React.useState(virtualStorage.get(key))

  React.useEffect(() => {
    const callback = (newData: any) => setData(newData)
    virtualStorage.subscribe(key, callback)

    return () => virtualStorage.unsubscribe(key, callback)
  }, [key])

  return data
}

// Real-time data operations
export const dataOperations = {
  // Student operations
  registerStudent: (studentData: any) => {
    return virtualStorage.registerStudent(studentData)
  },

  authenticateStudent: (email: string, password: string) => {
    return virtualStorage.authenticateStudent(email, password)
  },

  getStudentByEmail: (email: string) => {
    return virtualStorage.getStudentByEmail(email)
  },

  getRoommates: (studentEmail: string) => {
    return virtualStorage.getRoommates(studentEmail)
  },

  getRoomByNumber: (roomNumber: string) => {
    return virtualStorage.getRoomByNumber(roomNumber)
  },

  addStudent: (student: any) => {
    const newStudent = {
      ...student,
      id: `STU${Date.now()}`,
      sin: `SIN${Date.now()}`,
      joinDate: new Date().toISOString().split("T")[0],
      attendance: 100,
      paymentHistory: [],
    }
    virtualStorage.add("students", newStudent)
    return newStudent
  },

  updateStudent: (id: string, updates: any) => {
    virtualStorage.update("students", id, updates)
  },

  deleteStudent: (id: string) => {
    virtualStorage.delete("students", id)
  },

  // Complaint operations
  addComplaint: (complaint: any) => {
    const newComplaint = {
      ...complaint,
      id: `COMP${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    virtualStorage.add("complaints", newComplaint)
    return newComplaint
  },

  updateComplaintStatus: (id: string, status: string, response?: string) => {
    const updates: any = {
      status,
      ...(response && { adminResponse: response }),
      ...(status === "resolved" && { resolvedAt: new Date().toISOString() }),
    }
    virtualStorage.update("complaints", id, updates)
  },

  // Leave application operations
  addLeaveApplication: (application: any) => {
    const newApplication = {
      ...application,
      id: `LEAVE${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "pending",
    }
    virtualStorage.add("leaveApplications", newApplication)
    return newApplication
  },

  updateLeaveStatus: (id: string, status: string, remarks?: string, reviewedBy?: string) => {
    const updates = {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewedBy || "Admin",
      ...(remarks && { adminRemarks: remarks }),
    }
    virtualStorage.update("leaveApplications", id, updates)
  },

  // Fee operations
  recordPayment: (studentId: string, amount: number, method: string, remarks?: string) => {
    const students = virtualStorage.get("students")
    const student = students.find((s: any) => s.id === studentId)

    if (student) {
      const payment = {
        id: `PAY${Date.now()}`,
        amount,
        method,
        date: new Date().toISOString(),
        remarks: remarks || "",
        receivedBy: "Admin",
      }

      const updates = {
        feeStatus: "Paid",
        lastPaymentDate: new Date().toISOString(),
        paymentHistory: [...(student.paymentHistory || []), payment],
      }

      virtualStorage.update("students", studentId, updates)
    }
  },

  // Attendance operations
  markAttendance: (date: string, attendanceData: { [studentId: string]: boolean }) => {
    const currentAttendance = virtualStorage.get("attendance") || {}
    currentAttendance[date] = attendanceData
    virtualStorage.set("attendance", currentAttendance)
  },

  // Health record operations
  addHealthRecord: (record: any) => {
    const newRecord = {
      ...record,
      id: `HEALTH${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    }
    virtualStorage.add("healthRecords", newRecord)
    return newRecord
  },

  // Food feedback operations
  addFoodFeedback: (feedback: any) => {
    const newFeedback = {
      ...feedback,
      id: `FOOD${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }
    virtualStorage.add("foodFeedback", newFeedback)
    return newFeedback
  },

  // Notification operations
  markNotificationRead: (notificationId: string) => {
    virtualStorage.update("notifications", notificationId, { read: true })
  },

  getNotificationsForRole: (role: string) => {
    const notifications = virtualStorage.get("notifications") || []
    return notifications
      .filter((notif: any) => notif.targetRoles?.includes(role) || notif.targetRoles?.includes("all"))
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  // Room operations
  addRoom: (room: any) => {
    const newRoom = {
      ...room,
      id: `ROOM${Date.now()}`,
    }
    virtualStorage.add("rooms", newRoom)
    return newRoom
  },

  updateRoom: (id: string, updates: any) => {
    virtualStorage.update("rooms", id, updates)
  },

  // Staff operations
  addStaff: (staff: any) => {
    const newStaff = {
      ...staff,
      id: `STF${Date.now()}`,
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
    }
    virtualStorage.add("staff", newStaff)
    return newStaff
  },

  updateStaff: (id: string, updates: any) => {
    virtualStorage.update("staff", id, updates)
  },

  deleteStaff: (id: string) => {
    virtualStorage.delete("staff", id)
  },
}

export default virtualStorage
