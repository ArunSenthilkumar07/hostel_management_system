// Mock data for the hostel management system

export interface Student {
  sin: string
  name: string
  email: string
  dob: string
  gender: "Male" | "Female"
  course: string
  hostel: string
  roomNo: string
  phone: string
  emergencyContact: string
  joinDate: string
  feeStatus: "Paid" | "Pending" | "Overdue"
  attendance: number
}

export interface Complaint {
  id: string
  studentSin: string
  studentName: string
  title: string
  description: string
  category: string
  priority: "Low" | "Medium" | "High"
  status: "pending" | "in-progress" | "resolved"
  submittedDate: string
  assignedTo?: string
}

export interface LeaveApplication {
  id: string
  studentSin: string
  studentName: string
  studentId: string
  roomNumber: string
  type: "personal" | "medical" | "academic" | "emergency"
  reason: string
  startDate: string
  endDate: string
  emergencyContact: string
  parentContact: string
  status: "pending" | "recommended" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  adminRemarks?: string
  jointWardenRemarks?: string
}

export interface Room {
  roomNo: string
  type: "AC" | "Non-AC"
  capacity: number
  hasRestroom: boolean
  hostel: string
  currentOccupancy: number
  cleanliness: "Clean" | "Needs Attention" | "Dirty"
  inventory: {
    cots: number
    tables: number
    chairs: number
    wardrobes: number
    fans: number
  }
}

