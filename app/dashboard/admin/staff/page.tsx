"use client"

import { Suspense } from "react"
import { StaffManagementClient } from "./staff-management-client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TrendingUp, Users, Building2, FileText, Calendar, DollarSign } from "lucide-react"

const menuItems = [
  { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
  { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
  { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff", active: true },
  { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
  { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
  { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
  { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave" },
  { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
]

export default function AdminStaffPage() {
  // Initial staff data
  const initialStaff = [
    {
      id: "STF001",
      name: "Dr. Rajesh Kumar",
      employeeId: "EMP001",
      email: "rajesh.kumar@hostel.edu",
      phone: "+91 9876543210",
      role: "Warden",
      department: "Engineering Hostel",
      joinDate: "2020-01-15",
      salary: 75000,
      status: "Active",
      address: "123 Faculty Colony, Chennai",
      emergencyContact: "+91 9876543211",
    },
    {
      id: "STF002",
      name: "Ms. Priya Sharma",
      employeeId: "EMP002",
      email: "priya.sharma@hostel.edu",
      phone: "+91 9876543212",
      role: "Joint Warden",
      department: "Engineering Hostel",
      joinDate: "2021-03-10",
      salary: 45000,
      status: "Active",
      address: "456 Staff Quarters, Chennai",
      emergencyContact: "+91 9876543213",
    },
    {
      id: "STF003",
      name: "Mr. Suresh Babu",
      employeeId: "EMP003",
      email: "suresh.babu@hostel.edu",
      phone: "+91 9876543214",
      role: "Security",
      department: "Security",
      joinDate: "2019-06-20",
      salary: 25000,
      status: "Active",
      address: "789 Security Block, Chennai",
      emergencyContact: "+91 9876543215",
    },
    {
      id: "STF004",
      name: "Mrs. Lakshmi Devi",
      employeeId: "EMP004",
      email: "lakshmi.devi@hostel.edu",
      phone: "+91 9876543216",
      role: "Kitchen",
      department: "Food Services",
      joinDate: "2018-09-05",
      salary: 20000,
      status: "Active",
      address: "321 Kitchen Staff Quarters, Chennai",
      emergencyContact: "+91 9876543217",
    },
    {
      id: "STF005",
      name: "Mr. Raman Pillai",
      employeeId: "EMP005",
      email: "raman.pillai@hostel.edu",
      phone: "+91 9876543218",
      role: "Maintenance",
      department: "Maintenance",
      joinDate: "2020-11-12",
      salary: 30000,
      status: "On Leave",
      address: "654 Maintenance Block, Chennai",
      emergencyContact: "+91 9876543219",
    },
  ]

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <Suspense fallback={<div>Loading...</div>}>
        <StaffManagementClient initialStaff={initialStaff} />
      </Suspense>
    </DashboardLayout>
  )
}
