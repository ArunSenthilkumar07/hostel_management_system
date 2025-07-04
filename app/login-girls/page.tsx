"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Info, Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function GirlsLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [loginType, setLoginType] = useState("student")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sinNumber, setSinNumber] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const demoCredentials = {
    student: {
      email: "priya.sharma@student.shanmugha.edu",
      password: "123456",
      sin: "SIN230002",
    },
    warden: {
      email: "warden.girls@shanmugha.edu",
      password: "password123",
    },
    jointWarden: {
      email: "jointwarden.girls@shanmugha.edu",
      password: "password123",
    },
    admin: {
      email: "admin@shanmugha.edu",
      password: "admin123",
    },
  }

  const handleLogin = () => {
    // Demo login logic for girls
    if (loginType === "student") {
      if (email === demoCredentials.student.email && sinNumber === demoCredentials.student.sin) {
        localStorage.setItem("userRole", "student")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userGender", "female")
        router.push("/dashboard/student")
        return
      }
    } else {
      const roleCredentials = demoCredentials[role as keyof typeof demoCredentials]
      if (roleCredentials && email === roleCredentials.email && password === roleCredentials.password) {
        localStorage.setItem("userRole", role)
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userGender", "female")
        router.push(`/dashboard/${role}`)
        return
      }
    }

    toast({
      title: "Login Failed",
      description: "Invalid credentials. Please use demo credentials.",
      variant: "destructive",
    })
  }

  const demoCredentialsStudent = () => {
    setLoginType("student")
    setEmail(demoCredentials.student.email)
    setSinNumber(demoCredentials.student.sin)
  }

  const demoCredentialsStaff = (type: string) => {
    setLoginType("staff")
    setRole(type)
    setEmail(demoCredentials[type as keyof typeof demoCredentials].email)
    setPassword(demoCredentials[type as keyof typeof demoCredentials].password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/login-selection")}
            className="mb-4 text-pink-600 hover:text-pink-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal Selection
          </Button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Image
                src="/logo.jpeg"
                alt="Sri Shanmugha Educational Institutions"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <Heart className="absolute -top-1 -right-1 h-4 w-4 text-pink-500 fill-pink-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Sri Shanmugha
              </h1>
              <p className="text-sm text-gray-600">Educational Institutions</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Girls Hostel Portal
          </h2>
          <p className="text-gray-600">Sign in to your girls hostel account</p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="text-pink-800">Girls Hostel Login</CardTitle>
            <CardDescription>Choose your login type and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Login Type Tabs */}
            <Tabs value={loginType} onValueChange={setLoginType}>
              <TabsList className="grid w-full grid-cols-2 bg-pink-100">
                <TabsTrigger value="student" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Student
                </TabsTrigger>
                <TabsTrigger value="staff" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  Staff
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sin-number">SIN Number</Label>
                  <Input
                    id="sin-number"
                    placeholder="Enter your SIN number"
                    value={sinNumber}
                    onChange={(e) => setSinNumber(e.target.value)}
                    className="border-pink-200 focus:border-pink-500"
                  />
                </div>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warden">Girls Hostel Warden</SelectItem>
                      <SelectItem value="jointWarden">Girls Joint Warden</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Sign In
            </Button>

            {/* Demo Credentials */}
            <Collapsible open={showDemo} onOpenChange={setShowDemo}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full border-pink-200 text-pink-700 hover:bg-pink-50">
                  <Info className="w-4 h-4 mr-2" />
                  Show Demo Credentials
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg space-y-3 border border-pink-200">
                  <h4 className="font-semibold text-sm text-pink-800">Girls Hostel Demo Accounts:</h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-pink-700">Student: priya.sharma@student.shanmugha.edu</p>
                        <p className="text-xs text-pink-600">SIN: SIN230002</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={demoCredentialsStudent}
                        className="border-pink-300 text-pink-700"
                      >
                        Use
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-purple-700">Girls Warden: warden.girls@shanmugha.edu</p>
                        <p className="text-xs text-purple-600">Password: password123</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => demoCredentialsStaff("warden")}
                        className="border-purple-300 text-purple-700"
                      >
                        Use
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-purple-700">
                          Girls Joint Warden: jointwarden.girls@shanmugha.edu
                        </p>
                        <p className="text-xs text-purple-600">Password: password123</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => demoCredentialsStaff("jointWarden")}
                        className="border-purple-300 text-purple-700"
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
