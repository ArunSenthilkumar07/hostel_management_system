"use server"

import { revalidatePath } from "next/cache"
import { virtualStorage } from "@/lib/virtual-storage"

export async function approveLeaveAction(leaveId: string, remarks: string) {
  try {
    const leaveApplications = virtualStorage.get("leaveApplications")
    const leaveIndex = leaveApplications.findIndex((leave: any) => leave.id === leaveId)

    if (leaveIndex === -1) {
      return { success: false, message: "Leave application not found" }
    }

    virtualStorage.update("leaveApplications", leaveId, {
      status: "approved",
      adminRemarks: remarks,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Admin",
    })

    // Create notification for student
    const leave = virtualStorage.get("leaveApplications").find((l: any) => l.id === leaveId)

    if (leave) {
      const notification = {
        id: `NOTIF${Date.now()}`,
        title: "Leave Application Approved",
        message: `Your leave application from ${leave.startDate} to ${leave.endDate} has been approved.`,
        type: "leave",
        priority: "high",
        timestamp: new Date().toISOString(),
        read: false,
        targetRoles: ["student"],
        targetStudentId: leave.studentId,
      }

      virtualStorage.add("notifications", notification)
    }

    revalidatePath("/dashboard/admin/leave")
    return { success: true, message: "Leave application approved successfully" }
  } catch (error) {
    console.error("Error approving leave:", error)
    return { success: false, message: "Failed to approve leave application" }
  }
}

export async function rejectLeaveAction(leaveId: string, remarks: string) {
  try {
    const leaveApplications = virtualStorage.get("leaveApplications")
    const leaveIndex = leaveApplications.findIndex((leave: any) => leave.id === leaveId)

    if (leaveIndex === -1) {
      return { success: false, message: "Leave application not found" }
    }

    virtualStorage.update("leaveApplications", leaveId, {
      status: "rejected",
      adminRemarks: remarks,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Admin",
    })

    // Create notification for student
    const leave = virtualStorage.get("leaveApplications").find((l: any) => l.id === leaveId)

    if (leave) {
      const notification = {
        id: `NOTIF${Date.now()}`,
        title: "Leave Application Rejected",
        message: `Your leave application from ${leave.startDate} to ${leave.endDate} has been rejected.`,
        type: "leave",
        priority: "high",
        timestamp: new Date().toISOString(),
        read: false,
        targetRoles: ["student"],
        targetStudentId: leave.studentId,
      }

      virtualStorage.add("notifications", notification)
    }

    revalidatePath("/dashboard/admin/leave")
    return { success: true, message: "Leave application rejected successfully" }
  } catch (error) {
    console.error("Error rejecting leave:", error)
    return { success: false, message: "Failed to reject leave application" }
  }
}

export async function exportLeaveDataAction(format: "csv" | "json", filterStatus = "all") {
  try {
    const leaveApplications = virtualStorage.get("leaveApplications")

    // Apply filters if needed
    const filteredData =
      filterStatus === "all"
        ? leaveApplications
        : leaveApplications.filter((leave: any) => leave.status === filterStatus)

    // Format data for export
    const exportData = filteredData.map((leave: any) => ({
      id: leave.id,
      studentName: leave.studentName,
      studentId: leave.studentId,
      roomNumber: leave.roomNumber,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
      submittedAt: leave.submittedAt,
      reviewedAt: leave.reviewedAt || "",
      reviewedBy: leave.reviewedBy || "",
      adminRemarks: leave.adminRemarks || "",
    }))

    return {
      success: true,
      data: exportData,
      format: format,
    }
  } catch (error) {
    console.error("Error exporting leave data:", error)
    return { success: false, message: "Failed to export leave data" }
  }
}

export async function getLeaveStatisticsAction() {
  try {
    const leaveApplications = virtualStorage.get("leaveApplications")

    const stats = {
      total: leaveApplications.length,
      pending: leaveApplications.filter((l: any) => l.status === "pending").length,
      approved: leaveApplications.filter((l: any) => l.status === "approved").length,
      rejected: leaveApplications.filter((l: any) => l.status === "rejected").length,
      recommended: leaveApplications.filter((l: any) => l.status === "recommended").length,

      // Type statistics
      medical: leaveApplications.filter((l: any) => l.type === "medical").length,
      personal: leaveApplications.filter((l: any) => l.type === "personal").length,
      emergency: leaveApplications.filter((l: any) => l.type === "emergency").length,
      academic: leaveApplications.filter((l: any) => l.type === "academic").length,

      // Recent applications (last 5)
      recent: leaveApplications
        .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5),
    }

    return { success: true, stats }
  } catch (error) {
    console.error("Error getting leave statistics:", error)
    return { success: false, message: "Failed to get leave statistics" }
  }
}
