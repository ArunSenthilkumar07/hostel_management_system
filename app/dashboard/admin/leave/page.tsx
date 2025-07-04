"use client"
import { FileText, Users, Building2, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getLeaveStatisticsAction } from "./actions"
import LeaveManagementClient from "./leave-management-client"

export default async function AdminLeaveManagementPage() {
  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Student Management", href: "/dashboard/admin/students" },
    { icon: Users, label: "Staff Management", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Room Management", href: "/dashboard/admin/rooms" },
    { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: FileText, label: "Complaints", href: "/dashboard/admin/complaints" },
    { icon: Calendar, label: "Leave Management", href: "/dashboard/admin/leave", active: true },
    { icon: DollarSign, label: "Fee Management", href: "/dashboard/admin/fees" },
  ]

  // Get initial statistics
  const statsResult = await getLeaveStatisticsAction()
  const initialStats = statsResult.success
    ? statsResult.stats
    : {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        recommended: 0,
        medical: 0,
        personal: 0,
        emergency: 0,
        academic: 0,
        recent: [],
      }

  return (
    <DashboardLayout menuItems={menuItems} userRole="admin" userName="Admin">
      <LeaveManagementClient initialStats={initialStats} />
    </DashboardLayout>
  )
}
