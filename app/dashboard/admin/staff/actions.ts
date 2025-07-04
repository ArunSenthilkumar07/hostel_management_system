"use server"

import { revalidatePath } from "next/cache"

// Mock staff data storage
let staffData = [
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
  // More staff data...
]

export async function addStaffAction(formData: FormData) {
  try {
    const newStaff = {
      id: `STF${Date.now()}`,
      name: formData.get("name") as string,
      employeeId: formData.get("employeeId") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      joinDate: formData.get("joinDate") as string,
      salary: Number.parseInt(formData.get("salary") as string),
      status: formData.get("status") as string,
      address: formData.get("address") as string,
      emergencyContact: formData.get("emergencyContact") as string,
    }

    // Add staff to storage
    staffData.push(newStaff)

    revalidatePath("/dashboard/admin/staff")
    return { success: true, message: "Staff member added successfully" }
  } catch (error) {
    return { success: false, message: "Failed to add staff member" }
  }
}

export async function updateStaffAction(staffId: string, formData: FormData) {
  try {
    const updatedStaff = {
      id: staffId,
      name: formData.get("name") as string,
      employeeId: formData.get("employeeId") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      joinDate: formData.get("joinDate") as string,
      salary: Number.parseInt(formData.get("salary") as string),
      status: formData.get("status") as string,
      address: formData.get("address") as string,
      emergencyContact: formData.get("emergencyContact") as string,
    }

    staffData = staffData.map((s) => (s.id === staffId ? updatedStaff : s))

    revalidatePath("/dashboard/admin/staff")
    return { success: true, message: "Staff member updated successfully" }
  } catch (error) {
    return { success: false, message: "Failed to update staff member" }
  }
}

export async function deleteStaffAction(staffId: string) {
  try {
    staffData = staffData.filter((s) => s.id !== staffId)

    revalidatePath("/dashboard/admin/staff")
    return { success: true, message: "Staff member deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete staff member" }
  }
}