// Sample students data - 5 per college
const students: Student[] = [
  // Engineering Students - Boys
  {
    sin: "SIN230001",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@student.shanmugha.edu",
    dob: "10-05-2003",
    gender: "Male",
    course: "B.Tech Computer Science",
    hostel: "Engineering",
    roomNo: "Room-101",
    phone: "9876543210",
    emergencyContact: "9876543211",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 95,
  },
  {
    sin: "SIN230003",
    name: "Arjun Patel",
    email: "arjun.patel@student.shanmugha.edu",
    dob: "22-12-2002",
    gender: "Male",
    course: "B.Tech Mechanical",
    hostel: "Engineering",
    roomNo: "Room-101", // Same room as Ramesh
    phone: "9876543214",
    emergencyContact: "9876543215",
    joinDate: "2023-07-15",
    feeStatus: "Pending",
    attendance: 88,
  },
  // Girls Students
  {
    sin: "SIN230002",
    name: "Priya Sharma",
    email: "priya.sharma@student.shanmugha.edu",
    dob: "15-08-2003",
    gender: "Female",
    course: "B.Tech Electronics",
    hostel: "Engineering",
    roomNo: "Room-102",
    phone: "9876543212",
    emergencyContact: "9876543213",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 92,
  },
  {
    sin: "SIN230004",
    name: "Sneha Reddy",
    email: "sneha.reddy@student.shanmugha.edu",
    dob: "03-09-2003",
    gender: "Female",
    course: "B.Tech Civil",
    hostel: "Engineering",
    roomNo: "Room-102", // Same room as Priya
    phone: "9876543216",
    emergencyContact: "9876543217",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 96,
  },
  {
    sin: "SIN230005",
    name: "Vikram Singh",
    email: "vikram.singh@student.shanmugha.edu",
    dob: "18-06-2003",
    gender: "Male",
    course: "B.Tech Electrical",
    hostel: "Engineering",
    roomNo: "Room-105",
    phone: "9876543218",
    emergencyContact: "9876543219",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 90,
  },

  // Pharmacy Students
  {
    sin: "SIN230006",
    name: "Anita Patel",
    email: "anita.patel@student.shanmugha.edu",
    dob: "25-04-2003",
    gender: "Female",
    course: "B.Pharm",
    hostel: "Pharmacy",
    roomNo: "Room-201",
    phone: "9876543220",
    emergencyContact: "9876543221",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 94,
  },
  {
    sin: "SIN230007",
    name: "Rohit Gupta",
    email: "rohit.gupta@student.shanmugha.edu",
    dob: "12-11-2002",
    gender: "Male",
    course: "B.Pharm",
    hostel: "Pharmacy",
    roomNo: "Room-202",
    phone: "9876543222",
    emergencyContact: "9876543223",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 91,
  },
  {
    sin: "SIN230008",
    name: "Kavya Nair",
    email: "kavya.nair@student.shanmugha.edu",
    dob: "07-01-2003",
    gender: "Female",
    course: "B.Pharm",
    hostel: "Pharmacy",
    roomNo: "Room-203",
    phone: "9876543224",
    emergencyContact: "9876543225",
    joinDate: "2023-07-15",
    feeStatus: "Overdue",
    attendance: 87,
  },
  {
    sin: "SIN230009",
    name: "Arun Kumar",
    email: "arun.kumar@student.shanmugha.edu",
    dob: "30-07-2003",
    gender: "Male",
    course: "B.Pharm",
    hostel: "Pharmacy",
    roomNo: "Room-204",
    phone: "9876543226",
    emergencyContact: "9876543227",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 93,
  },
  {
    sin: "SIN230010",
    name: "Meera Joshi",
    email: "meera.joshi@student.shanmugha.edu",
    dob: "14-03-2003",
    gender: "Female",
    course: "B.Pharm",
    hostel: "Pharmacy",
    roomNo: "Room-205",
    phone: "9876543228",
    emergencyContact: "9876543229",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 89,
  },

  // Allied Science Students
  {
    sin: "SIN230011",
    name: "Deepak Raj",
    email: "deepak.raj@student.shanmugha.edu",
    dob: "20-02-2003",
    gender: "Male",
    course: "B.Sc Biotechnology",
    hostel: "Allied Science",
    roomNo: "Room-301",
    phone: "9876543230",
    emergencyContact: "9876543231",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 92,
  },
  {
    sin: "SIN230012",
    name: "Pooja Iyer",
    email: "pooja.iyer@student.shanmugha.edu",
    dob: "05-10-2003",
    gender: "Female",
    course: "B.Sc Microbiology",
    hostel: "Allied Science",
    roomNo: "Room-302",
    phone: "9876543232",
    emergencyContact: "9876543233",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 95,
  },
  {
    sin: "SIN230013",
    name: "Karthik Menon",
    email: "karthik.menon@student.shanmugha.edu",
    dob: "28-12-2002",
    gender: "Male",
    course: "B.Sc Biochemistry",
    hostel: "Allied Science",
    roomNo: "Room-303",
    phone: "9876543234",
    emergencyContact: "9876543235",
    joinDate: "2023-07-15",
    feeStatus: "Pending",
    attendance: 88,
  },
  {
    sin: "SIN230014",
    name: "Divya Krishnan",
    email: "divya.krishnan@student.shanmugha.edu",
    dob: "16-06-2003",
    gender: "Female",
    course: "B.Sc Medical Lab Technology",
    hostel: "Allied Science",
    roomNo: "Room-304",
    phone: "9876543236",
    emergencyContact: "9876543237",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 97,
  },
  {
    sin: "SIN230015",
    name: "Suresh Babu",
    email: "suresh.babu@student.shanmugha.edu",
    dob: "09-04-2003",
    gender: "Male",
    course: "B.Sc Radiology",
    hostel: "Allied Science",
    roomNo: "Room-305",
    phone: "9876543238",
    emergencyContact: "9876543239",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 91,
  },

  // Nursing Students (Girls Only)
  {
    sin: "SIN230016",
    name: "Lakshmi Devi",
    email: "lakshmi.devi@student.shanmugha.edu",
    dob: "11-08-2003",
    gender: "Female",
    course: "B.Sc Nursing",
    hostel: "Nursing",
    roomNo: "Room-401",
    phone: "9876543240",
    emergencyContact: "9876543241",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 96,
  },
  {
    sin: "SIN230017",
    name: "Radha Kumari",
    email: "radha.kumari@student.shanmugha.edu",
    dob: "23-05-2003",
    gender: "Female",
    course: "B.Sc Nursing",
    hostel: "Nursing",
    roomNo: "Room-402",
    phone: "9876543242",
    emergencyContact: "9876543243",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 94,
  },
  {
    sin: "SIN230018",
    name: "Sita Rani",
    email: "sita.rani@student.shanmugha.edu",
    dob: "02-09-2003",
    gender: "Female",
    course: "B.Sc Nursing",
    hostel: "Nursing",
    roomNo: "Room-403",
    phone: "9876543244",
    emergencyContact: "9876543245",
    joinDate: "2023-07-15",
    feeStatus: "Overdue",
    attendance: 89,
  },
  {
    sin: "SIN230019",
    name: "Geetha Priya",
    email: "geetha.priya@student.shanmugha.edu",
    dob: "17-01-2003",
    gender: "Female",
    course: "B.Sc Nursing",
    hostel: "Nursing",
    roomNo: "Room-404",
    phone: "9876543246",
    emergencyContact: "9876543247",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 98,
  },
  {
    sin: "SIN230020",
    name: "Manjula Reddy",
    email: "manjula.reddy@student.shanmugha.edu",
    dob: "26-11-2002",
    gender: "Female",
    course: "B.Sc Nursing",
    hostel: "Nursing",
    roomNo: "Room-405",
    phone: "9876543248",
    emergencyContact: "9876543249",
    joinDate: "2023-07-15",
    feeStatus: "Paid",
    attendance: 93,
  },
]

