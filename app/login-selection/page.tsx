"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Building2, GraduationCap } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpeg"
                alt="Sri Shanmugha Educational Institutions"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sri Shanmugha</h1>
                <p className="text-sm text-gray-600">Educational Institutions</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Choose Your Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the appropriate login portal based on your hostel category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Boys Hostel Login */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-800">Boys Hostel</CardTitle>
                <CardDescription className="text-blue-600">
                  Engineering, Pharmacy & Allied Science Students
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center justify-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Engineering Block</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Pharmacy Block</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Allied Science Block</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  size="lg"
                >
                  Access Boys Portal
                </Button>
              </CardContent>
            </Card>

            {/* Girls Hostel Login */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-pink-800">Girls Hostel</CardTitle>
                <CardDescription className="text-pink-600">Nursing & Co-Ed Block Female Students</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2 text-sm text-pink-700">
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Nursing Block (Girls Only)</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Engineering Block (Girls)</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Pharmacy Block (Girls)</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/login-girls")}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  size="lg"
                >
                  Access Girls Portal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm">
                If you're unsure which portal to use, contact your hostel warden or the administration office. Each
                portal provides access to room management, attendance tracking, complaints, and other hostel services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
