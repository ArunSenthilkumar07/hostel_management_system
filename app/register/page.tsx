"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { dataOperations } from "@/lib/virtual-storage"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    course: "",
    hostel: "",
    phone: "",
    emergencyContact: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    bloodGroup: "",
    hometown: "",
    hobbies: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate registration delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Register student
      const newStudent = dataOperations.registerStudent({
        ...formData,
        hobbies: formData.hobbies.split(",").map((h) => h.trim()),
        year: 1, // Default to first year
        rollNumber: `24${formData.course.substring(0, 2).toUpperCase()}${Date.now().toString().slice(-3)}`,
      })

      toast({
        title: "Registration Successful!",
        description: `Welcome ${formData.name}! Your SIN is ${newStudent.sin}. You can now login.`,
      })

      // Store registration success info
      localStorage.setItem("registrationSuccess", "true")
      localStorage.setItem("newStudentEmail", formData.email)
      localStorage.setItem("newStudentSIN", newStudent.sin)

      // Redirect to appropriate login page
      if (formData.hostel === "Nursing") {
        router.push("/login-girls")
      } else {
        router.push("/login-selection")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/logo.jpeg"
              alt="Sri Shanmugha Educational Institutions"
              width={60}
              height={60}
              className="rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sri Shanmugha</h1>
              <p className="text-sm text-gray-600">Educational Institutions</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Student Registration</h2>
          <p className="text-gray-600">Join our hostel community and experience modern living</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Registration Form</CardTitle>
            <CardDescription className="text-blue-100">
              Please fill in all the required information to register for hostel accommodation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleInputChange("bloodGroup", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hometown">Hometown</Label>
                    <Input
                      id="hometown"
                      value={formData.hometown}
                      onChange={(e) => handleInputChange("hometown", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Academic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                        <SelectItem value="B.Tech Electronics">B.Tech Electronics</SelectItem>
                        <SelectItem value="B.Tech Mechanical">B.Tech Mechanical</SelectItem>
                        <SelectItem value="B.Tech Civil">B.Tech Civil</SelectItem>
                        <SelectItem value="B.Tech Electrical">B.Tech Electrical</SelectItem>
                        <SelectItem value="B.Pharm">B.Pharm</SelectItem>
                        <SelectItem value="B.Sc Biotechnology">B.Sc Biotechnology</SelectItem>
                        <SelectItem value="B.Sc Microbiology">B.Sc Microbiology</SelectItem>
                        <SelectItem value="B.Sc Biochemistry">B.Sc Biochemistry</SelectItem>
                        <SelectItem value="B.Sc Medical Lab Technology">B.Sc Medical Lab Technology</SelectItem>
                        <SelectItem value="B.Sc Radiology">B.Sc Radiology</SelectItem>
                        <SelectItem value="B.Sc Nursing">B.Sc Nursing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostel">Preferred Hostel *</Label>
                    <Select value={formData.hostel} onValueChange={(value) => handleInputChange("hostel", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select hostel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering (Co-Ed)</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy (Co-Ed)</SelectItem>
                        <SelectItem value="Allied Science">Allied Science (Co-Ed)</SelectItem>
                        <SelectItem value="Nursing">Nursing (Girls Only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Guardian Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) => handleInputChange("guardianName", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                    <Input
                      id="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Number *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Home Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Additional Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="hobbies">Hobbies & Interests (comma separated)</Label>
                  <Input
                    id="hobbies"
                    placeholder="e.g., Reading, Sports, Music"
                    value={formData.hobbies}
                    onChange={(e) => handleInputChange("hobbies", e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Account Security</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-12"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
                <Link href="/login-selection" className="flex-1">
                  <Button type="button" variant="outline" className="w-full h-12">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