const complaints: Complaint[] = [
  {
    id: "COMP001",
    studentSin: "SIN230001",
    studentName: "Ramesh Kumar",
    title: "WiFi connectivity issue",
    description: "Internet connection is very slow in Room-101",
    category: "Technical",
    priority: "Medium",
    status: "pending",
    submittedDate: "2024-06-01",
    assignedTo: "Joint Warden",
  },
  {
    id: "COMP002",
    studentSin: "SIN230003",
    studentName: "Arjun Patel",
    title: "AC not working",
    description: "Air conditioning unit in Room-103 stopped working",
    category: "Maintenance",
    priority: "High",
    status: "in-progress",
    submittedDate: "2024-06-02",
  },
  {
    id: "COMP003",
    studentSin: "SIN230008",
    studentName: "Kavya Nair",
    title: "Water leakage",
    description: "Bathroom tap is leaking continuously",
    category: "Maintenance",
    priority: "Medium",
    status: "resolved",
    submittedDate: "2024-05-28",
  },
]

const leaveApplications: LeaveApplication[] = [
  {
    id: "LEAVE001",
    studentSin: "SIN230001",
    studentName: "Ramesh Kumar",
    studentId: "STU001",
    roomNumber: "Room-101",
    type: "personal",
    reason: "Family wedding ceremony",
    startDate: "2024-06-15",
    endDate: "2024-06-17",
    status: "pending",
    submittedAt: "2024-06-01T09:00:00Z",
    emergencyContact: "+91 9876543211",
    parentContact: "+91 9876543211",
  },
  {
    id: "LEAVE002",
    studentSin: "SIN230003",
    studentName: "Arjun Patel",
    studentId: "STU002",
    roomNumber: "Room-101",
    type: "medical",
    reason: "Medical appointment for regular checkup",
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    status: "recommended",
    submittedAt: "2024-05-28T14:30:00Z",
    reviewedAt: "2024-05-29T10:15:00Z",
    reviewedBy: "Joint Warden",
    jointWardenRemarks: "Student has provided medical certificate. Recommended for approval.",
    emergencyContact: "+91 9876543215",
    parentContact: "+91 9876543215",
  },
  {
    id: "LEAVE003",
    studentSin: "SIN230008",
    studentName: "Priya Sharma",
    studentId: "STU004",
    roomNumber: "Room-201",
    type: "academic",
    reason: "Attending a workshop on Advanced Literature at Delhi University",
    startDate: "2024-06-20",
    endDate: "2024-06-25",
    status: "approved",
    submittedAt: "2024-06-02T11:45:00Z",
    reviewedAt: "2024-06-03T09:30:00Z",
    reviewedBy: "Admin",
    adminRemarks: "Approved as it's an educational workshop relevant to the student's course.",
    emergencyContact: "+91 9876543213",
    parentContact: "+91 9876543213",
  },
  {
    id: "LEAVE004",
    studentSin: "SIN230009",
    studentName: "Neha Verma",
    studentId: "STU005",
    roomNumber: "Room-201",
    type: "emergency",
    reason: "Family medical emergency - grandmother hospitalized",
    startDate: "2024-06-05",
    endDate: "2024-06-08",
    status: "rejected",
    submittedAt: "2024-06-04T18:20:00Z",
    reviewedAt: "2024-06-04T19:45:00Z",
    reviewedBy: "Admin",
    adminRemarks: "No supporting documentation provided. Please resubmit with proof of emergency.",
    emergencyContact: "+91 9876543217",
    parentContact: "+91 9876543217",
  },
  {
    id: "LEAVE005",
    studentSin: "SIN230007",
    studentName: "Vikram Singh",
    studentId: "STU003",
    roomNumber: "Room-101",
    type: "personal",
    reason: "Sister's wedding ceremony",
    startDate: "2024-07-10",
    endDate: "2024-07-15",
    status: "pending",
    submittedAt: "2024-06-05T10:00:00Z",
    emergencyContact: "+91 9876543219",
    parentContact: "+91 9876543219",
  },
]

