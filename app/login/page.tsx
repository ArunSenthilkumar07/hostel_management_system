"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Info, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function LoginPage() {
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
      email: "ramesh.kumar@student.shanmugha.edu",
      password: "123456",
      sin: "SIN230001",
    },
    warden: {
      email: "warden@shanmugha.edu",
      password: "password123",
    },
    jointWarden: {
      email: "jointwarden@shanmugha.edu",
      password: "password123",
    },
    admin: {
      email: "admin@shanmugha.edu",
      password: "admin123",
    },
  }

  const handleLogin = () => {
    // Demo login logic
    if (loginType === "student") {
      if (email === demoCredentials.student.email && sinNumber === demoCredentials.student.sin) {
        localStorage.setItem("userRole", "student")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userGender", "male")
        router.push("/dashboard/student")
        return
      }
    } else {
      const roleCredentials = demoCredentials[role as keyof typeof demoCredentials]
      if (roleCredentials && email === roleCredentials.email && password === roleCredentials.password) {
        localStorage.setItem("userRole", role)
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userGender", "male")
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/login-selection")}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal Selection
          </Button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/logo.jpeg"
              alt="Sri Shanmugha Educational Institutions"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sri Shanmugha</h1>
              <p className="text-sm text-gray-600">Educational Institutions</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Boys Hostel Portal</h2>
          <p className="text-gray-600">Sign in to your boys hostel account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Boys Hostel Login</CardTitle>
            <CardDescription>Choose your login type and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Type Tabs */}
            <Tabs value={loginType} onValueChange={setLoginType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sin-number">SIN Number</Label>
                  <Input
                    id="sin-number"
                    placeholder="Enter your SIN number"
                    value={sinNumber}
                    onChange={(e) => setSinNumber(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warden">Warden</SelectItem>
                      <SelectItem value="jointWarden">Joint Warden</SelectItem>
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

            <Button onClick={handleLogin} className="w-full">
              Sign In
            </Button>

            {/* Demo Credentials */}
            <Collapsible open={showDemo} onOpenChange={setShowDemo}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Info className="w-4 h-4 mr-2" />
                  Show Demo Credentials
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm">Boys Hostel Demo Accounts:</h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Student: ramesh.kumar@student.shanmugha.edu</p>
                        <p className="text-xs text-gray-600">SIN: SIN230001</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={demoCredentialsStudent}>
                        Use
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Warden: warden@shanmugha.edu</p>
                        <p className="text-xs text-gray-600">Password: password123</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => demoCredentialsStaff("warden")}>
                        Use
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Joint Warden: jointwarden@shanmugha.edu</p>
                        <p className="text-xs text-gray-600">Password: password123</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => demoCredentialsStaff("jointWarden")}>
                        Use
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Admin: admin@shanmugha.edu</p>
                        <p className="text-xs text-gray-600">Password: admin123</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => demoCredentialsStaff("admin")}>
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