const rooms: Room[] = [
  {
    roomNo: "Room-101",
    type: "AC",
    capacity: 2,
    hasRestroom: true,
    hostel: "Engineering",
    currentOccupancy: 2, // Updated to show both Ramesh and Arjun
    cleanliness: "Clean",
    inventory: { cots: 2, tables: 2, chairs: 2, wardrobes: 2, fans: 0 },
  },
  {
    roomNo: "Room-102",
    type: "Non-AC",
    capacity: 2,
    hasRestroom: true,
    hostel: "Engineering",
    currentOccupancy: 2, // Updated to show both Priya and Sneha
    cleanliness: "Clean",
    inventory: { cots: 2, tables: 2, chairs: 2, wardrobes: 2, fans: 2 },
  },
  {
    roomNo: "Room-201",
    type: "AC",
    capacity: 2,
    hasRestroom: true,
    hostel: "Pharmacy",
    currentOccupancy: 1,
    cleanliness: "Clean",
    inventory: { cots: 2, tables: 2, chairs: 2, wardrobes: 2, fans: 0 },
  },
  {
    roomNo: "Room-301",
    type: "Non-AC",
    capacity: 3,
    hasRestroom: true,
    hostel: "Allied Science",
    currentOccupancy: 1,
    cleanliness: "Needs Attention",
    inventory: { cots: 3, tables: 3, chairs: 3, wardrobes: 3, fans: 3 },
  },
  {
    roomNo: "Room-401",
    type: "AC",
    capacity: 2,
    hasRestroom: true,
    hostel: "Nursing",
    currentOccupancy: 1,
    cleanliness: "Clean",
    inventory: { cots: 2, tables: 2, chairs: 2, wardrobes: 2, fans: 0 },
  },
]

// Helper functions
export function getAllStudents(): Student[] {
  return students
}

export function getStudentData(email: string): Student | null {
  return students.find((student) => student.email === email) || null
}

export function getStudentsBySin(sins: string[]): Student[] {
  return students.filter((student) => sins.includes(student.sin))
}

export function getStudentsByHostel(hostel: string): Student[] {
  return students.filter((student) => student.hostel === hostel)
}

export function getAllComplaints(): Complaint[] {
  return complaints
}

export function getComplaintsByStudent(studentSin: string): Complaint[] {
  return complaints.filter((complaint) => complaint.studentSin === studentSin)
}

export function getAllLeaveApplications(): LeaveApplication[] {
  return leaveApplications
}

export function getLeaveApplicationsByStudent(studentSin: string): LeaveApplication[] {
  return leaveApplications.filter((leave) => leave.studentSin === studentSin)
}

export function getAllRooms(): Room[] {
  return rooms
}

export function getRoomsByHostel(hostel: string): Room[] {
  return rooms.filter((room) => room.hostel === hostel)
}

// Joint Warden specific functions (mentoring 5 rooms/students)
export function getJointWardenStudents(): Student[] {
  // Joint Warden mentors students from rooms 201-205 (first 10 students)
  return students.slice(5, 15) // Students from different hostels
}

export function getJointWardenRooms(): Room[] {
  return rooms.filter((room) => ["Room-201", "Room-202", "Room-203", "Room-204", "Room-205"].includes(room.roomNo))
}

export function getJointWardenComplaints(): Complaint[] {
  const mentoredStudentSins = getJointWardenStudents().map((s) => s.sin)
  return complaints.filter((complaint) => mentoredStudentSins.includes(complaint.studentSin))
}

export function getJointWardenLeaveApplications(): LeaveApplication[] {
  return leaveApplications.filter((leave) => leave.status === "pending" || leave.status === "recommended")
}

export function getRoommates(studentEmail: string): Student[] {
  const student = getStudentData(studentEmail)
  if (!student) return []

  return students.filter((s) => s.roomNo === student.roomNo && s.email !== studentEmail)
}
